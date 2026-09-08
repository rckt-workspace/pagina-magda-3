"""Supabase PostgREST provider for database operations."""

from typing import Any

import httpx


class SupabaseProvider:
    """Adapter for Supabase PostgREST API."""

    def __init__(self, url: str, service_role_key: str):
        """Initialize provider with Supabase credentials."""
        self.url = url
        self.service_role_key = service_role_key

    async def insert_lead(self, lead_data: dict[str, Any]) -> dict[str, Any]:
        """
        Insert a lead into public.leads table.

        Expects lead_data to be a complete payload with all fields
        already prepared by business logic layer.

        Args:
            lead_data: Dictionary with lead fields (company, email, area, comment, etc.)

        Returns:
            Dictionary with id and created lead data

        Raises:
            ValueError: If credentials are not configured
            httpx.HTTPError: If request fails
        """
        if not self.url or not self.service_role_key:
            raise ValueError("Supabase credentials not configured")

        headers = {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

        url = f"{self.url}/rest/v1/leads"

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=lead_data, headers=headers)

            if response.status_code == 201:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    return data[0]
                return data
            elif response.status_code >= 500:
                raise httpx.HTTPStatusError(
                    "Database unavailable",
                    request=response.request,
                    response=response,
                )
            else:
                raise httpx.HTTPStatusError(
                    f"Failed to insert lead: {response.status_code}",
                    request=response.request,
                    response=response,
                )
