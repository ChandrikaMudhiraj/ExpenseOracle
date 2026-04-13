from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class FinancialAdvisorChatbot:
    """
    Friendly AI Financial Advisor - uses simple language for easy understanding.
    """

    @classmethod
    def process_query(cls, query: str, user_id: int, expenses: List[Dict], monthly_budget: float, income: float) -> Dict:
        """
        Chat with a friendly AI advisor who explains things simply.
        """
        try:
            query_lower = query.lower().strip()
            
            # 1. Gather context
            from app.ml.forecaster import spendingForecaster
            from app.ml.health_score import FinancialHealthScore
            from app.ml.anomaly_detector import AnomalyDetector
            from app.ml.investment_optimizer import InvestmentOptimizer
            
            health = FinancialHealthScore.calculate(expenses, monthly_budget, income)
            forecast_result = spendingForecaster.predict_next_month(expenses)
            forecast = forecast_result['monthly_forecast']
            health_score = health.get('score', 50)
            health_status = health.get('status', 'Unknown')
            
            response = "I'm here to help! "
            intent_detected = "GENERAL"

            # 2. Respond to different questions
            if any(w in query_lower for w in ["hello", "hi", "hey", "help"]):
                intent_detected = "GREETING"
                response = f"Hi there! 😊 Your financial health score is {health_score}/100 (Status: {health_status}). What would you like to know? Ask me about your spending, budget, or savings!"

            elif any(w in query_lower for w in ["how am i", "health", "score", "status"]):
                intent_detected = "HEALTH_CHECK"
                recs = health.get('recommendations', [])
                rec_text = recs[0] if recs else "You're doing great! Keep it up."
                response = f"Your health score is {health_score} out of 100 - that means your finances are in {health_status.lower()} condition. 💡 Here's a tip: {rec_text}"

            elif any(w in query_lower for w in ["spend", "expense", "cost", "spent"]):
                intent_detected = "SPENDING"
                total_spent = sum(e['amount'] for e in expenses)
                response = f"You've spent ${total_spent:.2f} total. That's about ${total_spent/len(expenses):.2f} per purchase on average. Would you like tips on reducing expenses?"

            elif any(w in query_lower for w in ["forecast", "next month", "predict", "future"]):
                intent_detected = "FORECAST"
                diff = forecast - monthly_budget
                if diff > 0:
                    response = f"Next month, you might spend ${forecast:.2f} - which is ${diff:.2f} MORE than your budget of ${monthly_budget:.2f}. 📈 You might want to cut back on non-essentials."
                else:
                    response = f"Good news! You might spend ${forecast:.2f} next month, which is ${abs(diff):.2f} LESS than your ${monthly_budget:.2f} budget. 🎉 You could save that extra money!"

            elif any(w in query_lower for w in ["save", "invest", "money", "surplus"]):
                intent_detected = "SAVINGS"
                surplus = max(0, monthly_budget - forecast)
                advice = InvestmentOptimizer.suggest_allocation(surplus)
                response = f"Great question! {advice.get('action', 'Start small!')} 💰 Why? {advice.get('recommendation', 'Building wealth takes time.')}"

            elif any(w in query_lower for w in ["budget", "limit", "spending"]):
                intent_detected = "BUDGET"
                if monthly_budget > 0:
                    utilization = (forecast / monthly_budget) * 100
                    response = f"Your budget is ${monthly_budget:.2f}. Based on your habits, you'll use {utilization:.0f}% of it next month. "
                    if utilization > 100:
                        response += "That's over budget - maybe cut back? 😟"
                    else:
                        response += "That's under budget - good control! 👍"
                else:
                    response = "You haven't set a budget yet. Creating one is the first step to controlling your money!"

            elif any(w in query_lower for w in ["reduce", "cut", "less", "save more"]):
                intent_detected = "TIPS"
                response = "Here are simple ways to spend less: 💡\n1. Track purchases before you buy\n2. Set spending limits per category\n3. Wait 24 hours before buying non-essentials\n4. Use cash instead of cards - it feels more real!"

            else:
                intent_detected = "GENERAL"
                response = f"I understand you're asking about your finances! 📊 Your current health score is {health_score}. You can ask me about: Your spending, Budget, Next month forecast, or Ways to save more!"

            return {
                "query": query,
                "intent": intent_detected,
                "response": response,
                "health_score": health_score,
                "forecast": round(forecast, 2),
                "success": True
            }
            
        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            return {
                "query": query,
                "intent": "ERROR",
                "response": "Sorry, I had a quick hiccup! 😅 Please try asking something simpler, like 'How am I doing?' or 'What's my forecast?'",
                "success": False,
                "error": str(e)
            }

