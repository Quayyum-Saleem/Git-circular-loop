import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CircularLoop"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-only-insecure-key-change-before-deployment")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./circularloop.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads")))
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
