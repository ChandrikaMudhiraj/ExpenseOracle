from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    monthly_income: float = 0.0
    risk_tolerance: str = "Moderate"
    savings_target_percent: float = 20.0


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    monthly_income: float
    monthly_savings: float
    risk_tolerance: str
    savings_target_percent: float = 20.0
    created_at: datetime

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    monthly_income: float
    monthly_savings: float
    risk_tolerance: str
    savings_target_percent: float = 20.0
