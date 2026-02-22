from typing import Any, Dict, List
import logging

logger = logging.getLogger(__name__)


class DecisionEngine:
    """Consumes ML outputs and produces structured decision signals."""

    def __init__(self):
        # lazy imports to avoid hard failures in restricted environments
        try:
            from app.ml.forecaster import spendingForecaster
            from app.ml.anomaly_detector import AnomalyDetector
            from app.ml.investment_optimizer import InvestmentOptimizer
            from app.ml.health_score import FinancialHealthScore

            self._forecaster = spendingForecaster
            self._anomaly = AnomalyDetector
            self._invest = InvestmentOptimizer
            self._health = FinancialHealthScore
        except Exception:
            self._forecaster = None
            self._anomaly = None
            self._invest = None
            self._health = None

    def evaluate(self, expenses: List[Dict[str, Any]], profile: Dict[str, Any]) -> Dict[str, Any]:
        out = {
            "forecast": None,
            "anomalies": [],
            "investment": None,
            "health_score": None,
            "context": {},
        }

        try:
            if self._forecaster:
                f = self._forecaster.predict_next_month(expenses)
                out["forecast"] = f
            else:
                # fallback simple forecast
                total = sum(e.get("amount", 0) for e in expenses)
                out["forecast"] = {"monthly_forecast": total / max(1, len(expenses))}
        except Exception as e:
            logger.exception("Forecasting failed: %s", e)

        try:
            if self._anomaly:
                an = self._anomaly.detect_anomalies(expenses)
                out["anomalies"] = an
            else:
                out["anomalies"] = []
        except Exception as e:
            logger.exception("Anomaly detection failed: %s", e)

        try:
            if self._invest:
                inv = self._invest.optimize(profile)
                out["investment"] = inv
        except Exception as e:
            logger.exception("Investment optimizer failed: %s", e)

        try:
            if self._health:
                hs = self._health.calculate_financial_health(expenses, profile)
                out["health_score"] = hs
        except Exception:
            # some repos expose different methods for health — tolerate failures
            out["health_score"] = None

        return out
