import React, { useState } from 'react';
import { User, DollarSign, ShieldCheck, TrendingUp, Check } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Profile = ({ user }) => {
    const [income, setIncome] = useState('');
    const [savings, setSavings] = useState('');
    const [risk, setRisk] = useState('Moderate');
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
            await api.updateProfile(user?.id || 1, {
                income: parseFloat(income),
                savings: parseFloat(savings) || 0,
                risk
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError('Failed to save profile. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '700px' }}>
            <header>
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
                    Your financial intelligence layer. These inputs power the AI Health Score, Forecast, and all autonomous recommendations.
                </p>
            </header>

            {/* User identity card */}
            <div style={{
                padding: '20px 24px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.03) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    width: 56, height: 56,
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', fontWeight: 800,
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                }}>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                        {user?.email?.split('@')[0] || 'Member'}
                    </p>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user?.email}</p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <span style={{
                        padding: '6px 14px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '20px',
                        color: '#10b981',
                        fontSize: '0.75rem',
                        fontWeight: 700
                    }}>
                        ● ACTIVE SESSION
                    </span>
                </div>
            </div>

            <Card title="Financial Profile" subtitle="Used by Oracle's AI to calculate your personalized health score" icon={DollarSign}>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            borderRadius: '10px',
                            color: '#f43f5e',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: 'var(--muted)',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Monthly Income ($) *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <DollarSign size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    placeholder="e.g. 5000"
                                    value={income}
                                    onChange={e => setIncome(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '12px 14px 12px 40px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '6px' }}>
                                This is the key metric for your health score
                            </p>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: 'var(--muted)',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Monthly Savings Target ($)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <TrendingUp size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
                                <input
                                    type="number"
                                    min="0"
                                    step="50"
                                    placeholder="e.g. 1000"
                                    value={savings}
                                    onChange={e => setSavings(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '12px 14px 12px 40px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'var(--muted)',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Risk Tolerance
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            {[
                                { val: 'Conservative', color: '#10b981', desc: 'Low risk, stable returns' },
                                { val: 'Moderate', color: '#6366f1', desc: 'Balanced approach' },
                                { val: 'Aggressive', color: '#f43f5e', desc: 'High risk, high reward' }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => setRisk(opt.val)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: `2px solid ${risk === opt.val ? opt.color : 'rgba(255,255,255,0.05)'}`,
                                        background: risk === opt.val ? `${opt.color}15` : 'rgba(255,255,255,0.02)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ShieldCheck size={20} color={risk === opt.val ? opt.color : 'var(--muted)'} style={{ margin: '0 auto 8px' }} />
                                    <p style={{ fontWeight: 700, color: risk === opt.val ? opt.color : 'white', fontSize: '0.9rem', marginBottom: 4 }}>{opt.val}</p>
                                    <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            padding: '14px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : undefined,
                            boxShadow: saved ? '0 0 20px rgba(16, 185, 129, 0.4)' : undefined
                        }}
                    >
                        {loading ? 'Saving to Oracle...' : saved ? <><Check size={18} /> Profile Saved!</> : <><User size={18} /> Save Profile & Activate AI</>}
                    </button>
                </form>
            </Card>

            <div style={{
                padding: '16px 20px',
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                fontSize: '0.85rem',
                color: 'var(--muted)',
                lineHeight: 1.6
            }}>
                💡 <strong style={{ color: 'white' }}>Why this matters:</strong> Without a monthly income, the AI Health Score defaults to 50 (insufficient data), the Stress Prediction cannot fire warnings, and the AI Assistant cannot give personalized advice. Set your income once and Oracle will run autonomously.
            </div>
        </div>
    );
};
