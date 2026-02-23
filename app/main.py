from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, JSONResponse
from contextlib import asynccontextmanager
from app.core.database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.user import Base, User
from app.models.goal import Goal
from app.schemas.user import UserCreate
import bcrypt
import importlib

# Import API v1 modules explicitly so routers are reliably registered
auth = importlib.import_module("app.api.v1.auth")
expenses = importlib.import_module("app.api.v1.expenses")
budgets = importlib.import_module("app.api.v1.budgets")
ml = importlib.import_module("app.api.v1.ml")
goals = importlib.import_module("app.api.v1.goals")
try:
	health = importlib.import_module("app.api.v1.health")
except Exception:
	health = None

try:
	dashboard = importlib.import_module("app.api.v1.dashboard")
except Exception:
	dashboard = None

try:
	assistant = importlib.import_module("app.api.v1.assistant")
except Exception:
	assistant = None

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
app.include_router(goals.router)
if health is not None and hasattr(health, "router"):
	app.include_router(health.router)
if settings.ENABLE_DASHBOARD and dashboard is not None and hasattr(dashboard, "router"):
	app.include_router(dashboard.router)
if assistant is not None and hasattr(assistant, "router"):
	app.include_router(assistant.router)


# Inline health endpoint as a fallback to ensure a stable /health path
@app.get("/health")
def _health():
	try:
		with engine.connect() as conn:
			conn.execute(text("SELECT 1"))
		return {"status": "ok"}
	except Exception as e:
		return JSONResponse(status_code=503, content={"status": "fail", "detail": str(e)})



