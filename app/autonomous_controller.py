from typing import Any, Dict, List
import logging
from .decision_engine import DecisionEngine
from .policy_manager import PolicyManager

logger = logging.getLogger(__name__)


class AutonomousController:
    """Orchestrates decision evaluation and policy execution (simulated)."""

    def __init__(self, thresholds: Dict[str, Any] = None):
        self.engine = DecisionEngine()
        self.policies = PolicyManager(thresholds)

    def run_autonomy(self, expenses: List[Dict[str, Any]], profile: Dict[str, Any]) -> Dict[str, Any]:
        decisions = self.engine.evaluate(expenses, profile)
        actions = self.policies.apply_policies(decisions, profile)

        # Simulate action execution and reasoning log
        executed = []
        for a in actions:
            # in a real system we'd enqueue tasks or call external services
            executed.append({"action": a, "status": "simulated_executed"})

        logger.info("AutonomousController executed %d actions", len(executed))
        return {
            "decisions": decisions,
            "actions": executed,
        }
