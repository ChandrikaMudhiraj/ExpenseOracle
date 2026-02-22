import logging
import logging.config
import os
from logging.handlers import RotatingFileHandler


def _default_config(log_file: str, level: str = "INFO"):
    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
                "level": level,
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "formatter": "default",
                "level": level,
                "filename": log_file,
                "maxBytes": 10 * 1024 * 1024,
                "backupCount": 5,
                "encoding": "utf-8",
            },
        },
        "root": {
            "level": level,
            "handlers": ["console", "file"],
        },
    }


def configure_logging():
    log_file = os.getenv("LOG_FILE", "logs/expense_oracle.log")
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    # ensure log dir exists
    try:
        log_dir = os.path.dirname(log_file) or "logs"
        os.makedirs(log_dir, exist_ok=True)
    except Exception:
        pass

    config = _default_config(log_file, level)
    logging.config.dictConfig(config)


def get_logger(name: str = None) -> logging.Logger:
    return logging.getLogger(name)
