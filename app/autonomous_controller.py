from typing import Any, Dict, List
import logging
from .decision_engine import DecisionEngine
from .policy_manager import PolicyManager
from app.core.database import SessionLocal
from app.repository.autonomous_repository import save_action
from app.core.config import get_settings

logger = logging.getLogger(__name__)


class AutonomousController:
    """Orchestrates decision evaluation and policy execution (simulated).

    When `AUTONOMOUS_ENABLED` is True and the DB is available, executed actions
    are persisted to the `autonomous_actions` audit table.
    """

    def __init__(self, thresholds: Dict[str, Any] = None):
        self.engine = DecisionEngine()
        self.policies = PolicyManager(thresholds)
        self.settings = get_settings()

    def run_autonomy(self, expenses: List[Dict[str, Any]], profile: Dict[str, Any]) -> Dict[str, Any]:
        decisions = self.engine.evaluate(expenses, profile)
        actions = self.policies.apply_policies(decisions, profile)

        # Simulate action execution and reasoning log
        executed = []
        for a in actions:
            status = "simulated_executed"
            executed.append({"action": a, "status": status})

            # Persist audit/event if autonomous mode enabled
            if self.settings.AUTONOMOUS_ENABLED:
                try:
                    db = SessionLocal()
                    save_action(db, action_type=a.get("type", "unknown"), payload=a, status=status)
                except Exception:
                    logger.exception("Failed to persist autonomous action")
                finally:
                    try:
                        db.close()
                    except Exception:
                        pass

        logger.info("AutonomousController executed %d actions", len(executed))
        return {
            "decisions": decisions,
            "actions": executed,
        }
