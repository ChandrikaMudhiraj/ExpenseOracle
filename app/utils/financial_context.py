from typing import List, Dict


def simulate_inflation(base_amount: float, rate: float, months: int) -> List[float]:
    values = []
    amount = base_amount
    for _ in range(months):
        amount *= (1 + rate / 12.0)
        values.append(amount)
    return values


def emergency_fund_status(savings: float, monthly_expense: float) -> Dict[str, float]:
    months_covered = savings / max(1.0, monthly_expense)
    return {"savings": savings, "monthly_expense": monthly_expense, "months_covered": months_covered}


def estimate_credit_score(profile: Dict) -> int:
    # lightweight estimator: base on income/debt and account age
    income = profile.get("income", 3000)
    debt = profile.get("debt", 0)
    score = 600 + int((income - debt) / 1000)
    return max(300, min(850, score))


def financial_stress_score(expenses: List[Dict], profile: Dict) -> float:
    monthly_budget = profile.get("monthly_budget", 1000)
    recent_spend = sum(e.get("amount", 0) for e in expenses[-6:])
    stress = recent_spend / max(1.0, monthly_budget)
    return stress
