from sqlalchemy.orm import Session
from app.repository.budget_repository import create_budget, get_budgets_by_user


def add_budget(db: Session, user_id: int, budget_data: dict):
    return create_budget(db, user_id, budget_data)


def list_budgets(db: Session, user_id: int):
    return get_budgets_by_user(db, user_id)


def update_budget_service(db: Session, budget_id: int, user_id: int, budget_data: dict):
    from app.repository.budget_repository import update_budget
    return update_budget(db, budget_id, user_id, budget_data)


def delete_budget_service(db: Session, budget_id: int, user_id: int):
    from app.repository.budget_repository import delete_budget
    return delete_budget(db, budget_id, user_id)
