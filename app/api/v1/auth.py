from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, ProfileUpdate
from app.services.auth_service import register_user, login_user
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return register_user(
            db, 
            user.email, 
            user.password, 
            user.monthly_income, 
            user.risk_tolerance,
            user.savings_target_percent
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    try:
        from app.repository.user_repository import get_user_by_email
        from app.core.security import verify_password, create_access_token
        
        user = get_user_by_email(db, user_login.email)
        if not user or not verify_password(user_login.password, user.hashed_password):
            raise ValueError("Invalid credentials")
        
        token = create_access_token({"sub": user.email})
        return {
            "access_token": token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "monthly_income": user.monthly_income,
                "monthly_savings": user.monthly_savings,
                "risk_tolerance": user.risk_tolerance,
                "savings_target_percent": user.savings_target_percent
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.repository.user_repository import update_user_profile
    user = update_user_profile(
        db, 
        current_user.id, 
        profile_data.monthly_income, 
        profile_data.monthly_savings, 
        profile_data.risk_tolerance,
        profile_data.savings_target_percent
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
