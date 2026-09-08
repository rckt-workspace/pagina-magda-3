"""Health check endpoint."""

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns service status and environment information.
    No external dependencies checked at this stage.
    """
    return {
        "status": "ok",
        "service": "magda-api",
        "environment": settings.app_env,
    }
