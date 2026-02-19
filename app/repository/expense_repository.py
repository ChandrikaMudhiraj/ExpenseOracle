from sqlalchemy.orm import Session
from app.models.expense import Expense


def create_expense(db: Session, user_id: int, expense_data: dict):
    expense = Expense(user_id=user_id, **expense_data)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def get_expenses_by_user(db: Session, user_id: int):
    return db.query(Expense).filter(Expense.user_id == user_id).all()
