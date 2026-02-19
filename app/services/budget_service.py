from sqlalchemy.orm import Session
from app.repository.budget_repository import create_budget, get_budgets_by_user


def add_budget(db: Session, user_id: int, budget_data: dict):
    return create_budget(db, user_id, budget_data)


def list_budgets(db: Session, user_id: int):
    return get_budgets_by_user(db, user_id)
