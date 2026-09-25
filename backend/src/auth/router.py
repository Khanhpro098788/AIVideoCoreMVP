from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from pydantic import BaseModel
from src.core.database import get_database
from src.auth.schemas import UserCreate, UserLogin, UserResponse, Token, PasswordChange, ResendOTPRequest, VerifyOTPRequest
from src.auth.models import UserInDB
from src.auth.service import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from src.auth.dependencies import get_current_user
from src.core.config import settings
from bson.objectid import ObjectId
import random
from datetime import datetime, timedelta
import asyncio
from src.auth.email_utils import send_otp_email

router = APIRouter()

@router.post("/resend-otp", status_code=status.HTTP_202_ACCEPTED)
async def resend_otp(request: ResendOTPRequest):
    db = get_database()
    # Check if user exists and is not verified
    existing_user = await db.users.find_one({"email": request.email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    if existing_user.get("is_verified", False):
        raise HTTPException(status_code=400, detail="User is already verified")
        
    otp_code = str(random.randint(100000, 999999))
    expire_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Store OTP in otps collection
    await db.otps.update_one(
        {"email": request.email},
        {"$set": {"otp": otp_code, "expire_at": expire_at, "used": False}},
        upsert=True
    )
    
    # Send email asynchronously
    if settings.SMTP_USER and settings.SMTP_PASSWORD:
        asyncio.create_task(asyncio.to_thread(send_otp_email, request.email, otp_code))
    
    return {"message": "OTP has been resent to your email"}

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    db = get_database()
    # Check if user exists
    existing_user = await db.users.find_one({"$or": [{"email": user.email}, {"username": user.username}]})
    if existing_user:
        raise HTTPException(status_code=409, detail="Username or email already registered")
        
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    user_dict["token_version"] = 1
    user_dict["is_verified"] = False
    
    result = await db.users.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    
    # Generate and send OTP automatically
    otp_code = str(random.randint(100000, 999999))
    expire_at = datetime.utcnow() + timedelta(minutes=5)
    await db.otps.update_one(
        {"email": user.email},
        {"$set": {"otp": otp_code, "expire_at": expire_at, "used": False}},
        upsert=True
    )
    if settings.SMTP_USER and settings.SMTP_PASSWORD:
        asyncio.create_task(asyncio.to_thread(send_otp_email, user.email, otp_code))
        
    return user_dict

@router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(request: VerifyOTPRequest):
    db = get_database()
    
    # Verify OTP
    otp_record = await db.otps.find_one({
        "email": request.email, 
        "otp": request.otp, 
        "used": False,
        "expire_at": {"$gt": datetime.utcnow()}
    })
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    # Mark OTP as used
    await db.otps.update_one({"_id": otp_record["_id"]}, {"$set": {"used": True}})
    
    # Mark user as verified
    await db.users.update_one({"email": request.email}, {"$set": {"is_verified": True}})
    
    return {"message": "Account verified successfully"}

@router.post("/signin", response_model=Token)
async def signin(response: Response, user: UserLogin):
    db = get_database()
    user_doc = await db.users.find_one({"email": user.email})
    if not user_doc or not verify_password(user.password, user_doc["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    if not user_doc.get("is_verified", False):
        raise HTTPException(status_code=403, detail="Account not verified. Please verify your email first.")
        
    user_id = str(user_doc["_id"])
    token_version = user_doc.get("token_version", 1)
    
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id, "tv": token_version})
    
    # Set HttpOnly Cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False, # Set to False for localhost development without HTTPS
        samesite="lax", # Change to lax for local development
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    try:
        payload = decode_token(refresh_token)
        user_id = payload.get("sub")
        token_version = payload.get("tv")
        if user_id is None or token_version is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token payload")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
        
    db = get_database()
    user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
        
    current_tv = user_doc.get("token_version", 1)
    if current_tv != token_version:
        # Token revoked
        response.delete_cookie("refresh_token")
        raise HTTPException(status_code=401, detail="Token revoked. Please login again.")
        
    access_token = create_access_token(data={"sub": str(user_id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.patch("/password", status_code=status.HTTP_200_OK)
async def change_password(response: Response, pwd_data: PasswordChange, current_user: UserInDB = Depends(get_current_user)):
    if not verify_password(pwd_data.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    hashed_new_password = get_password_hash(pwd_data.new_password)
    db = get_database()
    
    # Update password and increment token_version
    await db.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"hashed_password": hashed_new_password}, "$inc": {"token_version": 1}}
    )
    
    response.delete_cookie("refresh_token")
    return {"message": "Password updated successfully. Please login again."}

@router.post("/signout", status_code=status.HTTP_204_NO_CONTENT)
async def signout(response: Response):
    response.delete_cookie("refresh_token")
    return None
    
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user
