import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.session import engine, Base
from app.api import auth, listings, exchanges, matching, repair, impact, rewards, classify

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-assisted circular-economy platform for product reuse, repair, donation, and recycling.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount media uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(listings.router, prefix=api_v1)
app.include_router(exchanges.router, prefix=api_v1)
app.include_router(matching.router, prefix=api_v1)
app.include_router(repair.router, prefix=api_v1)
app.include_router(impact.router, prefix=api_v1)
app.include_router(rewards.router, prefix=api_v1)
app.include_router(classify.router, prefix=api_v1)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "tagline": "Give Every Product Another Life.",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
