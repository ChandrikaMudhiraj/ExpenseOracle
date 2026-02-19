from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.budget import BudgetCreate, BudgetResponse
from app.services.budget_service import add_budget, list_budgets
from app.api.deps import get_db

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.post("/", response_model=BudgetResponse)
def create_budget_endpoint(budget: BudgetCreate, user_id: int, db: Session = Depends(get_db)):
    return add_budget(db, user_id, budget.dict())


@router.get("/", response_model=List[BudgetResponse])
def get_budgets_endpoint(user_id: int, db: Session = Depends(get_db)):
    return list_budgets(db, user_id)
