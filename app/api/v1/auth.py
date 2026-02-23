from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import register_user, login_user
from app.repository.user_repository import get_user_by_email
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return register_user(db, user.email, user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    try:
        user = get_user_by_email(db, user_login.email)
        if not user or not verify_password(user_login.password, user.hashed_password):
            raise ValueError("Invalid credentials")
        
        token = create_access_token({"sub": user.email})
        return {
            "access_token": token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
