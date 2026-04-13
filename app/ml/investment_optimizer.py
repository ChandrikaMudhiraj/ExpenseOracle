from typing import Dict
import numpy as np

class InvestmentOptimizer:

    PORTFOLIOS = {
        "Conservative": {"mu": 0.05, "sigma": 0.03, "composition": "80% Bonds, 20% Stocks", "risk_free": 0.03},
        "Moderate": {"mu": 0.08, "sigma": 0.12, "composition": "50% Bonds, 50% Stocks", "risk_free": 0.03},
        "Aggressive": {"mu": 0.12, "sigma": 0.20, "composition": "20% Bonds, 80% Stocks", "risk_free": 0.03},
    }

    @classmethod
    def suggest_allocation(cls, surplus: float) -> Dict:
        """
        Suggests a savings allocation strategy based on available surplus.
        Returns friendly advice for different risk profiles.
        """
        if surplus <= 0:
            return {
                "action": "Focus on reducing expenses first. You don't have extra money to invest right now.",
                "recommendation": "Start small by cutting back on non-essential spending."
            }
        
        if surplus < 100:
            return {
                "action": "Build an emergency fund with $" + str(int(surplus)) + " this month.",
                "recommendation": "Save this small amount in a high-yield savings account for emergencies."
            }
        
        if surplus < 500:
            return {
                "action": "Split your $" + str(int(surplus)) + ": 50% to emergency fund, 50% to a safe savings account.",
                "recommendation": "This balanced approach keeps you safe while growing your nest egg."
            }
        
        # For larger surpluses, recommend moderate allocation
        return {
            "action": "Great news! With $" + str(int(surplus)) + " extra, try: 40% emergency fund, 40% safe savings, 20% investments.",
            "recommendation": "Start with bonds or index funds for a steady, safe return."
        }

    @classmethod
    def simulate_future_growth(cls, principal: float, years: int = 1, iterations: int = 1000) -> Dict:
        import time
        results = {}

        for name, data in cls.PORTFOLIOS.items():
            mu = data["mu"]
            sigma = data["sigma"]
            rf = data["risk_free"]

            # Use current timestamp + principal + years for truly random seed
            seed = int(time.time() * 1000000 + principal) % (2**31)
            rng = np.random.default_rng(seed)

            # Generate yearly returns for each simulation
            yearly_returns = rng.normal(mu, sigma, (iterations, years))

            # Compound returns
            compounded_growth = np.prod(1 + yearly_returns, axis=1)
            final_values = principal * compounded_growth

            sharpe_ratio = (mu - rf) / sigma if sigma > 0 else 0
            # Expected return is simply mu (annual return rate as percentage)
            expected_return_pct = mu * 100

            results[name] = {
                "composition": data["composition"],
                "expected_return": f"{round(expected_return_pct, 2)}%",
                "risk_reward_score": round(float(sharpe_ratio), 2),
                "risk_band": "Low Risk" if sigma < 0.05 else "Moderate Risk" if sigma < 0.15 else "High Risk",
                "projection": {
                    "mean": round(float(np.mean(final_values)), 2),
                    "lowest_outcome": round(float(np.percentile(final_values, 5)), 2),
                    "best_outcome": round(float(np.percentile(final_values, 95)), 2),
                    "risk_level": f"{int(sigma*100)}%"
                }
            }

        return {"simulations": results}