from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/")
def health():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        return JSONResponse(status_code=503, content={"status": "fail", "detail": str(e)})
