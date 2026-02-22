from typing import Any, Dict, List
import logging

logger = logging.getLogger(__name__)


class PolicyManager:
    """Encapsulates business rules to convert signals into actions."""

    def __init__(self, thresholds: Dict[str, Any] = None):
        self.thresholds = thresholds or {
            "forecast_overrun_factor": 1.1,
            "anomaly_count_to_freeze": 1,
        }

    def apply_policies(self, decision: Dict[str, Any], profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        actions = []

        # Budget rebalancing
        forecast = decision.get("forecast") or {}
        monthly_forecast = float(forecast.get("monthly_forecast") or 0)
        current_budget = float(profile.get("monthly_budget", 0))
        if current_budget and monthly_forecast > (current_budget * self.thresholds["forecast_overrun_factor"]):
            actions.append({
                "type": "reallocate_budget",
                "reason": "forecast_overrun",
                "suggested_change": - (monthly_forecast - current_budget),
            })

        # Anomaly handling
        anomalies = decision.get("anomalies") or []
        if len(anomalies) >= self.thresholds["anomaly_count_to_freeze"]:
            # simulate freezing top anomaly
            actions.append({
                "type": "freeze_transaction",
                "reason": "suspicious_activity",
                "transaction": anomalies[0] if anomalies else {"simulated": True},
            })

        # Investment tweak
        inv = decision.get("investment")
        if inv:
            actions.append({
                "type": "adjust_investment",
                "reason": "optimize_portfolio",
                "suggested_allocation": inv,
            })

        logger.info("PolicyManager generated %d actions", len(actions))
        return actions
