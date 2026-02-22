from fastapi import FastAPI, Depends
from app.core.database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import Base, User
from app.schemas.user import UserCreate
import bcrypt
from app.api.v1 import auth, expenses, budgets, ml, health


from app.core.logging_config import configure_logging

# Configure logging as early as possible
configure_logging()

app = FastAPI()

app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(budgets.router)
app.include_router(ml.router)
app.include_router(health.router)


@app.on_event("startup")
def _startup():
	try:
		Base.metadata.create_all(bind=engine)
	except Exception:
		# In local/dev/test environments the DB may be unavailable; skip
		pass



