# ExpenseOracle — Project Overview

Last updated: 2026-02-23

This document summarizes the current state of the ExpenseOracle codebase, what features are implemented (especially ML and autonomous features), how components are wired together, the dev/test infra added, and recommended next steps for cloud readiness and judging narratives.

---

## Quick Summary

- Purpose: personal finance assistant that provides forecasting, anomaly detection, financial health scoring, investment simulations, and autonomous decisions (budget rebalancing, fraud mitigation, portfolio tweaks).
- Stack: Python 3.11, FastAPI, SQLAlchemy, Celery (background worker), Postgres, Redis.
- Where to look:
  - App entry: [app/main.py](app/main.py)
  - API routers: [app/api/v1](app/api/v1)
  - ML layer: [app/ml](app/ml)
  - Autonomous decision layer: [app/decision_engine.py](app/decision_engine.py), [app/policy_manager.py](app/policy_manager.py), [app/autonomous_controller.py](app/autonomous_controller.py)
  - Utilities & context: [app/utils/financial_context.py](app/utils/financial_context.py)
  - Logging config: [app/core/logging_config.py](app/core/logging_config.py)
  - Docker config: [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml)

---

## Architecture & Components

- FastAPI application serves the HTTP API; main entry is [app/main.py](app/main.py).
- Database layer uses SQLAlchemy models in [app/models](app/models) and database helpers in [app/core/database.py].
- ML modules live under [app/ml] and expose functions consumed by API and the decision layer.
- Background tasks and distributed execution are supported via Celery and the worker in [app/core/worker.py].
- A centralized logging configuration was added at [app/core/logging_config.py], with console + rotating-file handlers.

Services (Docker Compose):

- `db` — Postgres (healthchecked via `pg_isready`). See [docker-compose.yml](docker-compose.yml).
- `redis` — Redis for Celery/cache.
- `api` — FastAPI app built from `Dockerfile` (exposes `/health` and API).
- `worker` + `beat` — Celery workers for scheduled or asynchronous ML jobs.

---

## ML Features (Implemented)

The repo includes a full ML layer designed for practical financial intelligence:

- Forecasting
  - Module: [app/ml/forecaster.py] — predicts next-month spend and provides trend/confidence.
  - Endpoint: `GET /ml/forecast` (see [app/api/v1/ml.py](app/api/v1/ml.py)).

- Anomaly Detection
  - Module: [app/ml/anomaly_detector.py] — robust MAD-based or similar outlier detection.
  - Endpoint: `GET /ml/anomalies`.

- Financial Health Scoring
  - Module: [app/ml/health_score.py] — computes a composite health score using budgets, income, and patterns.
  - Endpoint: `GET /ml/health-score`.

- Investment Simulation & Optimization
  - Module: [app/ml/investment_optimizer.py] — Monte Carlo simulations and portfolio optimizers.
  - Endpoint: `GET /ml/investment-simulator`.

- Advisor Chatbot
  - Module: [app/ml/advisor_chatbot.py] — lightweight contextual assistant to answer finance queries.
  - Endpoint: `POST /ml/chat`.

- Metrics & Analytics
  - Module: [app/ml/metrics_manager.py] and [app/ml/analytics.py] for model performance (MAPE) and visualization-ready series.
  - Endpoint: `GET /ml/model-metrics`, `GET /ml/analytics`.

Notes: ML modules include fallbacks so the system remains usable in environments where full dependencies or services are missing.

---

## Autonomous Decision Layer (New)

To make the system autonomous, a decision/automation layer was added. Files:

- `app/decision_engine.py` — Orchestrates ML outputs (forecast, anomalies, investment suggestions, health score) and presents a consolidated decision signal. Contains robust fallbacks if ML modules are unavailable.
- `app/policy_manager.py` — Converts decision signals into concrete policy actions using business rules (example rules: forecast overrun triggers budget reallocation; anomaly count triggers transaction freeze; investment suggestions lead to allocation adjustments).
- `app/autonomous_controller.py` — Orchestrates evaluation and simulates execution of actions. Provides a single entrypoint for automation runs and records simulated executions.
- `app/utils/financial_context.py` — Adds real-world contextual helpers: inflation simulation, emergency fund detection, credit score estimator, financial stress score.

These components let the system:

