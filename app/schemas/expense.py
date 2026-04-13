from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: Optional[str] = None
    created_at: Optional[datetime] = None
    is_recurring: Optional[bool] = False


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    created_at: Optional[datetime] = None
    is_recurring: Optional[bool] = None


class ExpenseResponse(BaseModel):
    id: int
    user_id: int
    title: str
    amount: float
    category: Optional[str]
    created_at: datetime
    is_recurring: bool = False

    class Config:
        from_attributes = True
