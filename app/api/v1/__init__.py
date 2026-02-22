"""Package initializer for API v1.

Import submodules so they are registered when `app.api.v1` is imported
by `app.main` during startup. This ensures routers (e.g. `/health`) are
loaded and included in the FastAPI application.
"""

from . import auth, expenses, budgets, ml, assistant, dashboard, health

__all__ = [
    "auth",
    "expenses",
    "budgets",
    "ml",
    "assistant",
    "dashboard",
    "health",
]
