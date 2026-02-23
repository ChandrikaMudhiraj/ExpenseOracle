from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    monthly_income: float
    monthly_savings: float
    risk_tolerance: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
