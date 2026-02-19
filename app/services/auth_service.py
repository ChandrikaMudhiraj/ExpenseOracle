from sqlalchemy.orm import Session
from app.repository.user_repository import (
    get_user_by_email,
    create_user,
)
from app.core.security import hash_password, verify_password, create_access_token


def register_user(db: Session, email: str, password: str):
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise ValueError("User already exists")

    hashed = hash_password(password)
    print("PASSWORD TYPE:", type(password))
    print("PASSWORD VALUE:", password)
    return create_user(db, email, hashed)


def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        raise ValueError("Invalid credentials")

    token = create_access_token({"sub": user.email})
    return token
