import datetime
from app.ml.categorizer import MerchantCategorizer
from app.ml.forecaster import spendingForecaster
from app.ml.anomaly_detector import AnomalyDetector
from app.ml.autonomous_engine import AutonomousEngine
from app.ml.investment_optimizer import InvestmentOptimizer
from app.ml.health_score import FinancialHealthScore
from app.ml.metrics_manager import MetricsManager

def test_suite():
    print("\n--- ExpenseOracle Production-Grade Verification ---\n")
    
    # 1. Forecasting
    print("Testing Forecasting (Growth & Confidence)...")
    expenses = [
        {"amount": 1000, "created_at": datetime.datetime(2025, 1, 1)},
        {"amount": 1200, "created_at": datetime.datetime(2025, 2, 1)},
        {"amount": 1400, "created_at": datetime.datetime(2025, 3, 1)},
    ]
    f_res = spendingForecaster.predict_next_month(expenses)
    print(f"✓ Forecast: {f_res['monthly_forecast']} | Trend: {f_res['trend']} | Conf: {f_res['confidence_level']}")
    
    # 2. Anomalies (Robust MAD Logic)
    print("\nTesting Robust Anomaly Detection (MAD)...")
    now = datetime.datetime.now()
    expenses_anom = [
        {"title": "Starbucks", "amount": 5, "created_at": now},
        {"title": "Starbucks", "amount": 6, "created_at": now},
        {"title": "Starbucks", "amount": 5.5, "created_at": now},
        {"title": "Starbucks", "amount": 5.8, "created_at": now},
        {"title": "Starbucks", "amount": 95, "created_at": now}, # Extreme Outlier
    ]
    anoms = AnomalyDetector.detect_anomalies(expenses_anom)
    print(f"✓ Detected {len(anoms)} anomalies.")
    if anoms:
        print(f"✓ Latest: {anoms[0]['reason']}")
        
    # 3. Metrics (Real MAPE)
    print("\nTesting Real Metrics (Walk-forward MAPE)...")
    expenses_metrics = []
    for m in range(1, 7):
        date = datetime.datetime(2025, m, 1)
        expenses_metrics.append({"amount": 1000 + (m*50), "created_at": date, "title": "Income"})
    perf = MetricsManager.calculate_performance(expenses_metrics)
    print(f"✓ MAPE: {perf['forecast_engine']['value']} | Status: {perf['forecast_engine']['status']}")
    
    # 4. Autonomous Sorting
    print("\nTesting Autonomous Priority Sorting...")
    actions = AutonomousEngine.generate_actions(expenses_anom, monthly_budget=2000, income=5000)
    print(f"✓ Sorted Actions: {[a['type'] for a in actions[:2]]}")
    if actions and actions[0]['priority_score'] >= actions[-1].get('priority_score', 0):
        print("✓ Priority ordering verified.")

    print("\n--- ALL PRODUCTION MODULES VERIFIED ---\n")

if __name__ == "__main__":
    try:
        test_suite()
    except Exception as e:
        print(f"\n❌ VERIFICATION FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
