from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    admin_email: str


class AdminProfile(BaseModel):
    id: str
    email: EmailStr
    display_name: str | None = None

    class Config:
        from_attributes = True
