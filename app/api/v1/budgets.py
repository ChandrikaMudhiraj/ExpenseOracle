from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.services.budget_service import add_budget, list_budgets, update_budget_service, delete_budget_service
from app.api.deps import get_db

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.post("/", response_model=BudgetResponse)
def create_budget_endpoint(budget: BudgetCreate, user_id: int, db: Session = Depends(get_db)):
    return add_budget(db, user_id, budget.dict())


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(budget_id: int, user_id: int, budget: BudgetUpdate, db: Session = Depends(get_db)):
    updated_budget = update_budget_service(db, budget_id, user_id, budget.dict(exclude_unset=True))
    if not updated_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return updated_budget


@router.delete("/{budget_id}")
def delete_budget(budget_id: int, user_id: int, db: Session = Depends(get_db)):
    success = delete_budget_service(db, budget_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"message": "Budget deleted successfully"}


@router.get("/", response_model=List[BudgetResponse])
def get_budgets_endpoint(user_id: int, db: Session = Depends(get_db)):
    return list_budgets(db, user_id)
