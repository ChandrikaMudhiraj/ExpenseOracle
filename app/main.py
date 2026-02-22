from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
from app.core.database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import Base, User
from app.schemas.user import UserCreate
import bcrypt
from app.api.v1 import auth, expenses, budgets, ml, health, dashboard, assistant

from app.core.logging_config import configure_logging
from app.core.config import get_settings

# Configure logging as early as possible
configure_logging()


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
	# Startup: create tables if possible. allow failures in ephemeral/test envs.
	try:
		Base.metadata.create_all(bind=engine)
	except Exception:
		pass
	yield
	# Teardown: nothing for now


app = FastAPI(lifespan=lifespan)

if settings.ENABLE_DASHBOARD:
	# Serve a minimal static demo frontend
	try:
		app.mount("/static", StaticFiles(directory="app/static"), name="static")
	except Exception:
		pass


@app.get("/")
def _root():
	if settings.ENABLE_DASHBOARD:
		return RedirectResponse(url="/static/index.html")
	return {"status": "ok"}


app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(budgets.router)
app.include_router(ml.router)
app.include_router(health.router)
if settings.ENABLE_DASHBOARD:
	app.include_router(dashboard.router)
app.include_router(assistant.router)



