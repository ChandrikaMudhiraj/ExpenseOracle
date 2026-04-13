"""Package initializer for API v1.

Explicitly import all routers for reliable registration during startup.
"""

from . import auth, expenses, budgets, ml, assistant, dashboard, health, goals

__all__ = ["auth", "expenses", "budgets", "ml", "assistant", "dashboard", "health", "goals"]
