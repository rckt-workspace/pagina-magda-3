"""Health check endpoint tests."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    """Test GET /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "magda-api"
    assert data["environment"] in ["development", "production", "testing"]


def test_root_endpoint():
    """Test GET / endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "magda-api"
    assert data["docs"] == "/docs"
    assert data["health"] == "/health"
