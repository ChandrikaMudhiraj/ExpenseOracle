from celery import Celery
import os

# Celery Configuration for Enterprise-Scale Background Processing
# Implements asynchronous scheduled financial intelligence pipeline 
# using distributed task queues.

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "expense_oracle_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
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
