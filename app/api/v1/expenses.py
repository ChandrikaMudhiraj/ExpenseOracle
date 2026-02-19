from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.services.expense_service import add_expense, list_expenses
from typing import List

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, user_id: int, db: Session = Depends(get_db)):
    return add_expense(db, user_id, expense.dict())


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(user_id: int, db: Session = Depends(get_db)):
    return list_expenses(db, user_id)
