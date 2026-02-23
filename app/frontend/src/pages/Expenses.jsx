import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, Calendar, Tag } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Expenses = ({ user }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'General' });

    const fetchExpenses = async () => {
        try {
            const data = await api.getExpenses(user?.id || 1);
            setExpenses(data);
        } catch (e) {
            console.error("Failed to fetch expenses", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.addExpense(user?.id || 1, {
                ...newExpense,
                amount: parseFloat(newExpense.amount)
            });
            setShowAdd(false);
            setNewExpense({ title: '', amount: '', category: 'General' });
            fetchExpenses();
        } catch (e) {
            console.error("Failed to add expense", e);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Expenses</h1>
                    <p style={{ color: 'var(--muted)' }}>Manage your daily transactions</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAdd(true)}>
                    <Plus size={18} /> Add Expense
                </button>
            </header>

            {showAdd && (
                <Card title="Add New Expense">
                    <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Description</label>
                            <input
                                value={newExpense.title}
                                onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
                                required
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={newExpense.amount}
                                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                required
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Category</label>
                            <select
                                value={newExpense.category}
                                onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
                            >
                                {['General', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
                            <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500 }}>Description</th>
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500 }}>Category</th>
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500 }}>Date</th>
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500, textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Loading records...</td></tr>
                            ) : expenses.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>No expenses found.</td></tr>
                            ) : expenses.map(exp => (
                                <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '16px 12px', fontWeight: 500 }}>{exp.title}</td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            color: 'var(--primary)',
                                            fontWeight: 600
                                        }}>
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 12px', color: 'var(--muted)', fontSize: '0.85rem' }}>
                                        {new Date(exp.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                                        ${exp.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
