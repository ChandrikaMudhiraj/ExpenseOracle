"""Package initializer for API v1.

Import submodules so they are registered when `app.api.v1` is imported
by `app.main` during startup. This ensures routers (e.g. `/health`) are
loaded and included in the FastAPI application.
"""

import importlib
from types import ModuleType

_modules = ["auth", "expenses", "budgets", "ml", "assistant", "dashboard", "health"]

for _m in _modules:
    try:
        mod = importlib.import_module(f"{__package__}.{_m}")
        globals()[_m] = mod
    except Exception:
        # don't fail package import if an optional submodule is missing;
        # routers will be registered when available.
        globals()[_m] = None

__all__ = _modules
