from sqlalchemy.orm import Session
from app.repository.expense_repository import create_expense, get_expenses_by_user


def add_expense(db: Session, user_id: int, expense_data: dict):
    return create_expense(db, user_id, expense_data)


def list_expenses(db: Session, user_id: int):
    return get_expenses_by_user(db, user_id)
