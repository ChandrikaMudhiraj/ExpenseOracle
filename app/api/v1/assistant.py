from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from typing import Dict, Any
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services.assistant_service import AssistantService
from app.core.config import get_settings

router = APIRouter(prefix="/assistant", tags=["assistant"])
service = AssistantService()
settings = get_settings()


@router.post("/salary_event")
def salary_event(payload: Dict[str, Any] = Body(...), current_user: User = Depends(get_current_user)):
    # payload expects: {"salary": float}
    if not settings.ENABLE_DASHBOARD:
        raise HTTPException(status_code=503, detail="Assistant features disabled")
    
    salary = float(payload.get("salary", 0))
    # Fill context from authenticated user
    profile = {
        "monthly_income": current_user.monthly_income,
        "monthly_savings": current_user.monthly_savings,
        "risk_tolerance": current_user.risk_tolerance
    }
    
    from app.services.expense_service import list_expenses
    from sqlalchemy.orm import Session
    db = next(get_db()) # Minimal sync usage for demo logic
    expenses = list_expenses(db, current_user.id)
    
    return service.salary_allocation(salary, profile, expenses)


@router.post("/goal")
def create_goal_assistant(payload: Dict[str, Any] = Body(...), current_user: User = Depends(get_current_user)):
    if not settings.ENABLE_DASHBOARD:
        raise HTTPException(status_code=503, detail="Assistant features disabled")
    
    profile = {
        "monthly_income": current_user.monthly_income,
        "monthly_savings": current_user.monthly_savings
    }
    goal = payload.get("goal") or payload
    return service.plan_goal(goal, profile)


@router.get("/summary")
def get_summary(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    if not settings.ENABLE_DASHBOARD:
        raise HTTPException(status_code=503, detail="Assistant features disabled")
    
    from app.services.expense_service import list_expenses
    
    profile = {
        "income": current_user.monthly_income,
        "monthly_savings": current_user.monthly_savings
    }
    expenses = list_expenses(db, current_user.id)

    return JSONResponse(content=service.summary(profile, expenses))
