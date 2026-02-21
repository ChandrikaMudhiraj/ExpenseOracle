from typing import Dict, List
import numpy as np

class InvestmentOptimizer:
    """
    Advanced Investment Optimizer using Monte Carlo simulations.
    Calculates risk-adjusted returns and Sharpe ratios for professional-grade advice.
    """

    PORTFOLIOS = {
        "Conservative": {"mu": 0.05, "sigma": 0.03, "composition": "80% Bonds, 20% Stocks", "risk_free": 0.03},
        "Moderate": {"mu": 0.08, "sigma": 0.12, "composition": "50% Bonds, 50% Stocks", "risk_free": 0.03},
        "Aggressive": {"mu": 0.12, "sigma": 0.20, "composition": "20% Bonds, 80% Stocks", "risk_free": 0.03},
    }

    @classmethod
    def simulate_monte_carlo(cls, principal: float, years: int = 1, iterations: int = 1000) -> Dict:
        """
        Runs a Monte Carlo simulation for each portfolio to project potential outcomes.
        """
        results = {}
        for name, data in cls.PORTFOLIOS.items():
            mu = data["mu"]
            sigma = data["sigma"]
            rf = data["risk_free"]
            
            # Simulated annual returns: R = mu + sigma * Z
            # Over T years: (1 + R)^T
            # For Monte Carlo, we simulate 1000 paths
            simulated_annual_returns = np.random.normal(mu, sigma, iterations)
            final_values = principal * (1 + simulated_annual_returns) ** years
            
            sharpe_ratio = (mu - rf) / sigma if sigma > 0 else 0
            
            results[name] = {
                "composition": data["composition"],
                "expected_return": f"{int(mu*100)}%",
                "sharpe_ratio": round(float(sharpe_ratio), 2),
                "risk_band": "Low Risk" if sigma < 0.05 else "Moderate Risk" if sigma < 0.15 else "High Risk",
                "projection": {
                    "mean": round(float(np.mean(final_values)), 2),
                    "p10_worst_case": round(float(np.percentile(final_values, 10)), 2),
                    "p90_best_case": round(float(np.percentile(final_values, 90)), 2),
                    "volatility": f"{int(sigma*100)}%"
                }
            }
        return results

    @classmethod
    def suggest_allocation(cls, surplus: float, risk_tolerance: str = "Moderate") -> Dict:
        """
        Provides risk-adjusted investment advice.
        """
        if surplus <= 0:
            return {"message": "Focus on emergency savings first.", "action": "Save 100% of future surplus."}
        
        portfolio = cls.PORTFOLIOS.get(risk_tolerance, cls.PORTFOLIOS["Moderate"])
        sharpe = (portfolio["mu"] - portfolio["risk_free"]) / portfolio["sigma"]
        
        return {
            "surplus_available": round(surplus, 2),
            "suggested_portfolio": risk_tolerance,
            "sharpe_ratio": round(sharpe, 2),
            "action": f"Automatically allocate ${round(surplus, 2)} into your {risk_tolerance} portfolio for a target {int(portfolio['mu']*100)}% return."
        }
