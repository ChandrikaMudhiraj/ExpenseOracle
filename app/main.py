from fastapi import FastAPI, Depends
from app.core.database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import Base, User
from app.schemas.user import UserCreate
import bcrypt
from app.api.v1 import auth, expenses


app = FastAPI()

app.include_router(auth.router)
app.include_router(expenses.router)

Base.metadata.create_all(bind=engine)




