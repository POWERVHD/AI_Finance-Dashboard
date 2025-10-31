"""
Finance Dashboard API - Main Application

FastAPI application with:
- CORS middleware for frontend communication
- API v1 router with authentication endpoints
- Automatic table creation on startup
- Swagger documentation at /docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    description="AI-Powered Finance Dashboard API - Stage 1"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# NOTE: Database tables are now managed by Alembic migrations
# To create/update tables, run: alembic upgrade head
# To create a new migration, run: alembic revision --autogenerate -m "description"


@app.get("/")
async def root():
    """
    Root endpoint - Health check.

    Returns:
        dict: API status and information
    """
    return {
        "status": "ok",
        "message": "Finance Dashboard API",
        "version": "1.0.0",
        "docs": "/docs",
        "api_prefix": settings.API_V1_PREFIX
    }
