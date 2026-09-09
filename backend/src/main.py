from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.core.config import settings
from src.core.database import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect DB
    await connect_to_mongo()
    yield
    # Shutdown: Close DB
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Hệ thống hoạt động bình thường"}

# TODO: Include routers here (auth, videos, assets, social)
# app.include_router(auth_router, prefix=settings.API_V1_STR + "/auth", tags=["auth"])
