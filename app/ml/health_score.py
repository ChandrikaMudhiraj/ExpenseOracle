from typing import List, Dict
import numpy as np

class FinancialHealthScore:
    """
    Engine to calculate a proprietary Financial Health Score (0-100).
    Aggregates metrics like savings rate, budget adherence, and volatility.
    """

    @classmethod
    def calculate(cls, expenses: List[Dict], monthly_budget: float, income: float) -> Dict:
        """
        Calculates the health score and identifies key contributors.
        """
        if not expenses or income <= 0:
            return {"score": 50, "status": "Insufficient Data", "factors": {}}

        total_spent = sum(e['amount'] for e in expenses)
        
        # 1. Savings Rate (Target: 20%+)
        savings = income - total_spent
        savings_rate = (savings / income) * 100
        savings_score = min(max(savings_rate * 2, 0), 100) # Simple linear scaling

        # 2. Budget Adherence (Target: < 100%)
        budget_utilization = (total_spent / monthly_budget) * 100 if monthly_budget > 0 else 100
        adherence_score = 100 - min(budget_utilization, 100)
        if budget_utilization > 100:
            adherence_score = max(50 - (budget_utilization - 100), 0)

        # 3. Spending Volatility (Target: Low Std Dev)
        amounts = [e['amount'] for e in expenses]
        if len(amounts) > 1:
            volatility = np.std(amounts) / np.mean(amounts) if np.mean(amounts) > 0 else 1.0
            volatility_score = max(100 - (volatility * 100), 0)
        else:
            volatility_score = 70 # Default for single transaction

        # Weighted Average
        # 40% Savings, 40% Adherence, 20% Volatility
        final_score = (savings_score * 0.4) + (adherence_score * 0.4) + (volatility_score * 0.2)
        
        status = "Robust" if final_score > 80 else "Stable" if final_score > 60 else "Vulnerable" if final_score > 40 else "Critical"

        return {
            "score": round(final_score, 1),
            "status": status,
            "metrics": {
                "savings_rate_pct": round(savings_rate, 1),
                "budget_utilization_pct": round(budget_utilization, 1),
                "volatility_index": round(float(np.std(amounts) if len(amounts) > 1 else 0), 2)
            },
            "recommendations": cls._get_recommendations(final_score, savings_rate, budget_utilization)
        }

    @classmethod
    def _get_recommendations(cls, score: float, savings_rate: float, utilization: float) -> List[str]:
        recs = []
        if savings_rate < 10:
            recs.append("Your savings rate is below 10%. Consider reducing discretionary spending.")
        if utilization > 90:
            recs.append("You have used over 90% of your budget. High risk of breach.")
        if score < 50:
            recs.append("Financial health is in the 'Vulnerable' zone. Review large transactions.")
        elif score > 85:
            recs.append("Excellent health! You are ready to increase your investment allocations.")
        return recs
