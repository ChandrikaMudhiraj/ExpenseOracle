from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse, JSONResponse
import io
import matplotlib.pyplot as plt
from typing import List, Dict

from app.autonomous_controller import AutonomousController
from app.utils.financial_context import simulate_inflation
from app.core.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/forecast_chart")
def forecast_chart(months: int = Query(6, ge=1, le=24)):
    # simple synthetic forecast demonstration using inflation simulation
    base = 1000
    values = simulate_inflation(base, rate=0.02, months=months)

    plt.figure(figsize=(6, 3))
    plt.plot(range(1, months + 1), values, marker="o")
    plt.title("Projected Monthly Spend (Inflation adjusted)")
    plt.xlabel("Months")
    plt.ylabel("Amount")

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")


@router.get("/autonomous_actions")
def autonomous_actions():
    # demo: run controller with synthetic data
    if not settings.AUTONOMOUS_ENABLED:
        return JSONResponse(status_code=503, content={"detail": "Autonomous features disabled"})
    expenses = [{"amount": 1200}, {"amount": 1500}, {"amount": 900}]
    profile = {"monthly_budget": 2000, "income": 5000}
    ctrl = AutonomousController()
    result = ctrl.run_autonomy(expenses, profile)
    return JSONResponse(content=result)
