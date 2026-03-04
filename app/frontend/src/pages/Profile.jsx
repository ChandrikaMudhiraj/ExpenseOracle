import React, { useState } from 'react';
import { User, DollarSign, ShieldCheck, TrendingUp, Check, Edit2, X } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Profile = ({ user, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [income, setIncome] = useState(user?.monthly_income || '');
    const [savings, setSavings] = useState(user?.monthly_savings || '');
    const [targetPct, setTargetPct] = useState(user?.savings_target_percent || 20);
    const [risk, setRisk] = useState(user?.risk_tolerance || 'Moderate');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        if (!income || parseFloat(income) <= 0) {
            setError('Please enter a valid monthly income.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const updateData = {
                income: parseFloat(income),
                savings: parseFloat(savings) || 0,
                risk: risk,
                target_pct: parseFloat(targetPct)
            };
            const updatedProfile = await api.updateProfile(updateData);

            // Sync with global state
            if (onUpdateUser) {
                onUpdateUser({
                    monthly_income: updateData.income,
                    monthly_savings: updateData.savings,
                    risk_tolerance: updateData.risk,
                    savings_target_percent: updateData.target_pct
                });
            }

            setSaved(true);
            setIsEditing(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError('Failed to save profile. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const InfoRow = ({ label, value, icon: Icon }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color="var(--muted)" />
                <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{label}</span>
            </div>
            <span style={{ fontWeight: 700, color: 'white' }}>{value}</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '750px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        marginBottom: '8px',
                        background: 'linear-gradient(to right, #ffffff, var(--muted))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Oracle Profile
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
                        Your financial intelligence layer powers all autonomous recommendations.
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                )}
            </header>

            {/* User identity card */}
            <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
                <div style={{
                    width: 70, height: 70,
                    background: 'var(--primary)',
                    borderRadius: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', fontWeight: 800,
                    boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
                    transform: 'rotate(-5deg)'
                }}>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '4px' }}>
                        {user?.email?.split('@')[0] || 'Member'}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>{user?.email}</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{
                        padding: '6px 14px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '20px',
                        color: '#10b981',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }}></span>
                        ACTIVE SESSION
                    </div>
                </div>
            </div>

            <Card
                title={isEditing ? "Edit Financial Intelligence" : "Financial Profile"}
                subtitle={isEditing ? "Update your metrics for recalibration" : "Current settings used by Oracle AI"}
                icon={isEditing ? Edit2 : DollarSign}
            >
                {isEditing ? (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                        {error && (
                            <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', color: '#f43f5e', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label className="input-label">Monthly Income ($)</label>
                                <div style={{ position: 'relative' }}>
                                    <DollarSign size={16} className="input-icon" style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="e.g. 5000"
                                        value={income}
                                        onChange={e => setIncome(e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Monthly Savings ($)</label>
                                <div style={{ position: 'relative' }}>
                                    <TrendingUp size={16} className="input-icon" style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="e.g. 1000"
                                        value={savings}
                                        onChange={e => setSavings(e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Risk Tolerance</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                {[
                                    { val: 'Conservative', color: '#10b981', desc: 'Low risk' },
                                    { val: 'Moderate', color: '#6366f1', desc: 'Balanced' },
                                    { val: 'Aggressive', color: '#f43f5e', desc: 'High risk' }
                                ].map(opt => (
                                    <button
                                        key={opt.val}
                                        type="button"
                                        onClick={() => setRisk(opt.val)}
                                        style={{
                                            padding: '16px', borderRadius: '12px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer',
                                            border: `2px solid ${risk === opt.val ? opt.color : 'rgba(255,255,255,0.05)'}`,
                                            background: risk === opt.val ? `${opt.color}15` : 'rgba(255,255,255,0.02)',
                                        }}
                                    >
                                        <p style={{ fontWeight: 700, color: risk === opt.val ? opt.color : 'white', marginBottom: 4 }}>{opt.val}</p>
                                        <p style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{ flex: 2, padding: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                {loading ? 'Saving to Oracle...' : <><Check size={18} /> Save Settings</>}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn-ghost"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ marginTop: '8px' }}>
                        <InfoRow label="Monthly Income" value={`$${(user?.monthly_income || 0).toLocaleString()}`} icon={DollarSign} />
                        <InfoRow label="Monthly Savings" value={`$${(user?.monthly_savings || 0).toLocaleString()}`} icon={TrendingUp} />
                        <InfoRow label="Savings Rate" value={`${user?.savings_target_percent || 20}%`} icon={Check} />
                        <InfoRow label="Risk Tolerance" value={user?.risk_tolerance || 'Moderate'} icon={ShieldCheck} />

                        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                                💡 <strong style={{ color: 'white' }}>Oracle Insight:</strong> Your current savings rate is
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}> {((user?.monthly_savings / user?.monthly_income) * 100).toFixed(1)}%</span>.
                                This powers your AI Health Score and Stress Prediction triggers.
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            {saved && (
                <div style={{
                    position: 'fixed', bottom: '40px', right: '40px',
                    padding: '16px 24px', background: '#10b981', color: 'white',
                    borderRadius: '12px', boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)',
                    display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700,
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <Check size={20} /> Profile Synchronized Successfully!
                </div>
            )}
        </div>
    );
};
