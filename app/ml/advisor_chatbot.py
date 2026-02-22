from typing import List, Dict, Optional
from app.ml.forecaster import spendingForecaster
from app.ml.anomaly_detector import AnomalyDetector
from app.ml.investment_optimizer import InvestmentOptimizer
from app.ml.health_score import FinancialHealthScore

class FinancialAdvisorChatbot:
    """
    Context-Aware AI Financial Advisor Chatbot.
    Retrieves real-time spending, forecast, and health data to construct precise recommendations.
    """

    @classmethod
    def process_query(cls, query: str, user_id: int, expenses: List[Dict], monthly_budget: float, income: float) -> Dict:
        """
        Processes a user query by fetching full financial context.
        """
        query_lower = query.lower()
        
        # 1. Gather Full Financial Context
        health = FinancialHealthScore.calculate(expenses, monthly_budget, income)
        forecast_result = spendingForecaster.predict_next_month(expenses)
        forecast = forecast_result['monthly_forecast']
        total_spent_30d = sum(e['amount'] for e in expenses)
        
        context_prompt = (
            f"User spent ${round(total_spent_30d, 2)} in the last 30 days. "
            f"Forecast predicts ${round(forecast, 2)} spend next month ({forecast_result['trend']} trend, {forecast_result['confidence_level']*100:.0f}% confidence). "
            f"Financial Health Score: {health['score']}/100."
        )

        response = ""
        intent_detected = ""

        # 2. Logic-based response generation (Simulating LLM routing)
        if any(w in query_lower for w in ["how am i", "health", "score", "status"]):
            intent_detected = "HEALTH_CHECK"
            response = f"Your Financial Health Score is {health['score']} ({health['status']}). {health['recommendations'][0] if health['recommendations'] else 'You are doing great!'}"

        elif any(w in query_lower for w in ["forecast", "predict", "next month"]):
            intent_detected = "FORECAST"
            diff = forecast - monthly_budget
            if diff > 0:
                response = f"Forecast predicts you'll overspend by ${round(diff, 2)}. {context_prompt} I suggest locking non-essential categories."
            else:
                response = f"You are on track! Forecast predicts ${round(forecast, 2)} spend, leaving a surplus of ${round(abs(diff), 2)}."

        elif any(w in query_lower for w in ["invest", "save", "money"]):
            intent_detected = "INVESTMENT"
            surplus = monthly_budget - forecast
            advice = InvestmentOptimizer.suggest_allocation(max(0, surplus))
            response = f"With your health score of {health['score']}, I recommend: {advice['action']}"

        else:
            intent_detected = "GENERAL"
            response = f"I've analyzed your data. {context_prompt} How can I help you optimize your wealth today?"

        return {
            "query": query,
            "intent": intent_detected,
            "context_injected": context_prompt,
            "response": response,
            "recommendation_engine_output": {
                "health_score": health['score'],
                "forecast": round(forecast, 2),
                "anomalies_detected": len(AnomalyDetector.detect_anomalies(expenses))
            }
        }
