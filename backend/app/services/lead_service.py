"""Lead service for business logic."""

from datetime import datetime, timezone
from typing import Any

from app.providers.supabase import SupabaseProvider
from app.schemas.lead import LeadCreate, LeadResponse


class LeadService:
    """Service for managing lead submissions."""

    def __init__(self, provider: SupabaseProvider):
        """Initialize service with a data provider."""
        self.provider = provider

    def _build_lead_payload(self, lead_create: LeadCreate) -> dict[str, Any]:
        """
        Build the complete lead payload with server-controlled fields.

        Args:
            lead_create: Validated lead creation request

        Returns:
            Dictionary ready for database insertion
        """
        return {
            "company": lead_create.company,
            "email": lead_create.email,
            "area": lead_create.area,
            "comment": lead_create.comment,
            "source": "website",
            "status": "new",
            "consent_privacy": lead_create.consent_privacy,
            "consent_at": datetime.now(timezone.utc).isoformat(),
            "session_id": str(lead_create.session_id) if lead_create.session_id else None,
            "metadata": {},
        }

    async def create_lead(self, lead_create: LeadCreate) -> LeadResponse:
        """
        Create a new lead.

        Args:
            lead_create: Validated lead creation request

        Returns:
            LeadResponse with created lead id and status

        Raises:
            ValueError: If validation fails
            httpx.HTTPError: If database operation fails
        """
        payload = self._build_lead_payload(lead_create)
        result = await self.provider.insert_lead(payload)

        return LeadResponse(
            id=str(result.get("id")),
            status=result.get("status", "new"),
            message="Lead received successfully",
        )
