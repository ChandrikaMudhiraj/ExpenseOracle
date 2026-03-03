from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Dict
from app.api.deps import get_db, get_current_user
from app.services.expense_service import list_expenses
from app.services.budget_service import list_budgets
from app.ml.forecaster import spendingForecaster
from app.ml.anomaly_detector import AnomalyDetector
from app.ml.autonomous_engine import AutonomousEngine
from app.ml.investment_optimizer import InvestmentOptimizer
from app.ml.advisor_chatbot import FinancialAdvisorChatbot
from app.ml.health_score import FinancialHealthScore
from app.ml.metrics_manager import MetricsManager
from app.ml.analytics import AnalyticsEngine
from app.models.user import User
from app.core.cache_manager import CacheManager
from app.core.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/ml", tags=["ML & Autonomous Finance"])

def _prepare_expenses(expenses):
    return [{"id": e.id, "amount": e.amount, "title": e.title, "created_at": e.created_at, "category": e.category} for e in expenses]

@router.get("/forecast")
def get_spending_forecast(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    # 1. Try Cache First
    cache_key = f"forecast:{user_id}"
    cached_res = CacheManager.get(cache_key)
    if cached_res:
        return cached_res
    
    expenses = list_expenses(db, user_id)
    if not expenses:
        return {"prediction": 0.0, "message": "Insufficient data for forecast."}
    
    prepared_data = _prepare_expenses(expenses)
    forecast_result = spendingForecaster.predict_next_month(prepared_data)
    insights = spendingForecaster.get_category_recommendations(prepared_data)
    
    response = {
        "user_id": user_id,
        "forecast_analysis": forecast_result,
        "strategic_insights": insights
    }
    
    CacheManager.set(cache_key, response, expire=3600)
    return response

@router.get("/anomalies")
def get_spending_anomalies(threshold: float = 2.0, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expenses = list_expenses(db, current_user.id)
    prepared_data = _prepare_expenses(expenses)
    anomalies = AnomalyDetector.detect_anomalies(prepared_data, threshold=threshold)
    
    return {
        "user_id": current_user.id,
        "anomalies_found": len(anomalies),
        "anomalies": anomalies
    }

@router.get("/autonomous-actions")
def get_autonomous_actions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not settings.AUTONOMOUS_ENABLED:
        raise HTTPException(status_code=503, detail="Autonomous features are disabled")
    
    user_id = current_user.id
    expenses = list_expenses(db, user_id)
    budgets = list_budgets(db, user_id)
    income = current_user.monthly_income or 0.0
    
    total_monthly_budget = sum([b.limit_amount for b in budgets]) if budgets else 0.0
    prepared_data = _prepare_expenses(expenses)
    
    actions = AutonomousEngine.generate_actions(prepared_data, total_monthly_budget, income)
    
    return {
        "user_id": user_id,
        "current_total_budget": total_monthly_budget,
        "autonomous_actions": actions
    }

@router.get("/investment-simulator")
def simulate_investments(current_user: User = Depends(get_current_user)):
    if not settings.ENABLE_HEAVY_ML:
        raise HTTPException(status_code=503, detail="Investment simulation is disabled by feature flag")
    
    income = current_user.monthly_income or 0.0
    # Use 20% of income as default simulation principal if not provided
    principal = income * 0.2
    
    return {
        "principal": principal,
        "simulations": InvestmentOptimizer.simulate_future_growth(principal, 1)
    }

@router.get("/health-score")
def get_health_score(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    # 1. Try Cache
    cache_key = f"health_score:{user_id}"
    cached_res = CacheManager.get(cache_key)
    if cached_res:
        return cached_res
        
    expenses = list_expenses(db, user_id)
    budgets = list_budgets(db, user_id)
    income = current_user.monthly_income or 0.0
    total_monthly_budget = sum([b.limit_amount for b in budgets]) if budgets else 0.0
    
    prepared_data = _prepare_expenses(expenses)
    result = FinancialHealthScore.calculate(prepared_data, total_monthly_budget, income)
    
    CacheManager.set(cache_key, result, expire=1800)
    return result

@router.get("/model-metrics")
def get_ml_metrics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expenses = list_expenses(db, current_user.id)
    prepared_data = _prepare_expenses(expenses)
    return MetricsManager.calculate_performance(prepared_data)

@router.post("/chat")
def oracle_chat(query: str = Body(..., embed=True), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not settings.ENABLE_HEAVY_ML:
        raise HTTPException(status_code=503, detail="Chat advisor is disabled by feature flag")
    
    user_id = current_user.id
    expenses = list_expenses(db, user_id)
    budgets = list_budgets(db, user_id)
    income = current_user.monthly_income or 0.0
    total_monthly_budget = sum([b.limit_amount for b in budgets]) if budgets else 0.0
    
    prepared_data = _prepare_expenses(expenses)
    return FinancialAdvisorChatbot.process_query(query, user_id, prepared_data, total_monthly_budget, income)

@router.get("/analytics")
def get_visual_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = current_user.id
    expenses = list_expenses(db, user_id)
    prepared_data = _prepare_expenses(expenses)
    
    income = current_user.monthly_income or 10000.0
    
    forecast_vs_actual = AnalyticsEngine.get_forecast_vs_actual(prepared_data)
    sim_data = InvestmentOptimizer.simulate_future_growth(income, 1)
    growth_distribution = AnalyticsEngine.get_monte_carlo_distribution(sim_data)
    
    return {
        "user_id": user_id,
        "series": {
            "forecast_vs_actual": forecast_vs_actual,
            "wealth_probability_distribution": growth_distribution
        }
    }
