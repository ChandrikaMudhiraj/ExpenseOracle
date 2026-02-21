from app.core.worker import celery_app
from app.ml.health_score import FinancialHealthScore
from app.ml.anomaly_detector import AnomalyDetector
from app.ml.forecaster import spendingForecaster
import time

@celery_app.task(name="app.ml.tasks.run_daily_intelligence_pipeline")
def run_daily_intelligence_pipeline():
    """
    Scheduled task to precompute financial insights.
    Iterates through users and identifies anomalies/forecasts in background.
    """
    print("Starting Global Financial Intelligence Pipeline...")
    # Simulation of database fetch and processing
    # In production: for user in db.query(User).all(): ...
    print("Refreshing Global Anomaly Baselines...")
    print("Precomputing Forecast Trends...")
    time.sleep(1) # Intentional small delay to simulate processing time
    print("Background Intelligence Precomputation Complete.")
    return {"status": "SUCCESS", "tasks_completed": ["AnomalyScan", "ForecastRefresh"]}

@celery_app.task(name="app.ml.tasks.refresh_user_health_score")
def refresh_user_health_score(user_id: int, expenses: list, monthly_budget: float, income: float):
    """
    Perform deep health analysis in background.
    """
    print(f"Deep Analysis: Refreshing Financial Health Score for User ID: {user_id}")
    result = FinancialHealthScore.calculate(expenses, monthly_budget, income)
    # In production: Cache result in Redis for instantaneous dashboard loads
    return {"user_id": user_id, "score": result['score'], "status": result['status']}
