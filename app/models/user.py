from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from app.core.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    monthly_income = Column(Float, default=0.0)
    monthly_savings = Column(Float, default=0.0)
    risk_tolerance = Column(String, default="Moderate") # Conservative, Moderate, Aggressive
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expenses = relationship("Expense", back_populates="user")
    budgets = relationship("Budget", back_populates="user")
    goals = relationship("Goal", back_populates="user")
