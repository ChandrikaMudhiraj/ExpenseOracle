from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    PROJECT_NAME: str = "ExpenseOracle"

    DATABASE_URL: str
    REDIS_URL: str = "redis://redis:6379/0"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"
    )


@lru_cache()
def get_settings():
    return Settings()