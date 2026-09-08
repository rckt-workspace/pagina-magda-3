"""Tests for lead submission endpoints."""

from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.providers.supabase import SupabaseProvider

client = TestClient(app)


@pytest.fixture
def mock_supabase_provider():
    """Mock Supabase provider for testing."""
    provider = AsyncMock(spec=SupabaseProvider)
    return provider


@pytest.fixture
def mock_settings():
    """Mock settings with Supabase configuration."""
    return {
        "supabase_url": "https://test.supabase.co",
        "supabase_service_role_key": "test-key",
    }


def test_create_lead_success(mock_supabase_provider, mock_settings):
    """Test successful lead creation."""
    lead_id = str(uuid4())
    mock_supabase_provider.insert_lead.return_value = {
        "id": lead_id,
        "status": "new",
        "company": "Test Inc",
        "email": "contact@test.com",
    }

    with patch(
        "app.api.leads.settings.supabase_url", mock_settings["supabase_url"]
    ), patch(
        "app.api.leads.settings.supabase_service_role_key",
        mock_settings["supabase_service_role_key"],
    ), patch(
        "app.api.leads.SupabaseProvider", return_value=mock_supabase_provider
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "Test Inc",
                "email": "contact@test.com",
                "area": "Engineering",
                "comment": "Interested in services",
                "consent_privacy": True,
            },
        )

    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "new"
    assert data["message"] == "Lead received successfully"
    assert "id" in data


def test_create_lead_consent_false(mock_settings):
    """Test that consent_privacy=false is rejected."""
    with patch(
        "app.api.leads.settings.supabase_url", mock_settings["supabase_url"]
    ), patch(
        "app.api.leads.settings.supabase_service_role_key",
        mock_settings["supabase_service_role_key"],
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "Test Inc",
                "email": "contact@test.com",
                "area": "Engineering",
                "comment": "Interested in services",
                "consent_privacy": False,
            },
        )

    assert response.status_code == 422
    assert "consent_privacy must be true" in response.text


def test_create_lead_invalid_email(mock_settings):
    """Test that invalid email is rejected."""
    with patch(
        "app.api.leads.settings.supabase_url", mock_settings["supabase_url"]
    ), patch(
        "app.api.leads.settings.supabase_service_role_key",
        mock_settings["supabase_service_role_key"],
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "Test Inc",
                "email": "not-an-email",
                "area": "Engineering",
                "comment": "Interested in services",
                "consent_privacy": True,
            },
        )

    assert response.status_code == 422


def test_create_lead_company_too_short(mock_settings):
    """Test that company name too short is rejected."""
    with patch(
        "app.api.leads.settings.supabase_url", mock_settings["supabase_url"]
    ), patch(
        "app.api.leads.settings.supabase_service_role_key",
        mock_settings["supabase_service_role_key"],
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "A",
                "email": "contact@test.com",
                "area": "Engineering",
                "comment": "Interested in services",
                "consent_privacy": True,
            },
        )

    assert response.status_code == 422


def test_create_lead_comment_too_short(mock_settings):
    """Test that comment too short is rejected."""
    with patch(
        "app.api.leads.settings.supabase_url", mock_settings["supabase_url"]
    ), patch(
        "app.api.leads.settings.supabase_service_role_key",
        mock_settings["supabase_service_role_key"],
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "Test Inc",
                "email": "contact@test.com",
                "area": "Engineering",
                "comment": "Hi",
                "consent_privacy": True,
            },
        )

    assert response.status_code == 422


def test_create_lead_rejects_server_controlled_fields(mock_settings):
    """Test that server-controlled fields are explicitly rejected."""
    with patch(
        "app.api.leads.settings.supabase_url", mock_settings["supabase_url"]
    ), patch(
        "app.api.leads.settings.supabase_service_role_key",
        mock_settings["supabase_service_role_key"],
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "Test Inc",
                "email": "contact@test.com",
                "area": "Engineering",
                "comment": "Interested in services",
                "consent_privacy": True,
                "status": "qualified",  # Should not be accepted
            },
        )

    assert response.status_code == 422
    assert "extra_forbidden" in response.text or "Extra inputs are not permitted" in response.text


def test_create_lead_no_supabase_config():
    """Test that missing Supabase config returns 503."""
    with patch("app.api.leads.settings.supabase_url", ""), patch(
        "app.api.leads.settings.supabase_service_role_key", ""
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "Test Inc",
                "email": "contact@test.com",
                "area": "Engineering",
                "comment": "Interested in services",
                "consent_privacy": True,
            },
        )

    assert response.status_code == 503
    assert "unavailable" in response.json()["detail"].lower()


def test_create_lead_database_error(mock_supabase_provider, mock_settings):
    """Test that database errors return 502."""
    mock_supabase_provider.insert_lead.side_effect = Exception("Connection failed")

    with patch(
        "app.api.leads.settings.supabase_url", mock_settings["supabase_url"]
    ), patch(
        "app.api.leads.settings.supabase_service_role_key",
        mock_settings["supabase_service_role_key"],
    ), patch(
        "app.api.leads.SupabaseProvider", return_value=mock_supabase_provider
    ):
        response = client.post(
            "/api/v1/leads",
            json={
                "company": "Test Inc",
                "email": "contact@test.com",
                "area": "Engineering",
                "comment": "Interested in services",
                "consent_privacy": True,
            },
        )

    assert response.status_code == 502
    assert "database_unavailable" in response.json()["detail"]


def test_health_check_still_works():
    """Test that health endpoint still works."""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "magda-api"


def test_root_endpoint():
    """Test that root endpoint still works."""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "magda-api"
    assert data["health"] == "/health"
