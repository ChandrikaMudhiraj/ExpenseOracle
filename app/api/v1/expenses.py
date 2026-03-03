from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate
from app.services.expense_service import add_expense, list_expenses, update_expense_service, delete_expense_service
from typing import List

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, user_id: int, db: Session = Depends(get_db)):
    return add_expense(db, user_id, expense.dict())


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, user_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db)):
    updated_expense = update_expense_service(db, expense_id, user_id, expense.dict(exclude_unset=True))
    if not updated_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated_expense


@router.delete("/{expense_id}")
def delete_expense(expense_id: int, user_id: int, db: Session = Depends(get_db)):
    success = delete_expense_service(db, expense_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(user_id: int, db: Session = Depends(get_db)):
    return list_expenses(db, user_id)
