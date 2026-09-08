"""Lead submission endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import settings
from app.providers.supabase import SupabaseProvider
from app.schemas.lead import LeadCreate, LeadResponse
from app.services.lead_service import LeadService

router = APIRouter(prefix="/leads", tags=["leads"])


def get_lead_service() -> LeadService:
    """Dependency: provide LeadService with configured provider."""
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Lead service is unavailable",
        )
    provider = SupabaseProvider(
        url=settings.supabase_url,
        service_role_key=settings.supabase_service_role_key,
    )
    return LeadService(provider)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=LeadResponse)
async def create_lead(
    lead_create: LeadCreate,
    service: LeadService = Depends(get_lead_service),
) -> LeadResponse:
    """
    Submit a new lead.

    Accepts contact information with explicit privacy consent.
    """
    try:
        return await service.create_lead(lead_create)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="database_unavailable",
        ) from e
