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
    register: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
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

    // ML & Intelligence
    getForecast: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/ml/forecast?user_id=${userId}`);
        return res.json();
    },
    getAnomalies: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/ml/anomalies?user_id=${userId}`);
        return res.json();
    },
    getHealthScore: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/ml/health-score?user_id=${userId}`);
        return res.json();
    },
    getAutonomousActions: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/ml/autonomous-actions?user_id=${userId}`);
        return res.json();
    },
    simulateInvestments: async (principal, years = 1) => {
        const res = await fetch(`${BASE_URL}/ml/investment-simulator?principal=${principal}&years=${years}`);
        return res.json();
    },
    oracleChat: async (userId, query) => {
        const res = await fetch(`${BASE_URL}/ml/chat?user_id=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        return res.json();
    },
    getAnalytics: async (userId = 1) => {
        const res = await fetch(`${BASE_URL}/ml/analytics?user_id=${userId}`);
        return res.json();
    },
    runAutonomousDemo: async () => {
        const res = await fetch(`${BASE_URL}/dashboard/autonomous_actions`);
        return res.json();
    },

    // Profile & Goals
    updateProfile: async (userId, profileData) => {
        const { income, savings, risk } = profileData;
        const res = await fetch(`${BASE_URL}/auth/profile?user_id=${userId}&income=${income}&savings=${savings}&risk=${risk}`, {
            method: 'PUT'
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
