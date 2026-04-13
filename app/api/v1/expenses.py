from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate
from app.services.expense_service import add_expense, list_expenses, update_expense_service, delete_expense_service
from typing import List

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return add_expense(db, current_user.id, expense.dict())


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_expense = update_expense_service(db, expense_id, current_user.id, expense.dict(exclude_unset=True))
    if not updated_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated_expense


@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = delete_expense_service(db, expense_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses_endpoint(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return list_expenses(db, current_user.id)
