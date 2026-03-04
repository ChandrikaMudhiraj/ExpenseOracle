from sqlalchemy.orm import Session
from app.repository.budget_repository import create_budget, get_budgets_by_user
from app.core.cache_manager import CacheManager


def add_budget(db: Session, user_id: int, budget_data: dict):
    budget = create_budget(db, user_id, budget_data)
    CacheManager.delete(f"health_score:{user_id}")
    return budget


def list_budgets(db: Session, user_id: int):
    return get_budgets_by_user(db, user_id)


def update_budget_service(db: Session, budget_id: int, user_id: int, budget_data: dict):
    from app.repository.budget_repository import update_budget
    budget = update_budget(db, budget_id, user_id, budget_data)
    if budget:
        CacheManager.delete(f"health_score:{user_id}")
    return budget


def delete_budget_service(db: Session, budget_id: int, user_id: int):
    from app.repository.budget_repository import delete_budget
    success = delete_budget(db, budget_id, user_id)
    if success:
        CacheManager.delete(f"health_score:{user_id}")
    return success