- Detect future overspending and propose or perform (simulated) budget rebalancing.
- Detect anomalies and simulate freezing suspicious transactions or issuing risk advisories.
- Suggest investment rebalances based on an optimizer and user's risk profile.

Endpoints demonstrating autonomy:

- `GET /ml/autonomous-actions` (existing ML API) — integrates prior AutonomousEngine.
- `GET /dashboard/autonomous_actions` — demo route that runs the controller with synthetic data; returns decisions + simulated executed actions.

---

## Dashboard & Visuals

- Lightweight visual endpoints were added to showcase intelligence:
  - `GET /dashboard/forecast_chart` — returns a PNG chart (matplotlib) illustrating projected spend/inflation.
  - `GET /dashboard/autonomous_actions` — returns JSON showing controller decisions and simulated actions.

These are intended for demo/judging purposes and can be replaced with a richer frontend later.

---

## API Surface (Important Endpoints)

- Health & infra
  - `GET /health` — basic DB connectivity health check. See [app/api/v1/health.py](app/api/v1/health.py).

- Auth & Users
  - `POST /auth/register`, `POST /auth/login` — JWT-based auth (see [app/api/v1/auth.py]).

- ML & Autonomous
  - `GET /ml/forecast`
  - `GET /ml/anomalies`
  - `GET /ml/health-score`
  - `GET /ml/autonomous-actions`
  - `GET /ml/investment-simulator`
  - `POST /ml/chat`

- Dashboard
  - `GET /dashboard/forecast_chart`
  - `GET /dashboard/autonomous_actions`

---

## Logging, Healthchecks & Tests

- Central logging: `app/core/logging_config.py` configures console + rotating file logging and is initialized early in [app/main.py](app/main.py).
- Docker-compose includes healthchecks for `db`, `redis`, and the `api` service. See [docker-compose.yml](docker-compose.yml).
- Automated tests:
  - ML verification tests: `tests/test_ml_layer.py` (production-grade verification harness for ML modules).
  - Health & logging tests: `tests/test_health_logging.py`.
  - Autonomous tests: `tests/test_autonomous.py` (DecisionEngine, PolicyManager, AutonomousController).

Run locally:

```bash
python -m pip install -r requirements.txt
python -m pytest -q
```

Note: Some tests may require DB/Redis for full integration; many unit tests are written to run without external services.

---

## CI / Deployment Notes

- The repo is container-ready: see `Dockerfile` and `docker-compose.yml`.
- For production/cloud readiness:
  - Add CI workflow to run tests and build images (GitHub Actions or equivalent).
  - Use ephemeral Postgres/Redis for integration tests inside CI.
  - Add environment-based feature flags for heavy ML jobs.
  - Consider Kubernetes (GKE/EKS) or ECS for scale; Celery workers can run as separate worker deployments.

Security & observability:

- Add metrics, traces, and structured logs (e.g., JSON + request-id). Integrate Sentry or equivalent for error reporting.
- Add role-based access or permission checks for any endpoint that triggers actions.

---

## Industry 4.0 & Judging Narrative (Suggested PR / Presentation Copy)

ExpenseOracle is an AI-driven, autonomous financial operations assistant combining Predictive Analytics, Anomaly Detection, and Autonomous Decision-Making. The system demonstrates:

- AI-Driven Decision Making: ML forecasts and risk detectors feed a policy-driven decision engine that can proactively rebalance budgets and recommend or simulate corrective actions.
- Predictive Analytics: Forecasting, Monte Carlo investment simulations, and model-performance metrics provide foresight and accountability.
- Autonomous Systems: A dedicated controller executes policy-generated actions, simulating transaction freezes and portfolio adjustments.
- Cloud-Native Microservice Architecture: Containerized API + worker processes, Redis for caching/queueing, and PostgreSQL for persistence.

This combination shows a practical, judge-friendly example of Industry 4.0 for consumer finance: a data-driven, self-optimizing guardian that recommends and can autonomously act to preserve financial health.

---

## Next Recommended Work

1. Replace `@app.on_event("startup")` with a FastAPI lifespan manager for clearer lifecycle handling.
2. Add feature flags to gate heavy ML endpoints and autonomous actions.
3. Add CI workflows for unit and integration tests (with ephemeral Postgres/Redis).
4. Add an audit trail and event store for autonomous actions (to satisfy compliance and reviewer concerns).
5. Add a simple web frontend demo or dashboard to showcase the `dashboard` routes and ML outputs.

---


