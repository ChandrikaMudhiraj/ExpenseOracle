from fastapi import FastAPI, Depends
from app.core.database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import Base, User
from app.schemas.user import UserCreate
import bcrypt
from app.api.v1 import auth


app = FastAPI()

app.include_router(auth.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "ExpenseOracle Backend Running"}

@app.get("/db-test")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database_response": "Connected Successfully"}



