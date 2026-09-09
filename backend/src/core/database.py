from motor.motor_asyncio import AsyncIOMotorClient
from src.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(settings.MONGO_URI)
    db_instance.db = db_instance.client[settings.MONGO_DB_NAME]
    print("✅ Đã kết nối MongoDB")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("❌ Đã ngắt kết nối MongoDB")

def get_database():
    return db_instance.db
