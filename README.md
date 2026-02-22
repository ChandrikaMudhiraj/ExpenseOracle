# ExpenseOracle: A High-Performance Financial Intelligence Platform

**ExpenseOracle** is a scalable financial intelligence platform designed for production-level autonomous financial management. It leverages advanced Machine Learning and asynchronous processing to transform traditional expense tracking into a self-optimizing "Autonomous Finance" ecosystem.

---

## 🚀 The Vision: Professional Autonomous Finance
Autonomous Finance refers to the use of AI to fully automate financial decisions. ExpenseOracle shifts the user's role from an **active manager** to an **overseer**, providing enterprise-level efficiency and optimized returns through proactive algorithms and explainable AI insights.

---

## 🏗️ Core Architecture

The platform is built with a high-performance **FastAPI** backend, utilizing **Celery** for asynchronous task execution and a sophisticated **Oracle Intelligence Layer**.

### 1. Robust Enterprise Backend
- **Unified Auth**: Secure user registration and login using JWT tokens and Bcrypt hashing.
- **Relational Data & Migrations**: Structured PostgreSQL models with **Alembic** for professional, version-controlled schema migrations.
- **Asynchronous Pipeline**: Implements an asynchronous scheduled financial intelligence pipeline using **Celery** and distributed task queues.
- **Enterprise Scalability**: Integrated **Redis** caching layer for sub-millisecond retrieval of high-compute ML results (Health Scores, Forecasts).

### 2. High-Performance Intelligence Layer ("The Oracle")
The system features a suite of specialized ML modules with built-in **Explainability** and **Confidence Scoring**:
- **Merchant Categorizer**: Automated NLP classification (95%+ accuracy targets).
- **Predictive Forecaster**: Weighted moving average engine with **MAPE Tracking** and dynamic **Confidence Intervals**.
- **Anomaly Detection**: Statistical guardian identifying outliers with **Anomaly Probability** scores using robust Z-Scores.
- **Monte Carlo Investment Optimizer**: Professional wealth simulations providing **Risk Bands** (Low/Mod/High) and Sharpe Ratio analysis.
- **Financial Health Score**: Unified 0-100 metric aggregating saving velocity, volatility, and budget adherence.

### 3. Dashboard-Ready Visual Analytics
The platform serves high-fidelity data series via the `AnalyticsEngine` for instant visualization:
- **Forecast vs. Actuals**: Historical accuracy comparisons.
- **Monte Carlo Distributions**: Wealth probability bell curves for portfolio projections.

### 4. Explainable Autonomous Engine (The Brain)
Synchronizes all intelligence into **Explainable Autonomous Actions**. Each action includes a transparency layer ("Why") to build user trust:
- "Spending exceeded historical average by 22%."
- "Forecast indicates budget breach in 9 days."

### 5. Context-Aware AI Advisor
A sophisticated conversational interface (`POST /ml/chat`) that goes beyond generic LLMs. It retrieves real-time user context—last 30 days spend, live forecasts, and health scores—to provide hyper-personalized recommendations.

---

## 🛤️ API Endpoints Overview

| Category | Endpoint | Action |
| :--- | :--- | :--- |
| **Auth** | `POST /auth/register` | Secure Onboarding |
| **ML Core** | `GET /ml/autonomous-actions` | **Decision Engine w/ Explainability** |
| **Metrics** | `GET /ml/model-metrics` | ML Performance (MAPE, Precision) |
| **Analytics** | `GET /ml/health-score` | Financial Health Score (0-100) |
| **Wealth** | `GET /ml/investment-simulator` | Monte Carlo Risk Simulation |
| **AI** | `POST /ml/chat` | Context-Aware Advisor interaction |

---

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python)
- **Task Queue**: Celery (Distributed Processing)
- **Database**: SQLAlchemy & PostgreSQL
- **AI/ML**: Custom Heuristic & Statistical Engines (SciPy, NumPy)
- **Security**: JWT, Bcrypt

---

## 📈 Impact & Scalability
ExpenseOracle is engineered as a scalable foundation for global financial automation. By implementing asynchronous intelligence pipelines and explainable AI, it demonstrates the technical maturity required for production deployment in the FinTech space.
