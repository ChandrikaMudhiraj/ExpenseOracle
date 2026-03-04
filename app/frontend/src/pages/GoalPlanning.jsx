import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Sparkles, DollarSign, Wallet, Calendar, Plus, Trash2 } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const GoalPlanning = ({ user }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        monthly_income: user?.monthly_income || 5000,
        monthly_savings: user?.monthly_savings || 1000,
        risk_tolerance: user?.risk_tolerance || 'Moderate'
    });
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', target_amount: '', deadline: '' });
    const [showAddSavings, setShowAddSavings] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [savingsAmount, setSavingsAmount] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await api.getGoals();
            setGoals(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (user) {
            setProfile({
                monthly_income: user.monthly_income || 5000,
                monthly_savings: user.monthly_savings || 1000,
                risk_tolerance: user.risk_tolerance || 'Moderate'
            });
        }
    }, [user]);

    const handleAddSavings = async (e) => {
        e.preventDefault();
        try {
            await api.addGoalSavings(selectedGoal.id, parseFloat(savingsAmount));
            setShowAddSavings(false);
            setSavingsAmount('');
            setSelectedGoal(null);
            fetchData();
        } catch (err) {
            console.error("Failed to add savings", err);
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            await api.addGoal({
                ...newGoal,
                target_amount: parseFloat(newGoal.target_amount)
            });
            setShowAddGoal(false);
            setNewGoal({ name: '', target_amount: '', deadline: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteGoal = async (id) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            try {
                await api.deleteGoal(id);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const calculateFeasibility = (goal) => {
        const monthlySavings = user?.monthly_savings || 500;
        const remaining = goal.target_amount - goal.current_saved;
        const monthsNeeded = remaining / Math.max(1, monthlySavings);

        if (!goal.deadline) return { score: 90, message: `Estimated time: ${Math.ceil(monthsNeeded)} months`, monthsNeeded, monthsLeft: Infinity };

        const deadline = new Date(goal.deadline);
        const now = new Date();
        const monthsLeft = (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth());

        const score = Math.min(100, (monthsLeft / monthsNeeded) * 100);
        let message = score > 100 ? "On track" : score > 70 ? "High probability" : "Requires budget adjustment";

        // Smart Advice
        if (monthsNeeded > monthsLeft) {
            message = "At your current savings rate, this goal may be delayed. Consider increasing monthly savings.";
        }

        return { score: Math.round(score), message, monthsNeeded, monthsLeft };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '8px' }}>
                        <Target size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Saving for Your Goals</h1>
                        <p style={{ color: 'var(--muted)' }}>Plan your savings to reach your big dreams</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                {/* Strategy Insight */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="AI Strategy Insight" icon={Sparkles}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                <p style={{ fontSize: '0.9rem', color: 'white', lineHeight: '1.6' }}>
                                    Targeting <span style={{ color: 'var(--primary)', fontWeight: 800 }}>${(user?.monthly_savings || 1000).toLocaleString()}</span> monthly savings
                                    from <span style={{ color: 'var(--primary)', fontWeight: 800 }}>${(user?.monthly_income || 5000).toLocaleString()}</span> income.
                                </p>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.6' }}>
                                Based on your primary profile, your savings rate is
                                <span style={{ color: 'white', fontWeight: 600 }}> {(((user?.monthly_savings || 1000) / (user?.monthly_income || 5000)) * 100).toFixed(1)}%</span>.
                                Oracle uses this to calculate goal feasibility.
                            </p>
                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                                💡 Need to change your income?
                                <button onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'profile' }))} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0 4px', fontWeight: 700 }}>
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Goals Management */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Active Financial Targets</h2>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAddGoal(true)}>
                            <Plus size={16} /> New Goal
                        </button>
                    </div>

                    {showAddGoal && (
                        <Card title="Set New Financial Goal">
                            <form onSubmit={handleAddGoal} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Goal Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Master's Degree, Home Downpayment"
                                        value={newGoal.name}
                                        onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Total Amount Needed ($)</label>
                                    <input
                                        type="number"
                                        placeholder="10000"
                                        value={newGoal.target_amount}
                                        onChange={e => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '10px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Target Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={newGoal.deadline}
                                        onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                        style={{ width: '100%', padding: '10px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', gridColumn: '1 / -1' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Goal</button>
                                    <button type="button" className="btn-ghost" onClick={() => setShowAddGoal(false)}>Cancel</button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {showAddSavings && (
                        <Card title={`Add Savings to ${selectedGoal?.name}`}>
                            <form onSubmit={handleAddSavings} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Contribution Amount ($)</label>
                                    <input
                                        type="number"
                                        value={savingsAmount}
                                        onChange={e => setSavingsAmount(e.target.value)}
                                        placeholder="500"
                                        required
                                        autoFocus
                                        style={{ width: '100%', padding: '10px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <button type="submit" className="btn-primary">Confirm</button>
                                <button type="button" className="btn-ghost" onClick={() => setShowAddSavings(false)}>Cancel</button>
                            </form>
                        </Card>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {loading ? (
                            <div style={{ color: 'var(--muted)', padding: '40px' }}>Synchronizing with Oracle...</div>
                        ) : goals.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                                <Target size={40} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--muted)' }}>No active goals yet. What are you saving for today?</p>
                            </div>
                        ) : goals.map(goal => {
                            const { score, message, monthsNeeded, monthsLeft } = calculateFeasibility(goal);
                            const percent = Math.min(100, (goal.current_saved / goal.target_amount) * 100);
                            const progressColor = percent < 40 ? '#f59e0b' : percent < 80 ? '#6366f1' : '#10b981';

                            return (
                                <Card key={goal.id} title={goal.name} icon={Target}>
                                    <div style={{ marginTop: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>${goal.current_saved.toLocaleString()}</span>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>of ${goal.target_amount.toLocaleString()}</span>
                                        </div>

                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                                            <div style={{
                                                width: `${percent}%`,
                                                height: '100%',
                                                background: progressColor,
                                                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                boxShadow: `0 0 10px ${progressColor}44`
                                            }}></div>
                                        </div>

                                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '16px', border: monthsNeeded > monthsLeft ? '1px solid rgba(245, 158, 11, 0.2)' : 'none' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)' }}>FEASIBILITY STATUS</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: progressColor }}>{score}% Probability</span>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'white', lineHeight: '1.4' }}>{message}</p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button
                                                className="btn-primary"
                                                style={{ padding: '6px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                onClick={() => { setSelectedGoal(goal); setShowAddSavings(true); }}
                                            >
                                                <DollarSign size={14} /> Add Savings
                                            </button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--muted)' }}>
                                                    <Calendar size={12} />
                                                    <span>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                                                </div>
                                                <button
                                                    style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.4)', cursor: 'pointer', padding: '4px' }}
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
