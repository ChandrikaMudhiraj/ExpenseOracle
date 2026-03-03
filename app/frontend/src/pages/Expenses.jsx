import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, Calendar, Tag } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Expenses = ({ user }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'General', created_at: '' });

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
            const payload = {
                ...newExpense,
                amount: parseFloat(newExpense.amount)
            };
            if (!payload.created_at) delete payload.created_at;

            if (editingExpense) {
                await api.updateExpense(user?.id || 1, editingExpense.id, payload);
            } else {
                await api.addExpense(user?.id || 1, payload);
            }
            setShowAdd(false);
            setEditingExpense(null);
            setNewExpense({ title: '', amount: '', category: 'General', created_at: '' });
            fetchExpenses();
        } catch (e) {
            console.error("Failed to save expense", e);
        }
    };

    const handleEdit = (exp) => {
        setEditingExpense(exp);
        setNewExpense({
            title: exp.title,
            amount: exp.amount,
            category: exp.category,
            created_at: new Date(exp.created_at).toISOString().split('T')[0]
        });
        setShowAdd(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.deleteExpense(user?.id || 1, id);
            fetchExpenses();
        } catch (e) {
            console.error("Failed to delete expense", e);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Your Spending</h1>
                    <p style={{ color: 'var(--muted)' }}>Keep track of where your money goes</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { setEditingExpense(null); setNewExpense({ title: '', amount: '', category: 'General', created_at: '' }); setShowAdd(true); }}>
                    <Plus size={18} /> Add New Expense
                </button>
            </header>

            {showAdd && (
                <Card title={editingExpense ? "Edit Expense" : "Add New Expense"}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>Add your daily spending here so we can track your money better.</p>
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
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Expense Type</label>
                            <select
                                value={newExpense.category}
                                onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
                            >
                                {['General', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Date (Optional)</label>
                            <input
                                type="date"
                                value={newExpense.created_at}
                                onChange={e => setNewExpense({ ...newExpense, created_at: e.target.value })}
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }}
                            />
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
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500 }}>Expense Type</th>
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500 }}>Date</th>
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500, textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
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
                                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => handleEdit(exp)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }} title="Edit">Edit</button>
                                            <button onClick={() => handleDelete(exp.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">Delete</button>
                                        </div>
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
