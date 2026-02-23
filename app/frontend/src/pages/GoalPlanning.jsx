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
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const userId = user?.id || 1;
            const data = await api.getGoals(userId);
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

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.updateProfile(user?.id || 1, profile);
            alert("Financial profile updated successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            await api.addGoal(user?.id || 1, {
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
        const monthlySavings = profile.monthly_savings || 500;
        const target = goal.target_amount;
        const monthsNeeded = target / Math.max(1, monthlySavings);

        if (!goal.deadline) return { score: 90, message: `Estimated time: ${Math.ceil(monthsNeeded)} months` };

        const deadline = new Date(goal.deadline);
        const now = new Date();
        const monthsLeft = (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth());

        const score = Math.min(100, (monthsLeft / monthsNeeded) * 100);
        let message = score > 100 ? "On track" : score > 70 ? "High probability" : "Requires budget adjustment";

        return { score: Math.round(score), message };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '8px' }}>
                        <Target size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Goal Planning Engine</h1>
                        <p style={{ color: 'var(--muted)' }}>Autonomous trajectory mapping and savings discipline</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                {/* Profile Configuration */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Financial Context" icon={Wallet}>
                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Monthly Salary ($)</label>
                                <div style={{ position: 'relative' }}>
                                    <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                    <input
                                        type="number"
                                        value={profile.monthly_income}
                                        onChange={e => setProfile({ ...profile, monthly_income: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '10px 10px 10px 32px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Monthly Savings Target ($)</label>
                                <div style={{ position: 'relative' }}>
                                    <TrendingUp size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                                    <input
                                        type="number"
                                        value={profile.monthly_savings}
                                        onChange={e => setProfile({ ...profile, monthly_savings: parseFloat(e.target.value) })}
                                        style={{ width: '100%', padding: '10px 10px 10px 32px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Risk Tolerance</label>
                                <select
                                    value={profile.risk_tolerance}
                                    onChange={e => setProfile({ ...profile, risk_tolerance: e.target.value })}
                                    style={{ width: '100%', padding: '10px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                >
                                    <option value="Conservative">Conservative (Stability)</option>
                                    <option value="Moderate">Moderate (Growth + Risk)</option>
                                    <option value="Aggressive">Aggressive (High Growth)</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Syncing...' : 'Update Trajectory'}
                            </button>
                        </form>
                    </Card>

                    <Card title="AI Strategy Insight" icon={Sparkles}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                            Based on your salary of <span style={{ color: 'white', fontWeight: 600 }}>${profile.monthly_income}</span>,
                            maintaining a savings rate of <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{((profile.monthly_savings / profile.monthly_income) * 100).toFixed(1)}%</span>
                            is considered {profile.monthly_savings / profile.monthly_income > 0.2 ? 'Excellent' : 'Stable'}.
                        </p>
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
                                <div>
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
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Target Amount ($)</label>
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
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '6px' }}>Deadline (Optional)</label>
                                    <input
                                        type="date"
                                        value={newGoal.deadline}
                                        onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                        style={{ width: '100%', padding: '10px', background: 'var(--background)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Deploy Goal</button>
                                    <button type="button" className="btn-ghost" onClick={() => setShowAddGoal(false)}>Cancel</button>
                                </div>
                            </form>
                        </Card>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {loading ? (
                            <div style={{ color: 'var(--muted)', padding: '40px' }}>Synchronizing with Oracle...</div>
                        ) : goals.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                                <Target size={40} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--muted)' }}>No active goals. Start your 5-year wealth trajectory today.</p>
                            </div>
                        ) : goals.map(goal => {
                            const { score, message } = calculateFeasibility(goal);
                            const percent = Math.min(100, (goal.current_amount / goal.target_amount) * 100);

                            return (
                                <Card key={goal.id} title={goal.name} icon={Target}>
                                    <div style={{ marginTop: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>${goal.current_amount.toLocaleString()}</span>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>of ${goal.target_amount.toLocaleString()}</span>
                                        </div>

                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                                            <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                                        </div>

                                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)' }}>AI FEASIBILITY</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: score > 70 ? '#10b981' : '#f59e0b' }}>{score}%</span>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'white' }}>{message}</p>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--muted)' }}>
                                                <Calendar size={12} />
                                                <span>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                                            </div>
                                            <button
                                                style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', padding: '4px' }}
                                                onClick={() => handleDeleteGoal(goal.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
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
