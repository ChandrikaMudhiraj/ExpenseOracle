import json
import redis
from app.core.config import get_settings

class CacheManager:
    """
    Centralized caching utility using Redis for high-performance retrieval 
    of precomputed ML results like health scores and forecasts.
    """
    
    settings = get_settings()
    _redis = redis.from_url(settings.REDIS_URL, decode_responses=True)

    @classmethod
    def set(cls, key: str, value: dict, expire: int = 3600):
        """Store a dict in Redis with a TTL in seconds."""
        try:
            cls._redis.setex(key, expire, json.dumps(value))
        except redis.ConnectionError:
            pass # Fail gracefully if Redis is down

    @classmethod
    def get(cls, key: str) -> dict:
        """Retrieve a cached dict from Redis."""
        try:
            data = cls._redis.get(key)
            return json.loads(data) if data else None
        except (redis.ConnectionError, json.JSONDecodeError):
            return None

    @classmethod
    def delete(cls, key: str):
        """Remove a key from cache."""
        try:
            cls._redis.delete(key)
        except redis.ConnectionError:
            pass
