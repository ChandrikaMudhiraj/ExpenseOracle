from fastapi import APIRouter, Query, Depends, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
import io
import matplotlib.pyplot as plt
from typing import List, Dict
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.autonomous_controller import AutonomousController
from app.utils.financial_context import simulate_inflation
from app.core.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/forecast_chart")
def forecast_chart(current_user: User = Depends(get_current_user)):
    # use user's income as baseline for simulation
    base = current_user.monthly_income or 1000
    months = 6
    values = simulate_inflation(base, rate=0.02, months=months)

    plt.figure(figsize=(6, 3))
    plt.plot(range(1, months + 1), values, marker="o")
    plt.title(f"Projected Spend for {current_user.email.split('@')[0]}")
    plt.xlabel("Months")
    plt.ylabel("Amount")

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close()
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")


@router.get("/autonomous_actions")
def autonomous_actions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not settings.AUTONOMOUS_ENABLED:
        return JSONResponse(status_code=503, content={"detail": "Autonomous features disabled"})
    
    from app.services.expense_service import list_expenses
    expenses_data = list_expenses(db, current_user.id)
    expenses = [{"amount": e.amount} for e in expenses_data]
    
    profile = {
        "monthly_budget": current_user.monthly_income * 0.8, # Assuming 80% budget for demo
        "income": current_user.monthly_income
    }
    
    ctrl = AutonomousController()
    result = ctrl.run_autonomy(expenses, profile)
    return JSONResponse(content=result)
