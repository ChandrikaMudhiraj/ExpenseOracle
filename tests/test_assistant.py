from fastapi.testclient import TestClient
from app.main import app


def test_salary_allocation_endpoint():
    client = TestClient(app)
    payload = {"salary": 50000, "profile": {"monthly_savings": 5000}, "expenses": [{"amount": 1000}, {"amount": 2000}]}
    resp = client.post("/assistant/salary_event", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("action") == "salary_allocation_plan"


def test_goal_planning_endpoint():
    client = TestClient(app)
    payload = {"goal": {"name": "Buy bike", "target_amount": 6000, "months": 6}, "profile": {"income": 50000, "monthly_savings": 8000}}
    resp = client.post("/assistant/goal", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "needed_monthly" in data


def test_summary_endpoint():
    client = TestClient(app)
    resp = client.get("/assistant/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert "financial_health_score" in data
