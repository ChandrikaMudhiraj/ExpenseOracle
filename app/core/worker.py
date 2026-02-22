from celery import Celery
from app.core.config import get_settings

settings = get_settings()

# Celery Configuration for Enterprise-Scale Background Processing
# Implements asynchronous scheduled financial intelligence pipeline 
# using distributed task queues.

celery_app = Celery(
    "expense_oracle_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.ml.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "daily-financial-update": {
            "task": "app.ml.tasks.run_daily_intelligence_pipeline",
            "schedule": 86400.0, # Every 24 hours
        },
    }
)
