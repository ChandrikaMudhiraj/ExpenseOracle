from typing import Dict, Any, List
from app.utils.financial_context import emergency_fund_status, financial_stress_score, estimate_credit_score
from app.decision_engine import DecisionEngine
import logging

logger = logging.getLogger(__name__)


class AssistantService:
    def __init__(self):
        self.engine = DecisionEngine()

    def salary_allocation(self, salary: float, profile: Dict[str, Any], expenses: List[Dict[str, Any]]) -> Dict[str, Any]:
        # baseline allocation
        essentials = salary * 0.5
        savings = salary * 0.2
        lifestyle = salary * 0.2
        investments = salary * 0.1

        # dynamic adjustments based on recent behavior
        recent_spend = sum(e.get("amount", 0) for e in expenses[-6:])
        avg_month_spend = recent_spend / max(1, len(expenses[-6:])) if expenses else 0

        recommendation = {
            "essentials": round(essentials, 2),
            "savings": round(savings, 2),
            "lifestyle": round(lifestyle, 2),
            "investments": round(investments, 2),
        }

        reason = []
        # if savings rate lower than 20% of salary relative to profile
        current_savings = profile.get("monthly_savings", savings)
        if current_savings < salary * 0.2:
            recommendation["savings"] = round(max(current_savings, salary * 0.2), 2)
            reason.append("Savings rate below recommended 20% threshold")

        # if avg spend > essentials, suggest cut to lifestyle
        if avg_month_spend > recommendation["essentials"]:
            recommendation["lifestyle"] = round(recommendation["lifestyle"] * 0.8, 2)
            reason.append("Recent spending suggests essentials exceed baseline; suggest trimming lifestyle")

        return {
            "action": "salary_allocation_plan",
            "recommendation": recommendation,
            "reason": "; ".join(reason) if reason else "Baseline allocation recommended",
        }

    def detect_lifestyle_inflation(self, old_income: float, new_income: float, old_spend: float, new_spend: float) -> Dict[str, Any]:
        income_growth = (new_income - old_income) / max(1.0, old_income)
        spend_growth = (new_spend - old_spend) / max(1.0, old_spend)
        severity = "low"
        message = "Spending matches income growth."
        if spend_growth > income_growth * 1.1:
            severity = "moderate"
            message = "Your spending increased faster than your income. Consider adjusting savings to maintain financial growth."
        return {"message": message, "severity": severity, "income_growth": income_growth, "spend_growth": spend_growth}

    def plan_goal(self, goal: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
        # goal: {"name": str, "target_amount": float, "months": int (optional)}
        income = profile.get("income", 5000)
        monthly_budget = profile.get("monthly_budget", 2000)
        savings_rate = profile.get("monthly_savings", income * 0.2)

        target = float(goal.get("target_amount", 0))
        months = goal.get("months")
        if months:
            needed_monthly = target / months
        else:
            needed_monthly = max(0.0, target / max(1, int((target / max(1.0, savings_rate)))))

        feasible = needed_monthly <= savings_rate
        probability = 0.9 if feasible else max(0.1, savings_rate / max(1.0, needed_monthly))

        adjustments = []
        if not feasible:
            adjustments.append({"type": "reduce_lifestyle", "suggested_cut": round((needed_monthly - savings_rate), 2)})

        return {
            "goal": goal,
            "needed_monthly": round(needed_monthly, 2),
            "feasible": feasible,
            "probability_score": round(probability * 100, 1),
            "adjustment_strategy": adjustments,
        }

    def emergency_fund_status(self, savings: float, monthly_expense: float) -> Dict[str, Any]:
        ef = emergency_fund_status(savings, monthly_expense)
        months = ef.get("months_covered")
        color = "green" if months >= 6 else "yellow" if months >= 3 else "red"
        return {"months_covered": months, "status_color": color, "details": ef}

    def summary(self, profile: Dict[str, Any], expenses: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Compose a short assistant summary using multiple helpers and DecisionEngine
        de = self.engine.evaluate(expenses, profile)
        income = profile.get("income", profile.get("monthly_income", 5000))
        savings = profile.get("savings", profile.get("monthly_savings", 0))
        monthly_expense = sum(e.get("amount", 0) for e in expenses[-6:]) / max(1, len(expenses[-6:])) if expenses else 0

        ef = emergency_fund_status(savings, monthly_expense)
        stress = financial_stress_score(expenses, profile)
        credit = estimate_credit_score(profile)

        recommended_actions = []
        if de.get("anomalies"):
            recommended_actions.append("Review recent anomalies")
        if ef.get("months_covered", 0) < 6:
            recommended_actions.append(f"Build emergency fund to 6 months (currently {round(ef.get('months_covered', 0), 1)})")
        if (savings / max(1.0, income)) < 0.2:
            recommended_actions.append("Target a 20% savings rate by reducing discretionary spend")

        return {
            "financial_health_score": de.get("health_score") or 50,
            "emergency_buffer_months": round(ef.get("months_covered", 0), 2),
            "savings_rate": f"{round((savings / max(1.0, income)) * 100, 1)}%",
            "risk_alerts": len(de.get("anomalies") or []),
            "recommended_actions": recommended_actions,
            "credit_estimate": credit,
            "stress_score": round(stress, 2),
            "user_context": {
                "income": income,
                "savings": savings,
                "risk": profile.get("risk_tolerance", "Moderate")
            }
        }
