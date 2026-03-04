import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [newBudget, setNewBudget] = useState({ category: 'Food', limit_amount: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [b, e] = await Promise.all([
                api.getBudgets(),
                api.getExpenses()
            ]);
            setBudgets(b);
            setExpenses(e);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newBudget,
                limit_amount: parseFloat(newBudget.limit_amount)
            };
            if (editingBudget) {
                await api.updateBudget(editingBudget.id, payload);
            } else {
                await api.addBudget(payload);
            }
            setShowAdd(false);
            setEditingBudget(null);
            setNewBudget({ category: 'Food', limit_amount: '' });
            fetchData();
        } catch (err) {
            console.error("Failed to save budget", err);
        }
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setNewBudget({ category: budget.category, limit_amount: budget.limit_amount });
        setShowAdd(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this budget limit?")) return;
        try {
            await api.deleteBudget(id);
            fetchData();
        } catch (err) {
            console.error("Failed to delete budget", err);
        }
    };

    const getSpent = (category) => {
        return expenses
            .filter(e => e.category.toLowerCase() === category.toLowerCase())
            .reduce((sum, e) => sum + e.amount, 0);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Monthly Spending Limits</h1>
                    <p style={{ color: 'var(--muted)' }}>Set how much you want to spend in each category</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { setEditingBudget(null); setNewBudget({ category: 'Food', limit_amount: '' }); setShowAdd(true); }}>
                    <TrendingUp size={18} /> Set New Limit
                </button>
            </header>

            {showAdd && (
                <Card title={editingBudget ? "Update Limit" : "Set New Spending Limit"}>
                    <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Category</label>
                            <select
                                value={newBudget.category}
                                onChange={e => setNewBudget({ ...newBudget, category: e.target.value })}
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
                            >
                                {['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Monthly Spending Limit ($)</label>
                            <input
                                type="number"
                                value={newBudget.limit_amount}
                                onChange={e => setNewBudget({ ...newBudget, limit_amount: e.target.value })}
                                required
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
                                placeholder="500"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Set Budget</button>
                            <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                        </div>
                    </form>
                </Card>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {loading ? (
                    <div style={{ color: 'var(--muted)', padding: '40px' }}>Analyzing constraints...</div>
                ) : budgets.length === 0 ? (
                    <div style={{ color: 'var(--muted)', padding: '40px' }}>No budgets set yet.</div>
                ) : budgets.map(budget => {
                    const spent = getSpent(budget.category);
                    const percent = Math.min((spent / budget.limit_amount) * 100, 100);
                    const isOver = spent > budget.limit_amount;

                    return (
                        <Card key={budget.id} title={budget.category} icon={Target}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>${spent.toFixed(0)}</span>
                                    <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}> of ${budget.limit_amount}</span>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                        <button onClick={() => handleEdit(budget)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}>Edit</button>
                                        <button onClick={() => handleDelete(budget.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}>Delete</button>
                                    </div>
                                </div>
                                {isOver && <AlertTriangle color="var(--danger)" size={20} />}
                            </div>

                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                                <div style={{
                                    width: `${percent}%`,
                                    height: '100%',
                                    background: isOver ? 'var(--danger)' : 'var(--primary)',
                                    transition: 'width 0.4s ease'
                                }}></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: isOver ? 'var(--danger)' : 'var(--muted)' }}>
                                    {isOver ? 'Limit Crossed' : `${(budget.limit_amount - spent).toFixed(0)} Money Left`}
                                </span>
                                <span style={{ fontWeight: 600 }}>{percent.toFixed(0)}%</span>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
