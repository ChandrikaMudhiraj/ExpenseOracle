const BASE_URL = ''; // Proxied via Vite in dev, same origin in production

const request = async (url, options = {}) => {
    const token = localStorage.getItem('oracle_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('oracle_auth_error'));
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        // If we get an HTML response from an API call, something is wrong with routing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            throw new Error('API routing error: Received HTML instead of JSON. The system might be misconfigured.');
        }
        try {
            const error = await response.json();
            throw new Error(error.detail || 'API request failed');
        } catch (e) {
            throw new Error('API request failed with status ' + response.status);
        }
    }
    return response.json();
};

export const api = {
    // Auth
    login: async (email, password) => {
        const data = await request(`${BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (data.access_token) {
            localStorage.setItem('oracle_token', data.access_token);
        }
        return data;
    },
    register: async (email, password, monthlyIncome, riskTolerance = 'Moderate', savingsTarget = 20.0) => {
        return await request(`${BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                monthly_income: parseFloat(monthlyIncome),
                risk_tolerance: riskTolerance,
                savings_target_percent: parseFloat(savingsTarget)
            })
        });
    },

    // Expenses
    getExpenses: async () => {
        return await request(`${BASE_URL}/expenses/`);
    },
    addExpense: async (expenseData) => {
        return await request(`${BASE_URL}/expenses/`, {
            method: 'POST',
            body: JSON.stringify(expenseData)
        });
    },
    updateExpense: async (expenseId, expenseData) => {
        return await request(`${BASE_URL}/expenses/${expenseId}`, {
            method: 'PUT',
            body: JSON.stringify(expenseData)
        });
    },
    deleteExpense: async (expenseId) => {
        return await request(`${BASE_URL}/expenses/${expenseId}`, {
            method: 'DELETE'
        });
    },

    // Budgets
    getBudgets: async () => {
        return await request(`${BASE_URL}/budgets/`);
    },
    addBudget: async (budgetData) => {
        return await request(`${BASE_URL}/budgets/`, {
            method: 'POST',
            body: JSON.stringify(budgetData)
        });
    },
    updateBudget: async (budgetId, budgetData) => {
        return await request(`${BASE_URL}/budgets/${budgetId}`, {
            method: 'PUT',
            body: JSON.stringify(budgetData)
        });
    },
    deleteBudget: async (budgetId) => {
        return await request(`${BASE_URL}/budgets/${budgetId}`, {
            method: 'DELETE'
        });
    },

    // ML & Intelligence
    getForecast: async () => {
        return await request(`${BASE_URL}/ml/forecast`);
    },
    getAnomalies: async (threshold = 2.0) => {
        return await request(`${BASE_URL}/ml/anomalies?threshold=${threshold}`);
    },
    getHealthScore: async () => {
        return await request(`${BASE_URL}/ml/health-score`);
    },
    getAutonomousActions: async () => {
        return await request(`${BASE_URL}/ml/autonomous-actions`);
    },
    simulateInvestments: async (principal, years = 1) => {
        return await request(`${BASE_URL}/ml/investment-simulator?principal=${principal}&years=${years}`);
    },
    oracleChat: async (query) => {
        return await request(`${BASE_URL}/ml/chat`, {
            method: 'POST',
            body: JSON.stringify({ query })
        });
    },
    getAnalytics: async () => {
        return await request(`${BASE_URL}/ml/analytics`);
    },

    // Profile & Goals
    updateProfile: async (profileData) => {
        return await request(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            body: JSON.stringify({
                monthly_income: parseFloat(profileData.income),
                monthly_savings: parseFloat(profileData.savings),
                risk_tolerance: profileData.risk,
                savings_target_percent: parseFloat(profileData.target_pct || 20.0)
            })
        });
    },
    getGoals: async () => {
        return await request(`${BASE_URL}/goals/`);
    },
    addGoal: async (goalData) => {
        return await request(`${BASE_URL}/goals/`, {
            method: 'POST',
            body: JSON.stringify(goalData)
        });
    },
    updateGoal: async (goalId, goalData) => {
        return await request(`${BASE_URL}/goals/${goalId}`, {
            method: 'PUT',
            body: JSON.stringify(goalData)
        });
    },
    deleteGoal: async (goalId) => {
        return await request(`${BASE_URL}/goals/${goalId}`, {
            method: 'DELETE'
        });
    }
};
