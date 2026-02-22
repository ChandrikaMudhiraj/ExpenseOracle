from app.decision_engine import DecisionEngine
from app.policy_manager import PolicyManager
from app.autonomous_controller import AutonomousController


def test_decision_engine_basic_flow():
    de = DecisionEngine()
    expenses = [{"amount": 100}, {"amount": 200}, {"amount": 300}]
    profile = {"monthly_budget": 400, "income": 3000}
    out = de.evaluate(expenses, profile)
    assert "forecast" in out


def test_policy_manager_generates_actions():
    pm = PolicyManager()
    decision = {"forecast": {"monthly_forecast": 1000}, "anomalies": [{"id": 1}], "investment": None}
    profile = {"monthly_budget": 500}
    actions = pm.apply_policies(decision, profile)
    assert isinstance(actions, list)
    assert any(a.get("type") in ("reallocate_budget", "freeze_transaction") for a in actions)


def test_autonomous_controller_runs():
    ctrl = AutonomousController()
    expenses = [{"amount": 800}, {"amount": 900}]
    profile = {"monthly_budget": 1000, "income": 4000}
    res = ctrl.run_autonomy(expenses, profile)
    assert "decisions" in res and "actions" in res
