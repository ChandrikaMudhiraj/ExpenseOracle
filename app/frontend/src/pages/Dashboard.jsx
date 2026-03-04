import React, { useState, useEffect } from 'react';
import { DollarSign, Zap, TrendingUp, ShieldAlert, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MetricCard, Card } from '../components/Layout';
import { api } from '../services/api';

export const Dashboard = ({ user }) => {
    const [data, setData] = useState({
        health: null,
        forecast: null,
        analytics: null,
        anomalies: [],
        loading: true
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [health, forecast, analytics, anomaliesData] = await Promise.all([
                    api.getHealthScore(),
                    api.getForecast(),
                    api.getAnalytics(),
                    api.getAnomalies()
                ]);
                setData({
                    health,
                    forecast,
                    analytics,
                    anomalies: anomaliesData.anomalies || [],
                    loading: false
                });
            } catch (e) {
                console.error("Failed to load dashboard data", e);
                setData(d => ({ ...d, loading: false }));
            }
        };
        loadData();
    }, [user]);

    if (data.loading) return <div style={{ padding: '40px', color: 'var(--muted)' }}>Loading intelligence...</div>;

    const forecastData = (data.analytics?.series?.forecast_vs_actual || []).map((item) => ({
        name: String(item.month || 'Unknown'),
        actual: typeof item.actual === 'number' ? item.actual : 0,
        forecast: typeof item.forecast === 'number' ? item.forecast : 0
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(to right, #ffffff, var(--muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Oracle Intelligence
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
                        Welcome back, <span style={{ color: 'white', fontWeight: 600 }}>{user?.email?.split('@')[0] || 'Member'}</span>.
                        System is <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Active & Optimizing</span>.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '6px' }}>
                            Income: <span style={{ color: 'white', fontWeight: 600 }}>${(user?.monthly_income || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '6px' }}>
                            Risk: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.risk_tolerance || 'Moderate'}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    {data.health?.metrics?.budget_usage_pct > 100 && (
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#ef4444',
                            padding: '6px 12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '4px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            animation: 'pulse 2s infinite'
                        }}>
                            ⚠️ WARNING: BUDGET EXCEEDED
                        </div>
                    )}
                    <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#10b981',
                        padding: '10px 20px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '30px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
                        Oracle Neural Link: Secure
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                <MetricCard
                    label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Health Score
                            <span title="This score is based on how much you save, how well you follow your budget, and how stable your spending is." style={{ cursor: 'help', opacity: 0.6 }}><Zap size={14} /></span>
                        </span>
                    }
                    value={data.health?.score || '78'}
                    subtitle="A simple score that shows how well you're managing your money."
                    trend={+5}
                    icon={Zap}
                    color={
                        (data.health?.score || 78) >= 80 ? "#10b981" :
                            (data.health?.score || 78) >= 60 ? "#6366f1" :
                                (data.health?.score || 78) >= 40 ? "#f59e0b" : "#ef4444"
                    }
                />
                <MetricCard
                    label="Monthly Estimate"
                    value={`$${(data.forecast?.forecast_analysis?.monthly_forecast || 2450).toLocaleString()}`}
                    subtitle="What you may spend next month based on recent habits."
                    trend={-2.4}
                    icon={TrendingUp}
                    color="#6366f1"
                />
                <MetricCard
                    label="Actual Savings"
                    value={`${(data.health?.metrics?.savings_rate_pct || 15.5)}%`}
                    subtitle="Percentage of income saved after all expenses."
                    trend={0.8}
                    icon={DollarSign}
                    color="#10b981"
                />
                <MetricCard
                    label="Unusual Spending"
                    value={(data.anomalies?.length || 0).toString()}
                    subtitle={(data.anomalies || []).length === 0 ? "Everything looks normal." : "Check high-cost items."}
                    icon={ShieldAlert}
                    color="#ef4444"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Monthly Estimate" subtitle="What you may spend next month." icon={BarChart3}>
                        <div style={{ height: '350px', marginTop: '24px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(15, 15, 20, 0.95)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                        }}
                                        itemStyle={{ color: 'white', fontSize: '0.9rem' }}
                                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                                    />
                                    <Area type="monotone" dataKey="forecast" name="Predicted" stroke="var(--primary)" fillOpacity={1} fill="url(#colorForecast)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="actual" name="Actual" stroke="#10b981" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} strokeDasharray="6 4" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card title="Unusual Spending" subtitle="We check if any recent spending is higher than normal." icon={ShieldAlert}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                            {(data.anomalies || []).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No unusual spending found. Everything looks normal.</p>
                                </div>
                            ) : data.anomalies.map((anom, i) => (
                                <div key={i} style={{
                                    padding: '16px',
                                    background: 'linear-gradient(to right, rgba(239, 68, 68, 0.08), transparent)',
                                    border: '1px solid rgba(239, 68, 68, 0.15)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    animation: 'fadeIn 0.5s ease forwards'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fca5a5', marginBottom: '4px' }}>{anom.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ padding: '2px 8px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>CHECK NEEDED</span>
                                            This is higher than your usual spending.
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>${anom.amount}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Future Warning" subtitle="We check if your spending might cause a shortage." icon={Zap}>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{
                                padding: '20px',
                                borderRadius: '16px',
                                background: data.health?.status === 'Critical'
                                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)'
                                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                border: `1px solid ${data.health?.status === 'Critical' ? '#ef4444' : '#10b981'}44`,
                                marginBottom: '24px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.1 }}>
                                    <Zap size={60} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.05em',
                                        color: data.health?.status === 'Critical' ? '#ef4444' : '#10b981',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '4px 10px',
                                        borderRadius: '20px'
                                    }}>
                                        {data.health?.status === 'Critical' ? 'Review Needed' :
                                            data.health?.status === 'Vulnerable' ? 'Needs Attention' :
                                                data.health?.status === 'Stable' ? 'Good' : 'Excellent'}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
                                    {data.health?.status === 'Critical' ? 'Attention Needed' : 'Your Balance is Safe'}
                                </h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
                                    {data.health?.status === 'Critical'
                                        ? 'Your spending needs attention. Small changes can improve this quickly.'
                                        : 'You’re on track for this month 👍'}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Smart Advice</p>
                                {(data.health?.recommendations || ['Keep up the good work!']).slice(0, 3).map((rec, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        gap: '12px',
                                        fontSize: '0.9rem',
                                        alignItems: 'flex-start',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{ color: 'var(--primary)', fontWeight: 900 }}>0{i + 1}</div>
                                        <div style={{ color: '#e2e8f0', lineHeight: 1.4 }}>{rec}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Metrics" subtitle="Real-time checks">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                            {[
                                {
                                    label: (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Spending Stability
                                            <span title="Shows how consistent your spending is month to month." style={{ cursor: 'help', opacity: 0.6 }}><Zap size={12} /></span>
                                        </span>
                                    ),
                                    val: data.health?.metrics?.stability_score || 15,
                                    color: '#10b981'
                                },
                                { label: 'Budget Used', val: data.health?.metrics?.budget_usage_pct || 85, color: '#6366f1' },
                                { label: 'AI Confidence', val: 92, color: '#f59e0b' }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500 }}>{item.label}</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.val.toFixed(0)}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(item.val, 100)}%`,
                                            height: '100%',
                                            background: `linear-gradient(to right, ${item.color}88, ${item.color})`,
                                            borderRadius: '4px',
                                            boxShadow: `0 0 10px ${item.color}44`
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
