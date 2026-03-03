const BASE_URL = ''; // Proxied via Vite in dev, same origin in production

export const api = {
    // Auth
    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },
    register: async (email, password, monthlyIncome, riskTolerance = 'Moderate', savingsTarget = 20.0) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                monthly_income: parseFloat(monthlyIncome),
                risk_tolerance: riskTolerance,
                savings_target_percent: parseFloat(savingsTarget)
            })
        });
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
    },

    // Expenses
    getExpenses: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/expenses/?user_id=${userId}`);
        return res.json();
    },
    addExpense: async (userId, expenseData) => {
        const res = await fetch(`${BASE_URL}/expenses/?user_id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData)
        });
        return res.json();
    },
    updateExpense: async (userId, expenseId, expenseData) => {
        const res = await fetch(`${BASE_URL}/expenses/${expenseId}?user_id=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData)
        });
        return res.json();
    },
    deleteExpense: async (userId, expenseId) => {
        const res = await fetch(`${BASE_URL}/expenses/${expenseId}?user_id=${userId}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    // Budgets
    getBudgets: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/budgets/?user_id=${userId}`);
        return res.json();
    },
    addBudget: async (userId, budgetData) => {
        const res = await fetch(`${BASE_URL}/budgets/?user_id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetData)
        });
        return res.json();
    },
    updateBudget: async (userId, budgetId, budgetData) => {
        const res = await fetch(`${BASE_URL}/budgets/${budgetId}?user_id=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetData)
        });
        return res.json();
    },
    deleteBudget: async (userId, budgetId) => {
        const res = await fetch(`${BASE_URL}/budgets/${budgetId}?user_id=${userId}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    // ML & Intelligence
    getForecast: async () => {
        const res = await fetch(`${BASE_URL}/ml/forecast`);
        return res.json();
    },
    getAnomalies: async (threshold = 2.0) => {
        const res = await fetch(`${BASE_URL}/ml/anomalies?threshold=${threshold}`);
        return res.json();
    },
    getHealthScore: async () => {
        const res = await fetch(`${BASE_URL}/ml/health-score`);
        return res.json();
    },
    getAutonomousActions: async () => {
        const res = await fetch(`${BASE_URL}/ml/autonomous-actions`);
        return res.json();
    },
    simulateInvestments: async (principal, years = 1) => {
        const res = await fetch(`${BASE_URL}/ml/investment-simulator?principal=${principal}&years=${years}`);
        return res.json();
    },
    oracleChat: async (query) => {
        const res = await fetch(`${BASE_URL}/ml/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        return res.json();
    },
    getAnalytics: async () => {
        const res = await fetch(`${BASE_URL}/ml/analytics`);
        return res.json();
    },
    runAutonomousDemo: async () => {
        const res = await fetch(`${BASE_URL}/dashboard/autonomous_actions`);
        return res.json();
    },

    // Profile & Goals
    updateProfile: async (profileData) => {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                monthly_income: parseFloat(profileData.income),
                monthly_savings: parseFloat(profileData.savings),
                risk_tolerance: profileData.risk,
                savings_target_percent: parseFloat(profileData.target_pct || 20.0)
            })
        });
        return res.json();
    },
    getGoals: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/goals/?user_id=${userId}`);
        return res.json();
    },
    addGoal: async (userId, goalData) => {
        const res = await fetch(`${BASE_URL}/goals/?user_id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goalData)
        });
        return res.json();
    },
    updateGoal: async (goalId, goalData) => {
        const res = await fetch(`${BASE_URL}/goals/${goalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goalData)
        });
        return res.json();
    },
    deleteGoal: async (goalId) => {
        const res = await fetch(`${BASE_URL}/goals/${goalId}`, {
            method: 'DELETE'
        });
        return res.json();
    }
};
