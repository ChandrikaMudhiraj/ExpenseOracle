from sqlalchemy.orm import Session
from app.repository.expense_repository import create_expense, get_expenses_by_user
from app.ml.categorizer import MerchantCategorizer
from app.core.cache_manager import CacheManager


def add_expense(db: Session, user_id: int, expense_data: dict):
    if not expense_data.get("category"):
        expense_data["category"] = MerchantCategorizer.categorize(expense_data.get("title", ""))
    expense = create_expense(db, user_id, expense_data)
    CacheManager.delete(f"health_score:{user_id}")
    CacheManager.delete(f"forecast:{user_id}")
    return expense


def list_expenses(db: Session, user_id: int):
    return get_expenses_by_user(db, user_id)


def update_expense_service(db: Session, expense_id: int, user_id: int, expense_data: dict):
    from app.repository.expense_repository import update_expense
    expense = update_expense(db, expense_id, user_id, expense_data)
    if expense:
        CacheManager.delete(f"health_score:{user_id}")
        CacheManager.delete(f"forecast:{user_id}")
    return expense


def delete_expense_service(db: Session, expense_id: int, user_id: int):
    from app.repository.expense_repository import delete_expense
    success = delete_expense(db, expense_id, user_id)
    if success:
        CacheManager.delete(f"health_score:{user_id}")
        CacheManager.delete(f"forecast:{user_id}")
    return success
