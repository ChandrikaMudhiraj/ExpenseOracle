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


def update_expense(db: Session, expense_id: int, user_id: int, expense_data: dict):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
    if expense:
        for key, value in expense_data.items():
            if value is not None:
                setattr(expense, key, value)
        db.commit()
        db.refresh(expense)
    return expense


def delete_expense(db: Session, expense_id: int, user_id: int):
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
    if expense:
        db.delete(expense)
        db.commit()
        return True
    return False
