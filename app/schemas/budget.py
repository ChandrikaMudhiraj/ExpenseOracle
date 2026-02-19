from pydantic import BaseModel
from datetime import datetime


class BudgetCreate(BaseModel):
    category: str
    limit_amount: float


class BudgetResponse(BaseModel):
    id: int
    user_id: int
    category: str
    limit_amount: float
    created_at: datetime

    class Config:
        from_attributes = True
