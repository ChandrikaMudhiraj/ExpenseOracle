from fastapi import FastAPI, Depends
from app.core.database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import Base, User
from app.schemas.user import UserCreate
import bcrypt
app = FastAPI()



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(email=user.email, password=hashed_pw.decode('utf-8'))
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "ExpenseOracle Backend Running"}

@app.get("/db-test")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database_response": "Connected Successfully"}