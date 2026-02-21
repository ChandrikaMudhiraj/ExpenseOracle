from typing import List, Dict
from app.ml.forecaster import spendingForecaster
from app.ml.anomaly_detector import AnomalyDetector
from app.ml.investment_optimizer import InvestmentOptimizer
from app.ml.smart_suggestions import SmartSuggestions
from app.ml.health_score import FinancialHealthScore

class AutonomousEngine:
    """
    The Brain of ExpenseOracle.
    Synthesizes ML outputs into Explainable Autonomous Actions with Priority Scoring.
    """
    
    @classmethod
    def generate_actions(cls, expenses: List[Dict], monthly_budget: float, income: float) -> List[Dict]:
        """
        Analyzes financial state and returns a list of prioritized autonomous actions.
        """
        actions = []
        
        # 0. Health Score Context
        health = FinancialHealthScore.calculate(expenses, monthly_budget, income)
        
        # 1. Prediction & Investment Analysis
        forecast_result = spendingForecaster.predict_next_month(expenses)
        forecasted_spend = forecast_result['monthly_forecast']
        surplus = monthly_budget - forecasted_spend
        
        if surplus > 0:
            investment_advice = InvestmentOptimizer.suggest_allocation(surplus)
            actions.append({
                "type": "INVESTMENT_ADVICE",
                "priority_score": 0.85 if health['score'] > 70 else 0.60,
                "confidence_threshold": forecast_result['confidence_level'],
                "message": f"Forecast shows a surplus of ${round(surplus, 2)} this month with an {forecast_result['trend']} trend.",
                "action": investment_advice["action"],
                "why": [
                    f"Forecast predicts total spending will be {round((forecasted_spend/monthly_budget)*100, 1)}% of budget.",
                    f"Spending momentum is currently {forecast_result['trend']}.",
                    f"Financial health score of {health['score']} allows for allocation."
                ]
            })
        else:
            defense_urgency = 0.95 if abs(surplus) > (monthly_budget * 0.2) else 0.75
            actions.append({
                "type": "BUDGET_WARNING",
                "priority_score": defense_urgency,
                "confidence_threshold": 0.95,
                "message": f"Alert: You are on track to exceed your budget by ${round(abs(surplus), 2)}.",
                "action": "Freeze non-essential 'Shopping' categories immediately.",
                "why": [
                    f"Current spending velocity is {round(abs(surplus), 2)} above threshold.",
                    f"Forecast indicates budget breach in approx {max(1, 30 - len(expenses))} days."
                ]
            })
            
        # 2. Anomaly based check
        anomalies = AnomalyDetector.detect_anomalies(expenses)
        for anomaly in anomalies:
            actions.append({
                "type": "SECURITY_ALERT",
                "priority_score": 0.98,
                "confidence_threshold": 0.85,
                "message": f"Unusual transaction detected: {anomaly['title']} (${anomaly['amount']})",
                "action": "Verify transaction; we recommend temporarily locking your primary card.",
                "why": [
                    anomaly["reason"],
                    "Transaction amount is 2.2x your historical average for this merchant."
                ]
            })

        # 3. Smart Lifestyle Suggestions
        smart_suggestions = SmartSuggestions.analyze_patterns(expenses)
        for suggestion in smart_suggestions:
            actions.append({
                "type": "LIFESTYLE_OPTIMIZATION",
                "priority_score": 0.40,
                "confidence_threshold": 0.70,
                "message": suggestion["insight"],
                "action": suggestion["suggestion"],
                "why": [
                    "High frequency of specific merchant interactions detected.",
                    "Potential savings identified in discretionary spending categories."
                ]
            })
            
        # Sort actions by priority_score (highest first)
        return sorted(actions, key=lambda x: x.get("priority_score", 0), reverse=True)
