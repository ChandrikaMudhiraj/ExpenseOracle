from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: Optional[datetime] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[datetime] = None


class GoalResponse(GoalBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
