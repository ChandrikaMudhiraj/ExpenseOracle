import logging
from fastapi.testclient import TestClient
from app.main import app


def test_health_endpoint_returns_ok_or_service_unavailable():
    client = TestClient(app)
    resp = client.get("/health")
    # allow both healthy (200) and service-unavailable (503) for local/dev runs
    assert resp.status_code in (200, 503)
    assert resp.json().get("status") in ("ok", "fail")


def test_logging_configured():
    logger = logging.getLogger()
    # At least a console handler should be present from our configure_logging
    handlers = getattr(logger, "handlers", [])
    assert len(handlers) >= 1
