# 🔮 ExpenseOracle: AI-Powered Personal Finance Platform

> **ExpenseOracle** is a comprehensive, autonomous personal finance platform that transforms passive expense tracking into intelligent financial management. Powered by AI and machine learning, it forecasts spending, detects anomalies, scores financial health, optimizes investments, and recommends autonomous actions—all with explainable reasoning.

**Status**: ✅ Fully Implemented | Production-Ready | All Features Tested

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Installation & Setup](#installation--setup)
6. [API Documentation](#api-documentation)
7. [Machine Learning Features](#machine-learning-features)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Development Guide](#development-guide)
11. [License](#license)

---

## 🎯 Project Overview

### What is ExpenseOracle?

**ExpenseOracle** shifts users from being active spreadsheet managers to financial overseers. Instead of manually analyzing finances, the system:

- 📊 **Forecasts** next-month spending with trend analysis
- 🚨 **Detects Anomalies** in spending patterns (potential fraud/unusual behavior)
- 💯 **Scores Financial Health** on a 0-100 scale with improvement recommendations
- 📈 **Simulates Investments** with Monte Carlo analysis across risk profiles
- 🤖 **Provides AI Advice** via an intelligent chatbot that understands context
- ⚡ **Recommends Actions** autonomously with explainable reasoning
- 💾 **Persists Everything** for long-term financial tracking and history

### Purpose

Personal finance management is complex and time-consuming. Most users either:
1. Manually track expenses (tedious, error-prone)
2. Use basic budgeting tools (no intelligence, no predictions)
3. Work with financial advisors (expensive, inaccessible)

**ExpenseOracle** bridges this gap by providing enterprise-grade ML intelligence at the personal finance level, making sophisticated analysis accessible and automated.

---

## ✨ Key Features

### 1. **Expense Management** ✅
- Record transactions with amount, date, category, and description
- Automatic categorization (Food, Transport, Entertainment, Utilities, etc.)
- Mark expenses as recurring (monthly, weekly, daily)
- Full transaction history with filtering and search
- Real-time balance tracking

### 2. **Budget Management** ✅
- Set monthly spending limits per category
- Real-time utilization tracking (% of budget used)
- Visual progress indicators with alerts
- Multiple simultaneous budgets per category
- Automatic budget vs. actual comparison

### 3. **Financial Goals** ✅
- Create savings goals (emergency fund, vacation, house down payment, etc.)
- Track progress toward targets with percentage completion
- AI-powered feasibility scoring based on income and savings rate
- Timeline calculations (months needed to reach goal)
- Multiple concurrent goals management

### 4. **AI Oracle Intelligence** ✅
#### a) Spending Forecaster
- Predicts next-month spending with trend analysis
- Provides confidence scores for accuracy
- Category-level forecasts
- Weighted moving average algorithm with growth rate extrapolation
- 1-hour result caching for performance

#### b) Anomaly Detection
- Statistical Z-score based outlier detection
- Identifies suspicious/unusual transactions
- Risk probability scoring for each anomaly
- Configurable sensitivity threshold
- Fraud prevention capabilities

#### c) Financial Health Score
- Composite 0-100 score reflecting overall financial status
- Components:
  - 40% Savings Rate (monthly savings ÷ income)
  - 40% Budget Adherence (staying within limits)
  - 20% Spending Volatility (consistency)
- Status badges (Excellent, Good, Fair, Poor)
- Personalized improvement recommendations
- 30-minute caching for optimization

#### d) Investment Simulator
- Monte Carlo simulations with 1000+ iterations
- 3 portfolio archetypes:
  - **Conservative**: 80% Bonds, 20% Stocks (5% annual return)
  - **Moderate**: 50% Bonds, 50% Stocks (8% annual return)
  - **Aggressive**: 20% Bonds, 80% Stocks (12% annual return)
- Risk bands (5th, 50th, 95th percentiles)
- Sharpe Ratio for risk-adjusted returns
- Custom time horizons (1-50 years)
- Allocation recommendations based on available surplus

#### e) Financial Advisor Chatbot
- Intent-based natural language understanding
- Context-aware responses using user's actual financial data
- 8 intent types:
  - GREETING: Hello + current health score
  - HEALTH_CHECK: Explain financial status
  - SPENDING: Analyze spending patterns
  - FORECAST: Provide next-month prediction
  - SAVINGS: Suggest allocation strategy
  - BUDGET: Explain budget utilization
  - TIPS: Actionable cost-cutting advice
  - GENERAL: Clarifying questions
- Simple, layman-friendly language with emojis
- Error resilience with graceful fallbacks

#### f) Analytics & Reporting
- Forecast vs. Actual comparison charts
- Wealth accumulation probability distributions
- Performance metrics (MAPE - Mean Absolute % Error)
- Time-series data ready for visualization

### 5. **Autonomous Decision Engine** ✅
- Multi-signal orchestration (combines all ML outputs)
- Rule-based policy engine converting signals to actions
- Explainable AI with reasoning for each decision
- Decision types:
  - Budget rebalancing (when forecast exceeds limits)
  - Transaction freezing (suspicious activity detected)
  - Investment rebalancing (portfolio optimization)
  - Savings acceleration (low health score)
- Simulated execution (demonstrate without applying)

### 6. **User Authentication & Profile** ✅
- Secure registration and login with JWT tokens
- Password hashing with bcrypt
- User profile management:
  - Monthly income
  - Savings target percentage
  - Risk tolerance (conservative/moderate/aggressive)
- Token refresh mechanism
- Session management

### 7. **Dashboard & Frontend** ✅
- Real-time financial overview
- Visual charts (spending trends, forecasts, anomalies)
- Key metrics display (health score, budget status)
- Responsive design for desktop and mobile
- Interactive components with real-time updates
- React 18 with Vite for optimal performance

---

## 🛠️ Technology Stack

### Backend
| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | FastAPI | 0.129.0 |
| **Language** | Python | 3.11 |
| **API Server** | Uvicorn | 0.41.0 |
| **ORM** | SQLAlchemy | 2.0.46 |
| **Database** | PostgreSQL | 15 |
| **Cache/Queue** | Redis | 7 |
| **Task Queue** | Celery | 5.3.6 |
| **Schema Migration** | Alembic | 1.13.1 |
| **Auth** | Python-Jose + Bcrypt | Latest |

### Machine Learning & Data
| Component | Technology | Version |
|-----------|------------|---------|
| **Numerical Computing** | NumPy | 1.26.4 |
| **Data Analysis** | Pandas | 2.2.3 |
| **Statistics** | SciPy | 1.12.0 |
| **ML Algorithms** | Scikit-learn | 1.3.2 |
| **Visualization** | Matplotlib, Seaborn | 3.8.1, 0.13.2 |
| **Serialization** | Joblib | 1.3.2 |

### Frontend
| Component | Technology | Version |
|-----------|------------|---------|
| **Framework** | React | 18 |
| **Build Tool** | Vite | Latest |
| **Node** | Node.js | 18+ |
| **Charting** | Recharts | Latest |
| **Styling** | CSS Grid & Flexbox | Native |

### Infrastructure
| Component | Technology |
|-----------|------------|
| **Containerization** | Docker |
| **Orchestration** | Docker Compose |
| **Logging** | Python Logging |
| **Testing** | Pytest |
| **HTTP Client** | Requests, Httpx |

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    React 18 SPA (Vite)                         │
│  Dashboard • Expenses • Budgets • Goals • Assistant • Simulator │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
        ┌───────────────────▼────────────────────────┐
        │     FastAPI Backend (:8000)                │
        │  ┌──────────────────────────────────────┐  │
        │  │  API Routes & Service Layer          │  │
        │  │  /auth  /expenses  /budgets  /goals  │  │
        │  └──────────────────────────────────────┘  │
        │  ┌──────────────────────────────────────┐  │
        │  │  Oracle Intelligence (ML Layer)      │  │
        │  │  • forecaster                        │  │
        │  │  • anomaly_detector                  │  │
        │  │  • health_score                      │  │
        │  │  • advisor_chatbot                   │  │
        │  │  • investment_optimizer              │  │
        │  │  • autonomous_engine                 │  │
        │  │  • analytics                         │  │
        │  └──────────────────────────────────────┘  │
        │  ┌──────────────────────────────────────┐  │
        │  │  Cache & Session (Redis TTL)         │  │
        │  └──────────────────────────────────────┘  │
        └───────────┬────────────────┬────────────────┘
               ┌────▼────┐      ┌───▼──────┐
               │PostgreSQL│      │   Redis  │
               │   DB     │      │  Cache   │
               └──────────┘      └──────────┘
                    ↑
        ┌───────────┴─────────────────┐
        │  Celery Worker + Beat       │
        │  (Background Tasks & Jobs)  │
        └─────────────────────────────┘
```

### Component Overview

#### API Layer
- **Route Handlers**: HTTP endpoint implementations
- **Dependency Injection**: FastAPI Depends() for DB sessions, auth, etc.
- **Request/Response Models**: Pydantic schemas for validation
- **Error Handling**: Centralized exception handling with appropriate HTTP status codes

#### Service Layer
- **auth_service**: User registration, login, token management
- **expense_service**: CRUD operations on expenses
- **budget_service**: Budget management and tracking
- **goal_service**: Goal creation and progress tracking
- **assistant_service**: Integration with AI components

#### ML Intelligence Layer
- **forecaster**: Spending prediction using statistical methods
- **anomaly_detector**: Outlier detection for transaction anomalies
- **health_score**: Composite financial health measurement
- **advisor_chatbot**: NLP-based financial advice
- **investment_optimizer**: Monte Carlo simulations
- **autonomous_engine**: Decision orchestration and policy application
- **analytics**: Analytics and visualization data generation

#### Data Layer
- **SQLAlchemy ORM**: Object-relational mapping for database access
- **Repository Pattern**: Data access abstraction
- **Alembic Migrations**: Database schema versioning

#### Infrastructure
- **Redis Cache**: Session storage, ML result caching
- **Celery Workers**: Asynchronous task execution
- **Celery Beat**: Scheduled job execution
- **Logging**: Structured logging with rotation

---

## 🚀 Installation & Setup

### Prerequisites

- **Docker & Docker Compose** (recommended)
  - Or manually:
    - Python 3.11+
    - PostgreSQL 15+
    - Redis 7+
    - Node.js 18+

### Quick Start (Docker)

#### 1. Clone Repository
```bash
git clone https://github.com/ChandrikaMudhiraj/ExpenseOracle.git
cd ExpenseOracle
```

#### 2. Configure Environment
```bash
# Create .env file
cp .env.example .env

# Edit .env with your settings:
# POSTGRES_USER=oracle
# POSTGRES_PASSWORD=secure_password
# POSTGRES_DB=expenseoracle
# JWT_SECRET_KEY=your_secret_key
```

#### 3. Start Services
```bash
docker-compose up --build -d
```

This will start:
- **API**: http://localhost:8000
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6379
- **Frontend**: http://localhost:8000/static/

#### 4. Initialize Database
```bash
# Run migrations
docker-compose exec api alembic upgrade head

# Or via uvicorn (if running locally):
alembic upgrade head
```

### Manual Setup (Local Development)

#### 1. Create Virtual Environment
```bash
python -m venv myenv
# Windows:
myenv\Scripts\Activate.ps1
# Linux/Mac:
source myenv/bin/activate
```

#### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Start Database Services
```bash
# PostgreSQL (via Docker or local installation)
docker run -d --name postgres15 \
  -e POSTGRES_USER=oracle \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=expenseoracle \
  -p 5433:5432 \
  postgres:15-alpine

# Redis (via Docker or local installation)
docker run -d --name redis7 \
  -p 6379:6379 \
  redis:7-alpine
```

#### 4. Run Migrations
```bash
alembic upgrade head
```

#### 5. Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 6. Start Frontend (Development)
```bash
cd app/frontend
npm install
npm run dev
```

#### 7. Start Celery Workers
```bash
# In separate terminal
celery -A app.core.worker worker --loglevel=info

# Celery Beat (for scheduled tasks)
celery -A app.core.worker beat --loglevel=info
```

#### 8. Access Application
- **API**: http://localhost:8000
- **Frontend**: http://localhost:5173 (Vite dev server)
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "monthly_income": 5000,
  "risk_tolerance": "moderate",
  "savings_target_percent": 20
}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "monthly_income": 5000,
  "risk_tolerance": "moderate"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "monthly_income": 6000,
  "savings_target_percent": 25,
  "risk_tolerance": "aggressive"
}
```

### Expense Endpoints

#### List Expenses
```http
GET /expenses/
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "user_id": 1,
    "amount": 45.50,
    "category": "Food",
    "title": "Grocery shopping",
    "is_recurring": false,
    "created_at": "2026-03-05T10:30:00"
  }
]
```

#### Add Expense
```http
POST /expenses/
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 45.50,
  "category": "Food",
  "title": "Grocery shopping",
  "is_recurring": false
}
```

### Budget Endpoints

#### Set Budget
```http
POST /budgets/
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "Food",
  "limit_amount": 500
}
```

#### List Budgets
```http
GET /budgets/
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "category": "Food",
    "limit_amount": 500,
    "spent_this_month": 350
  }
]
```

### ML Endpoints

#### Get Spending Forecast
```http
GET /ml/forecast
Authorization: Bearer {token}

Response: 200 OK
{
  "user_id": 1,
  "forecast_analysis": {
    "monthly_forecast": 3500,
    "trend": "increasing",
    "confidence": 0.85
  },
  "strategic_insights": [
    "Food spending is increasing 10% month-over-month"
  ]
}
```

#### Get Financial Health Score
```http
GET /ml/health-score
Authorization: Bearer {token}

Response: 200 OK
{
  "score": 78,
  "status": "Good",
  "components": {
    "savings_rate": 0.40,
    "budget_adherence": 0.85,
    "volatility_score": 0.90
  },
  "recommendations": [
    "Increase monthly savings by 5%"
  ]
}
```

#### Detect Spending Anomalies
```http
GET /ml/anomalies?threshold=2.0
Authorization: Bearer {token}

Response: 200 OK
{
  "user_id": 1,
  "anomalies_found": 2,
  "anomalies": [
    {
      "id": 5,
      "amount": 1500,
      "category": "Entertainment",
      "risk_probability": 0.92,
      "reason": "5x usual spending in this category"
    }
  ]
}
```

#### Investment Simulator
```http
GET /ml/investment-simulator?principal=1000&years=5
Authorization: Bearer {token}

Response: 200 OK
{
  "principal": 1000,
  "years": 5,
  "simulations": {
    "Conservative": {
      "composition": "80% Bonds, 20% Stocks",
      "expected_return": "5.0%",
      "projection": {
        "mean": 1275.02,
        "best_outcome": 1414.96,
        "lowest_outcome": 1138.75,
        "risk_level": "3%"
      }
    },
    "Moderate": {
      "composition": "50% Bonds, 50% Stocks",
      "expected_return": "8.0%",
      "projection": {
        "mean": 1455.97,
        "best_outcome": 2091.83,
        "lowest_outcome": 940.60,
        "risk_level": "12%"
      }
    },
    "Aggressive": {
      "composition": "20% Bonds, 80% Stocks",
      "expected_return": "12.0%",
      "projection": {
        "mean": 1737.22,
        "best_outcome": 2870.19,
        "lowest_outcome": 774.30,
        "risk_level": "20%"
      }
    }
  }
}
```

#### Chat with Financial Advisor
```http
POST /ml/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "How am I doing financially?"
}

Response: 200 OK
{
  "query": "How am I doing financially?",
  "intent": "HEALTH_CHECK",
  "response": "Your health score is 78 out of 100 - that means your finances are in good condition. 💡 Here's a tip: Increase monthly savings by 5% to reach excellent status!",
  "health_score": 78,
  "success": true
}
```

#### Get Autonomous Actions
```http
GET /ml/autonomous-actions
Authorization: Bearer {token}

Response: 200 OK
{
  "user_id": 1,
  "autonomous_actions": [
    {
      "action_type": "budget_rebalancing",
      "details": "Food budget exceeded by 15%",
      "recommendation": "Reduce dining out or increase budget limit",
      "priority": "high"
    }
  ]
}
```

#### Analytics Data
```http
GET /ml/analytics
Authorization: Bearer {token}

Response: 200 OK
{
  "user_id": 1,
  "series": {
    "forecast_vs_actual": [
      {"month": "February", "forecast": 3400, "actual": 3250},
      {"month": "March", "forecast": 3500, "actual": 3450}
    ],
    "wealth_probability_distribution": [
      {"value": 1138, "probability": 0.05},
      {"value": 1275, "probability": 0.50},
      {"value": 1415, "probability": 0.95}
    ]
  }
}
```

### Additional Endpoints

#### Health Check
```http
GET /health

Response: 200 OK
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected"
}
```

---

## 🧠 Machine Learning Features

### 1. Spending Forecaster
**Algorithm**: Weighted Moving Average + Growth Rate Extrapolation

**Inputs**:
- Historical expense data (amount, date, category)
- Time period (last 3-6 months)

**Outputs**:
- Next-month predicted spending
- Trend direction (increasing/flat/decreasing)
- Confidence percentage
- Category-level forecasts

**Use Case**: Users plan budgets and savings targets based on realistic projections.

---

### 2. Anomaly Detection
**Algorithm**: Statistical Z-Score Detection

**Inputs**:
- Transaction amount
- Historical transactions in same category
- Configurable threshold (default 2.0σ)

**Outputs**:
- Flagged transactions with risk probability
- Anomaly reason explanation
- Risk classification (low/medium/high)

**Use Case**: Detect fraud, unusual spending, data entry errors.

**Example**:
- User typically spends $50/month on entertainment
- Transaction of $500 in entertainment flagged as 10σ outlier
- Confidence: 99.9% likely anomalous

---

### 3. Financial Health Score
**Algorithm**: Weighted Composite Score

**Components**:
1. **Savings Rate** (40% weight)
   - Formula: Monthly Savings / Monthly Income
   - Optimal: 20%+

2. **Budget Adherence** (40% weight)
   - Formula: Budget Utilization %
   - Optimal: 80-100%

3. **Spending Volatility** (20% weight)
   - Formula: Std Dev of Monthly Spending
   - Optimal: Low volatility (consistent)

**Score Range**: 0-100
- 90-100: Excellent
- 70-89: Good
- 50-69: Fair
- 0-49: Poor

**Output**: Score + Status + Recommendations

---

### 4. Investment Simulator
**Algorithm**: Monte Carlo Simulation

**Parameters**:
- Principal amount
- Investment period (years)
- Portfolio allocation (Conservative/Moderate/Aggressive)
- Number of iterations (default 1000)

**Portfolio Definitions**:
| Type | Composition | Annual Return | Volatility |
|------|-------------|----------------|------------|
| Conservative | 80% Bonds, 20% Stocks | 5% | 3% |
| Moderate | 50% Bonds, 50% Stocks | 8% | 12% |
| Aggressive | 20% Bonds, 80% Stocks | 12% | 20% |

**Outputs**:
- Expected value (mean)
- Best case scenario (95th percentile)
- Worst case scenario (5th percentile)
- Sharpe Ratio (risk-adjusted return)
- Risk band classification

**Example Output**:
```
Principal: $1,000, Years: 5

Conservative:  $1,275 mean | $1,139-$1,415 range
Moderate:      $1,456 mean | $941-$2,092 range
Aggressive:    $1,737 mean | $774-$2,870 range
```

---

### 5. Natural Language Financial Advisor
**Algorithm**: Intent-Based Routing + Context Injection

**Intent Types**:
1. GREETING - Friendly hello with status
2. HEALTH_CHECK - Explain health score
3. SPENDING - Analyze spending patterns
4. FORECAST - Next-month prediction
5. SAVINGS - Allocation recommendations
6. BUDGET - Utilization explanation
7. TIPS - Cost-cutting advice
8. GENERAL - Clarifying questions

**Response Generation**:
- Retrieve user's financial data
- Match query to intent
- Generate contextual response
- Apply simple language filters
- Add relevant emoji + formatting

**Example Conversation**:
```
User: "Should I save money or invest?"
Bot: "Great question! Based on your $500 surplus this month, try: 40% to emergency fund, 40% to savings account, 20% to investments. 💰 Start with bonds for steady returns!"
```

---

### 6. Autonomous Decision Engine
**Algorithm**: Rule-Based Policy Engine with Multi-Signal Orchestration

**Signal Inputs**:
1. Spending forecast (vs. budget)
2. Anomaly detection (risk score)
3. Financial health score
4. Investment optimizer output
5. User financial context

**Decision Rules**:

| Signal | Threshold | Recommended Action |
|--------|-----------|-------------------|
| Forecast > Budget | 10% above | Budget rebalancing |
| Anomalies | >3 per month | Transaction freeze advisory |
| Health Score | <50 | Savings acceleration plan |
| Investment Opportunity | High Sharpe | Portfolio rebalancing |

**Output**:
- Prioritized action list
- Reasoning for each action
- Confidence level
- Simulated impact

---

## 🗄️ Database Schema

### Core Entities

#### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  monthly_income DECIMAL(10, 2),
  monthly_savings DECIMAL(10, 2),
  savings_target_percent INTEGER DEFAULT 20,
  risk_tolerance VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### expenses
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  title VARCHAR(255),
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### budgets
```sql
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  category VARCHAR(100) NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### goals
```sql
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  deadline DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### autonomous_actions
```sql
CREATE TABLE autonomous_actions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  action_type VARCHAR(100),
  details TEXT,
  status VARCHAR(50) DEFAULT 'recommended',
  priority VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_autonomous_actions_user_id ON autonomous_actions(user_id);
```

---

## 🐳 Deployment

### Docker Compose Setup

The project includes a production-ready `docker-compose.yml` with 5 services:

```yaml
services:
  db:        # PostgreSQL 15
  redis:     # Redis 7
  api:       # FastAPI application
  worker:    # Celery worker for async tasks
  beat:      # Celery Beat for scheduled jobs
```

### Environment Variables

Create `.env` file:
```bash
# Database
POSTGRES_USER=oracle
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=expenseoracle
DATABASE_URL=postgresql://oracle:password@db:5432/expenseoracle

# Redis
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Feature Flags
AUTONOMOUS_ENABLED=true
ENABLE_HEAVY_ML=true

# Logging
LOG_LEVEL=INFO
```

### Production Deployment

#### Using Docker Compose
```bash
# Build and start in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

#### Health Checks
```bash
# API health
curl http://localhost:8000/health

# Database health
docker-compose exec db pg_isready -U oracle -d expenseoracle

# Redis health
docker-compose exec redis redis-cli ping
```

#### Database Migrations
```bash
# Run migrations
docker-compose exec api alembic upgrade head

# Rollback to previous version
docker-compose exec api alembic downgrade -1
```

### Scaling

For production deployment:

1. **Use Kubernetes** instead of Docker Compose
2. **Separate database server** (managed PostgreSQL)
3. **Redis cluster** for high availability
4. **Multiple API replicas** behind load balancer
5. **Celery worker pool** with auto-scaling
6. **CDN** for static frontend assets
7. **Monitoring**: Prometheus + Grafana
8. **Logging**: ELK Stack or CloudWatch

---

## 👨‍💻 Development Guide

### Project Structure
```
ExpenseOracle/
├── app/
│   ├── api/v1/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── expenses.py      # Expense CRUD
│   │   ├── budgets.py       # Budget management
│   │   ├── goals.py         # Goal tracking
│   │   ├── ml.py            # ML endpoints
│   │   └── ...
│   ├── ml/
│   │   ├── forecaster.py    # Spending forecasting
│   │   ├── anomaly_detector.py
│   │   ├── health_score.py
│   │   ├── advisor_chatbot.py
│   │   ├── investment_optimizer.py
│   │   ├── autonomous_engine.py
│   │   └── ...
│   ├── models/              # SQLAlchemy models
│   ├── services/            # Business logic
│   ├── repository/          # Data access layer
│   ├── schemas/             # Pydantic request/response models
│   ├── core/                # Configuration, database, security
│   ├── static/              # Frontend build output
│   ├── frontend/            # React source code
│   └── main.py              # Application entry point
├── alembic/                 # Database migrations
├── tests/                   # Test suite
├── docker-compose.yml       # Docker setup
├── Dockerfile               # Container definition
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

### Running Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

### Adding a New Feature

#### 1. Create Database Model
```python
# app/models/new_entity.py
from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class NewEntity(Base):
    __tablename__ = "new_entities"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    # ... additional fields
```

#### 2. Create Pydantic Schema
```python
# app/schemas/new_entity.py
from pydantic import BaseModel

class NewEntityCreate(BaseModel):
    field1: str
    field2: int

class NewEntityResponse(NewEntityCreate):
    id: int
```

#### 3. Create Repository
```python
# app/repository/new_entity_repository.py
from app.models.new_entity import NewEntity

def create_new_entity(db, user_id, **kwargs):
    entity = NewEntity(user_id=user_id, **kwargs)
    db.add(entity)
    db.commit()
    db.refresh(entity)
    return entity
```

#### 4. Create Service
```python
# app/services/new_entity_service.py
from app.repository import new_entity_repository as repo

def create_entity(db, user_id, data):
    return repo.create_new_entity(db, user_id, **data.dict())
```

#### 5. Create API Router
```python
# app/api/v1/new_entity.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.schemas.new_entity import NewEntityCreate
from app.services import new_entity_service

router = APIRouter(prefix="/new-entities", tags=["New Entity"])

@router.post("/", response_model=NewEntityResponse)
def create_new_entity(
    data: NewEntityCreate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    return new_entity_service.create_entity(db, current_user.id, data)
```

#### 6. Register Router
```python
# app/main.py
from app.api.v1 import new_entity

app.include_router(new_entity.router)
```

#### 7. Create Database Migration
```bash
alembic revision --autogenerate -m "Add new_entities table"
alembic upgrade head
```

### Code Style & Standards

- **Python**: Follow PEP 8
- **Type Hints**: Use for all functions
- **Docstrings**: Document public functions
- **Error Handling**: Use specific exceptions, not bare except
- **Logging**: Use configured logger, not print()

Example:
```python
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

def get_user_expenses(
    db: Session,
    user_id: int,
    limit: Optional[int] = None
) -> List[Expense]:
    """
    Retrieve user expenses with optional limit.
    
    Args:
        db: Database session
        user_id: User ID
        limit: Maximum number of results
        
    Returns:
        List of expense objects
    """
    try:
        query = db.query(Expense).filter(Expense.user_id == user_id)
        if limit:
            query = query.limit(limit)
        return query.all()
    except Exception as e:
        logger.error(f"Failed to get expenses: {str(e)}")
        raise
```

---

## 📊 Performance Metrics

### Current Performance
- API response time: <200ms (p95)
- Database queries: Optimized with indexes
- Cache hit rate: 85%+ for forecast/health score
- ML computation: <500ms for forecasting
- Monte Carlo simulation: <2s for 1000 iterations

### Optimization Strategies
- Query optimization with database indexes
- Redis caching with TTL
- Celery background tasks for heavy computations
- Async I/O where possible
- Database connection pooling

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt
- **Dependency Injection**: FastAPI Depends for session management
- **CORS**: Configured for frontend origin
- **Rate Limiting**: (Recommended for production)
- **Input Validation**: Pydantic schemas
- **SQL Injection Prevention**: SQLAlchemy ORM
- **HTTPS**: (Recommended for production)

---

## 📝 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 👥 Support & Contributing

### Issues & Bug Reports
Report issues via GitHub Issues with:
- Description of bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Review Requirements
- Tests pass
- Code style follows PEP 8
- Docstrings added
- No breaking changes to API

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Celery Task Queue](https://docs.celeryproject.org/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🎯 Roadmap

### Completed ✅
- Core financial tracking (expenses, budgets, goals)
- ML intelligence layer (forecasting, anomalies, health score)
- Investment simulator with Monte Carlo
- Financial advisor chatbot
- Autonomous decision engine
- Full REST API
- React frontend with dashboard
- Docker deployment

### Planned 🔜
- Mobile app (React Native)
- Advanced portfolio optimization
- Tax planning features
- Multi-currency support
- Expense receipt scanning (OCR)
- Bank account integration
- Advanced analytics dashboard
- Push notifications
- Audit logs and compliance

---

**ExpenseOracle © 2026 — Making Personal Finance Intelligent**
