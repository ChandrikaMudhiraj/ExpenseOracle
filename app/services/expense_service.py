from sqlalchemy.orm import Session
from app.repository.expense_repository import create_expense, get_expenses_by_user
from app.ml.categorizer import MerchantCategorizer


def add_expense(db: Session, user_id: int, expense_data: dict):
    if not expense_data.get("category"):
        expense_data["category"] = MerchantCategorizer.categorize(expense_data.get("title", ""))
    return create_expense(db, user_id, expense_data)


def list_expenses(db: Session, user_id: int):
    return get_expenses_by_user(db, user_id)
