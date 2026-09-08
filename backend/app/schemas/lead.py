"""Lead request/response schemas."""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class LeadCreate(BaseModel):
    """Schema for creating a new lead from client submission."""

    model_config = ConfigDict(extra="forbid")

    company: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    area: str = Field(..., min_length=2, max_length=100)
    comment: str = Field(..., min_length=3, max_length=2000)
    consent_privacy: bool
    session_id: UUID | None = None

    @field_validator("company", "area", "comment", mode="before")
    @classmethod
    def trim_strings(cls, v: str) -> str:
        """Trim whitespace from string fields."""
        if isinstance(v, str):
            return v.strip()
        return v

    @field_validator("consent_privacy")
    @classmethod
    def consent_must_be_true(cls, v: bool) -> bool:
        """Consent must be explicitly true."""
        if not v:
            raise ValueError("consent_privacy must be true")
        return v


class LeadResponse(BaseModel):
    """Schema for successful lead creation response."""

    id: str
    status: str
    message: str
