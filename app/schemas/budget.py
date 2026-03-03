from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BudgetCreate(BaseModel):
    category: str
    limit_amount: float


class BudgetUpdate(BaseModel):
    category: Optional[str] = None
    limit_amount: Optional[float] = None


class BudgetResponse(BaseModel):
    id: int
    user_id: int
    category: str
    limit_amount: float
    created_at: datetime

    class Config:
        from_attributes = True
