from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Dict
from app.api.deps import get_db
from app.services.expense_service import list_expenses
from app.services.budget_service import list_budgets
from app.ml.forecaster import spendingForecaster
from app.ml.anomaly_detector import AnomalyDetector
from app.ml.autonomous_engine import AutonomousEngine
from app.ml.investment_optimizer import InvestmentOptimizer
from app.ml.advisor_chatbot import FinancialAdvisorChatbot
from app.ml.health_score import FinancialHealthScore
from app.ml.metrics_manager import MetricsManager
from app.models.user import User

router = APIRouter(prefix="/ml", tags=["ML & Autonomous Finance"])

def _prepare_expenses(expenses):
    return [{"id": e.id, "amount": e.amount, "title": e.title, "created_at": e.created_at, "category": e.category} for e in expenses]

def _get_user_income(db: Session, user_id: int) -> float:
    user = db.query(User).filter(User.id == user_id).first()
    return user.monthly_income if user else 5000.0 # Default fallback for simulation

@router.get("/forecast")
def get_spending_forecast(user_id: int, db: Session = Depends(get_db)):
    expenses = list_expenses(db, user_id)
    if not expenses:
        return {"prediction": 0.0, "message": "Insufficient data for forecast."}
    
    prepared_data = _prepare_expenses(expenses)
    forecast_result = spendingForecaster.predict_next_month(prepared_data)
    insights = spendingForecaster.get_category_recommendations(prepared_data)
    
    return {
        "user_id": user_id,
        "forecast_analysis": forecast_result,
        "strategic_insights": insights
    }

@router.get("/anomalies")
def get_spending_anomalies(user_id: int, threshold: float = 2.0, db: Session = Depends(get_db)):
    expenses = list_expenses(db, user_id)
    prepared_data = _prepare_expenses(expenses)
    anomalies = AnomalyDetector.detect_anomalies(prepared_data, threshold=threshold)
    
    return {
        "user_id": user_id,
        "anomalies_found": len(anomalies),
        "anomalies": anomalies
    }

@router.get("/autonomous-actions")
def get_autonomous_actions(user_id: int, db: Session = Depends(get_db)):
    expenses = list_expenses(db, user_id)
    budgets = list_budgets(db, user_id)
    income = _get_user_income(db, user_id)
    
    total_monthly_budget = sum([b.amount for b in budgets]) if budgets else 0.0
    prepared_data = _prepare_expenses(expenses)
    
    actions = AutonomousEngine.generate_actions(prepared_data, total_monthly_budget, income)
    
    return {
        "user_id": user_id,
        "current_total_budget": total_monthly_budget,
        "autonomous_actions": actions
    }

@router.get("/investment-simulator")
def simulate_investments(principal: float, years: int = 1):
    return {
        "principal": principal,
        "simulations": InvestmentOptimizer.simulate_monte_carlo(principal, years)
    }

@router.get("/health-score")
def get_health_score(user_id: int, db: Session = Depends(get_db)):
    expenses = list_expenses(db, user_id)
    budgets = list_budgets(db, user_id)
    income = _get_user_income(db, user_id)
    total_monthly_budget = sum([b.amount for b in budgets]) if budgets else 0.0
    
    prepared_data = _prepare_expenses(expenses)
    return FinancialHealthScore.calculate(prepared_data, total_monthly_budget, income)

@router.get("/model-metrics")
def get_ml_metrics(user_id: int, db: Session = Depends(get_db)):
    expenses = list_expenses(db, user_id)
    prepared_data = _prepare_expenses(expenses)
    return MetricsManager.calculate_performance(prepared_data)

@router.post("/chat")
def oracle_chat(user_id: int, query: str = Body(..., embed=True), db: Session = Depends(get_db)):
    expenses = list_expenses(db, user_id)
    budgets = list_budgets(db, user_id)
    income = _get_user_income(db, user_id)
    total_monthly_budget = sum([b.amount for b in budgets]) if budgets else 0.0
    
    prepared_data = _prepare_expenses(expenses)
    return FinancialAdvisorChatbot.process_query(query, user_id, prepared_data, total_monthly_budget, income)
