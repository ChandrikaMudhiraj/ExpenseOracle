# 🔮 ExpenseOracle — Autonomous Financial Intelligence Platform

> **ExpenseOracle** is a full-stack, AI-driven personal finance platform that transforms passive expense tracking into an active, self-optimizing financial intelligence ecosystem. Built for the Innovation Marathon.

---

## 🌟 What It Does

ExpenseOracle shifts the user's role from **active manager** to **overseer**. Instead of manually reviewing spreadsheets, users interact with a live Oracle Intelligence Layer that forecasts spending, detects anomalies, plans goals, and autonomously recommends financial rebalancing actions — all explained in plain English.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                   React 18 SPA (Vite + Vanilla CSS)                │
│  Auth · Dashboard · Expenses · Budgets · Goals · AI Assistant      │
│        Investment Simulator · Autonomous Engine · Profile          │
└─────────────────────────┬──────────────────────────────────────────┘
                          │ HTTP REST
┌─────────────────────────▼──────────────────────────────────────────┐
│                  FastAPI Backend  :8000                             │
│  /auth  /expenses  /budgets  /goals  /ml/*  /assistant             │
│  ┌─────────────────┐   ┌──────────────────────────────────────┐   │
│  │  Service Layer  │   │       Oracle ML Intelligence Layer   │   │
│  │ auth_service    │   │  forecaster · anomaly_detector       │   │
│  │ expense_service │   │  health_score · advisor_chatbot      │   │
│  │ budget_service  │   │  investment_optimizer · auto_engine  │   │
│  │ assistant_svc   │   │  analytics · metrics_manager         │   │
│  └────────┬────────┘   └──────────────────┬───────────────────┘   │
│           │                               │                        │
│  ┌────────▼───────────────────────────────▼───────────────────┐   │
│  │              CacheManager (Redis TTL Wrapper)               │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────────────┬──────────────────────┘
           │                                  │
    ┌──────▼──────┐                   ┌───────▼──────┐
    │ PostgreSQL  │                   │    Redis      │
    │  :5433      │                   │   :6379       │
    │ users       │                   │forecast: 1h   │
    │ expenses    │                   │health: 30min  │
    │ budgets     │                   └───────────────┘
    │ goals       │
    └─────────────┘
         ↑
    Celery Worker + Beat (background scheduled jobs)
```

---

## 📱 Frontend Pages

| Page | Purpose |
|------|---------|
| **Auth** | Login & Registration with JWT token management |
| **Dashboard** | Mission control — Health Score, Forecast chart, Anomalies, Stress Prediction |
| **Expenses** | Transaction ledger — create, view, and categorize spending |
| **Budgets** | Category-based monthly limits with real-time progress bars |
| **Goal Planning** | AI feasibility scoring for financial targets (house, emergency fund, etc.) |
| **AI Assistant** | Natural language chat powered by the Oracle Intelligence engine |
| **Investment Simulator** | Monte Carlo simulation with risk bands and Sharpe Ratio |
| **Autonomous Engine** | AI-recommended actions with Explainable AI (XAI) and human approval |
| **Profile & Settings** | Set monthly income, savings target, and risk tolerance to activate AI |

---

## 🧠 Oracle Intelligence Layer (ML Modules)

| Module | Algorithm | Output |
|--------|-----------|--------|
| `forecaster.py` | Weighted Moving Average + Growth Rate Extrapolation | Next-month spend, trend, confidence % |
| `anomaly_detector.py` | Z-Score Statistical Detection | Flagged transactions with risk probability |
| `health_score.py` | Composite Weighted Score (Savings 40% + Adherence 40% + Volatility 20%) | Score 0-100 with status label |
| `advisor_chatbot.py` | NLP Intent Router + Context Injection | Personalized text advice in real-time |
| `investment_optimizer.py` | Monte Carlo Simulation (1000+ scenarios) | Sharpe Ratio, P10/P90 risk bands |
| `autonomous_engine.py` | Rule-Based Policy Engine + XAI | Prioritized action list with reasoning |
| `analytics.py` | Time-series aggregation | Forecast vs. Actual, wealth distributions |

---

## 🔌 Key API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/register` | Create a new account |
| `POST` | `/auth/login` | Authenticate and receive JWT token |
| `PUT` | `/auth/profile` | Set income, savings target, risk tolerance |
| `GET/POST` | `/expenses/` | List or add expense transactions |
| `GET/POST` | `/budgets/` | List or set category budget limits |
| `GET/POST` | `/goals/` | Manage financial goals |
| `GET` | `/ml/health-score` | Get the 0-100 Financial Health Score |
| `GET` | `/ml/forecast` | Get next-month spending forecast |
| `GET` | `/ml/anomalies` | Get flagged anomalous transactions |
| `POST` | `/ml/chat` | Chat with the AI financial advisor |
| `GET` | `/ml/investment-simulator` | Run Monte Carlo simulation |
| `GET` | `/ml/autonomous-actions` | Get AI-recommended rebalancing actions |
| `GET` | `/ml/analytics` | Get Forecast vs. Actual charting data |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Vanilla CSS, Lucide Icons, Recharts |
| **Backend** | FastAPI, Uvicorn (Python 3.11) |
| **Database** | PostgreSQL 15 + SQLAlchemy ORM + Alembic migrations |
| **Caching** | Redis 7 with TTL-based invalidation |
| **Task Queue** | Celery + Celery Beat (scheduled jobs) |
| **Security** | JWT (python-jose), Bcrypt (passlib) |
| **ML/AI** | NumPy, SciPy, scikit-learn, custom heuristic engines |
| **Infrastructure** | Docker + Docker Compose (5-service cluster) |

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- `.env` file (copy from `.env.example` and fill in DB credentials)

### Run the Platform
```bash
# Start all services (API, DB, Redis, Worker, Beat)
docker-compose up --build

# The platform is now available at http://localhost:8000
```

### First-Time Setup
1. Open `http://localhost:8000` and **Register** a new account
2. Go to **Profile & Settings** (sidebar bottom-left) and set your **monthly income**
3. Add some **Expenses** and set **Budget** limits
4. Visit the **Dashboard** to see your live Health Score and Forecast

> ⚠️ **Important:** The AI Health Score, Advisor, and all ML features require a monthly income to be set in your profile. Without it, the system defaults to 50/100 (Insufficient Data).

---

## 🐛 Known Fixes Applied

| Issue | Fix |
|-------|-----|
| AI Assistant returning "trouble connecting" error | Fixed `KeyError: 'recommendations'` in `health_score.py` when income is 0 |
| `ZeroDivisionError` in chatbot budget advice | Added safe division guard when no budget is set |
| Chatbot summing all-time expenses instead of last 30 days | Added proper 30-day date filter in `advisor_chatbot.py` |
| Goal Planning showing "calibrating" screen | Fixed tab routing in `App.jsx` to render `GoalPlanning` correctly |
| AI Assistant giving repetitive generic responses | Expanded intent keywords and randomized fallback responses |

---

## 📁 Project Structure

```
ExpenseOracle/
├── app/
│   ├── api/v1/          # FastAPI routers (auth, expenses, budgets, goals, ml, assistant)
│   ├── core/            # Config, Security, Database, Cache, Celery Worker
│   ├── ml/              # Oracle Intelligence Layer (7 modules)
│   ├── models/          # SQLAlchemy models (User, Expense, Budget, Goal)
│   ├── repository/      # DB query abstractions
│   ├── schemas/         # Pydantic request/response schemas
│   ├── services/        # Business logic layer
│   └── frontend/        # React 18 SPA
│       └── src/
│           ├── pages/   # 9 intelligence pages
│           ├── components/  # Layout, Sidebar, ErrorBoundary
│           └── services/    # api.js (all HTTP calls)
├── alembic/             # Database migration scripts
├── docker-compose.yml   # 5-service orchestration
├── Dockerfile           # Multi-stage build (Node + Python)
└── requirements.txt
```
