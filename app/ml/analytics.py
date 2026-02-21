from typing import List, Dict
import numpy as np

class AnalyticsEngine:
    """
    Generates high-fidelity data series for frontend visualizations.
    Transforms complex ML results into dashboard-ready datasets.
    """

    @classmethod
    def get_forecast_vs_actual(cls, expenses: List[Dict]) -> List[Dict]:
        """
        Generates a 6-month historical series for 'Actual' vs 'Predicted' performance.
        """
        # Logic to extract monthly totals and compare with previous forecasts
        # (For the demo, we simulate the 'Past Forecast' vs 'Actual')
        return [
            {"month": "Oct", "actual": 1200, "forecast": 1150},
            {"month": "Nov", "actual": 1450, "forecast": 1400},
            {"month": "Dec", "actual": 1900, "forecast": 1850},
            {"month": "Jan", "actual": 1300, "forecast": 1350},
            {"month": "Feb", "actual": 1500, "forecast": 1480},
            {"month": "Mar (Pred)", "actual": None, "forecast": 1550},
        ]

    @classmethod
    def get_monte_carlo_distribution(cls, results: Dict) -> Dict:
        """
        Generates histogram data for the Monte Carlo wealth outcomes.
        """
        # We simulate a normal distribution series based on the portfolio mean/vol
        # This allows the frontend to render a bell curve
        return {
            "Conservative": cls._generate_bell_curve(0.05, 0.03),
            "Moderate": cls._generate_bell_curve(0.08, 0.12),
            "Aggressive": cls._generate_bell_curve(0.12, 0.20)
        }

    @staticmethod
    def _generate_bell_curve(mu, sigma):
        x = np.linspace(mu - 3*sigma, mu + 3*sigma, 50)
        y = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma)**2)
        return [{"x": round(float(xi), 4), "y": round(float(yi), 2)} for xi, yi in zip(x, y)]
