from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "KLINK AI CORE"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # MongoDB
    MONGO_URI: str
    MONGO_DB_NAME: str
    
    # Redis
    REDIS_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    
    # Cloud Storage (S3 / Cloudinary)
    CLOUD_STORAGE_API_KEY: Optional[str] = None
    CLOUD_STORAGE_API_SECRET: Optional[str] = None
    CLOUD_STORAGE_BUCKET_NAME: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
