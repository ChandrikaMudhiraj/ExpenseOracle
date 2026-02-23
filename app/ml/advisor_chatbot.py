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

        # Filter to last 30 days only for context
        from datetime import datetime, timedelta, timezone
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(days=30)
        recent_expenses = []
        for e in expenses:
            ts = e['created_at']
            if ts is not None:
                if hasattr(ts, 'tzinfo') and ts.tzinfo is None:
                    ts = ts.replace(tzinfo=timezone.utc)
                if ts >= cutoff:
                    recent_expenses.append(e)
        
        total_spent_30d = sum(e['amount'] for e in recent_expenses) if recent_expenses else sum(e['amount'] for e in expenses)
        
        context_prompt = (
            f"In the last 30 days you spent ${round(total_spent_30d, 2)}. "
            f"Forecast predicts ${round(forecast, 2)} spend next month ({forecast_result['trend']} trend, {forecast_result['confidence_level']*100:.0f}% confidence). "
            f"Financial Health Score: {health['score']}/100."
        )

        response = ""
        intent_detected = ""

        # 2. Logic-based response generation (Simulating LLM routing)
        if any(w in query_lower for w in ["how am i", "health", "score", "status"]):
            intent_detected = "HEALTH_CHECK"
            recs = health.get('recommendations', [])
            rec_text = recs[0] if recs else 'Keep it up — you are doing great!'
            response = f"Your Financial Health Score is {health.get('score', 'N/A')} ({health.get('status', 'Unknown')}). {rec_text}"

        elif any(w in query_lower for w in ["forecast", "predict", "next month", "future"]):
            intent_detected = "FORECAST"
            diff = forecast - monthly_budget
            if diff > 0:
                response = f"Forecast predicts you'll overspend by ${round(diff, 2)}. {context_prompt} I suggest locking non-essential categories."
            else:
                response = f"You are on track! Forecast predicts ${round(forecast, 2)} spend, leaving a surplus of ${round(abs(diff), 2)}."

        elif any(w in query_lower for w in ["invest", "save", "money", "portfolio"]):
            intent_detected = "INVESTMENT"
            surplus = monthly_budget - forecast
            advice = InvestmentOptimizer.suggest_allocation(max(0, surplus))
            response = f"With your health score of {health.get('score', 'N/A')}, I recommend: {advice.get('action', 'diversify your portfolio')}"

        elif any(w in query_lower for w in ["expense", "spent", "transaction"]):
            intent_detected = "EXPENSES"
            top_cat = "various"
            if expenses:
                cats = [e['category'] for e in expenses]
                top_cat = max(set(cats), key=cats.count)
            response = f"You've logged {len(expenses)} transactions recently. Your most frequent category is '{top_cat}'. {context_prompt}"

        elif any(w in query_lower for w in ["budget", "limit", "cap"]):
            intent_detected = "BUDGET"
            utilization = ((forecast / monthly_budget) * 100) if monthly_budget > 0 else 0
            response = f"Your total monthly budget is set at ${monthly_budget}. You're currently projected to utilize {utilization:.1f}% of it. {context_prompt}"

        elif any(w in query_lower for w in ["tip", "advice", "help", "guide"]):
            intent_detected = "ADVICE"
            response = f"Financial Tip: Consider the 50/30/20 rule. Allocate 50% to needs, 30% to wants, and 20% to savings. Your current health score is {health['score']}, meaning you have a {health['status']} foundation."

        else:
            intent_detected = "GENERAL"
            generic_responses = [
                f"I've analyzed your data. {context_prompt} How can I help you optimize your wealth today?",
                f"I'm standing by to help. Currently, your health score is {health['score']}. Ask me about your 'forecast' or 'investment' strategy.",
                f"Hello! Your data shows a {forecast_result['trend']} trend in spending. What specific area of your finances would you like to discuss?"
            ]
            import random
            response = random.choice(generic_responses)

        return {
            "query": query,
            "intent": intent_detected,
            "context_injected": context_prompt,
            "response": response,
            "recommendation_engine_output": {
                "health_score": health.get('score', 50),
                "forecast": round(forecast, 2),
                "anomalies_detected": len(AnomalyDetector.detect_anomalies(expenses))
            }
        }
