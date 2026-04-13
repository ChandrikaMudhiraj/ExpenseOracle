from sqlalchemy.orm import Session
from app.models.user import User


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, email: str, hashed_password: str, monthly_income: float = 0.0, risk_tolerance: str = "Moderate", savings_target_percent: float = 20.0):
    user = User(
        email=email, 
        hashed_password=hashed_password, 
        monthly_income=monthly_income,
        risk_tolerance=risk_tolerance,
        monthly_savings=(monthly_income * savings_target_percent / 100)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_profile(db: Session, user_id: int, income: float, savings: float, risk: str, target_pct: float = 20.0):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.monthly_income = income
        user.monthly_savings = savings
        user.risk_tolerance = risk
        user.savings_target_percent = target_pct
        db.commit()
        db.refresh(user)
    return user
