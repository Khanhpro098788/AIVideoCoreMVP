from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from src.core.database import get_database
from src.auth.service import decode_token
from src.auth.models import UserInDB

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except ValueError:
        raise credentials_exception
        
    db = get_database()
    from bson.objectid import ObjectId
    try:
        user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise credentials_exception
        
    if user_doc is None:
        raise credentials_exception
        
    user_doc["_id"] = str(user_doc["_id"])
    return UserInDB(**user_doc)

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    return current_user
