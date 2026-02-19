from sqlalchemy.orm import Session
from app.models.budget import Budget


def create_budget(db: Session, user_id: int, budget_data: dict):
    budget = Budget(user_id=user_id, **budget_data)
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def get_budgets_by_user(db: Session, user_id: int):
    return db.query(Budget).filter(Budget.user_id == user_id).all()
