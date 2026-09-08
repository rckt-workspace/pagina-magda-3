# Magda API Backend

FastAPI-based backend for the Magda professional services platform.

## Requirements

- Python 3.12
- pip or uv package manager

## Local Development Setup

### 1. Create Virtual Environment

**Python 3.12 required**. If multiple Python versions are installed, use:

```powershell
py -3.12 -m venv .venv
```

Or if only Python 3.12 is available:

```powershell
python -m venv .venv
```

### 2. Activate Virtual Environment

**Windows PowerShell**:

```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS/Linux**:

```bash
source .venv/bin/activate
```

### 3. Upgrade pip

```powershell
python -m pip install --upgrade pip
```

### 4. Install Dependencies

```powershell
pip install -e ".[dev]"
```

This installs:
- `fastapi` — Web framework
- `uvicorn[standard]` — ASGI server
- `pydantic-settings` — Configuration management
- Development tools: `pytest`, `httpx`, `ruff`

## Running Tests

```powershell
pytest -q
```

Expected output:
```
2 passed
```

## Linting

```powershell
ruff check .
```

## Running Locally

```powershell
uvicorn app.main:app --reload --port 8100
```

API will be available at:
- **API**: http://127.0.0.1:8100
- **Swagger Docs**: http://127.0.0.1:8100/docs
- **ReDoc**: http://127.0.0.1:8100/redoc
- **Health**: http://127.0.0.1:8100/health

## Configuration

Configuration is loaded from environment variables. See `.env.example` for available settings.

To use custom environment:

1. Copy `.env.example` to `.env`
2. Customize values as needed
3. uvicorn automatically loads from `.env`

**Variables**:

- `APP_NAME` — Application name (default: "Magda API")
- `APP_ENV` — Environment (default: "development")
- `API_V1_PREFIX` — API prefix (default: "/api/v1")
- `CORS_ORIGINS` — Comma-separated CORS origins

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── api/
│   │   ├── __init__.py
│   │   └── health.py        # Health check endpoints
│   └── core/
│       ├── __init__.py
│       └── config.py        # Configuration (Pydantic Settings)
├── tests/
│   ├── __init__.py
│   └── test_health.py       # Health endpoint tests
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── pyproject.toml           # Python project configuration
└── README.md                # This file
```

## Endpoints (Foundation Phase)

### `GET /`

Service information and links.

**Response**:
```json
{
  "service": "magda-api",
  "docs": "/docs",
  "health": "/health"
}
```

### `GET /health`

Health check endpoint (no external dependencies).

**Response**:
```json
{
  "status": "ok",
  "service": "magda-api",
  "environment": "development"
}
```

## Coming Soon

- FastAPI integration with Supabase
- OpenRouter LLM integration
- AI agent service
- Lead form submission handling
- Analytics and observability
- Authentication and authorization

## Notes

This is the **foundation phase** of the backend. Current focus is on:

1. ✅ FastAPI startup
2. ✅ Environment configuration
3. ✅ CORS middleware
4. ✅ Health check endpoint
5. ✅ Test infrastructure

No external integrations (Supabase, OpenRouter, etc.) are implemented yet.

## License

Proprietary (RCKT Foundation)
