from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from typing import Dict, Any
from app.api.deps import get_db
from app.services.assistant_service import AssistantService
from app.core.config import get_settings

router = APIRouter(prefix="/assistant", tags=["assistant"])
service = AssistantService()
settings = get_settings()


@router.post("/salary_event")
def salary_event(payload: Dict[str, Any] = Body(...)):
    # payload expects: {"salary": float, "profile": {...}, "expenses": [...]}
    if not settings.ENABLE_DASHBOARD:
        raise HTTPException(status_code=503, detail="Assistant features disabled")
    salary = float(payload.get("salary", 0))
    profile = payload.get("profile", {})
    expenses = payload.get("expenses", [])
    return service.salary_allocation(salary, profile, expenses)


@router.post("/goal")
def create_goal(payload: Dict[str, Any] = Body(...), db=Depends(get_db)):
    # payload: {"name": str, "target_amount": float, "months": int (optional)}
    if not settings.ENABLE_DASHBOARD:
        raise HTTPException(status_code=503, detail="Assistant features disabled")
    profile = payload.get("profile", {})
    goal = payload.get("goal") or payload
    return service.plan_goal(goal, profile)


@router.get("/summary")
def get_summary(profile_id: int = 0, db=Depends(get_db)):
    # For demo, accept profile via query; in prod tie to user session
    if not settings.ENABLE_DASHBOARD:
        raise HTTPException(status_code=503, detail="Assistant features disabled")
    # For demo: fetch sample expenses from DB if available, else empty
    from app.services.expense_service import list_expenses

    # Try to load profile from DB; fall back to defaults
    profile = {"income": 5000, "monthly_savings": 1000}
    try:
        if profile_id:
            from app.models.user import User
            user = db.query(User).filter(User.id == profile_id).first()
            if user:
                profile = {"income": getattr(user, "monthly_income", 5000), "monthly_savings": getattr(user, "monthly_savings", 1000)}
    except Exception:
        pass

    try:
        expenses = list_expenses(db, profile_id) if profile_id else []
    except Exception:
        expenses = []

    return JSONResponse(content=service.summary(profile, expenses))
