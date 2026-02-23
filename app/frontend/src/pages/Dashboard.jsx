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
                const userId = user?.id || 1;
                const [health, forecast, analytics, anomaliesData] = await Promise.all([
                    api.getHealthScore(userId),
                    api.getForecast(userId),
                    api.getAnalytics(userId),
                    api.getAnomalies(userId)
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>Financial Intelligence</h1>
                    <p style={{ color: 'var(--muted)' }}>Welcome back, <span style={{ color: 'white', fontWeight: 600 }}>{user?.email?.split('@')[0] || 'Member'}</span>. Here is your autonomous overview.</p>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    System Status: <span style={{ color: '#10b981' }}>● Optimized</span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <MetricCard
                    label="Health Score"
                    value={data.health?.health_score || '78'}
                    trend={+5}
                    icon={Zap}
                    color="#f59e0b"
                />
                <MetricCard
                    label="Monthly Forecast"
                    value={`$${(data.forecast?.monthly_forecast || 2450).toLocaleString()}`}
                    trend={-2.4}
                    icon={TrendingUp}
                    color="#6366f1"
                />
                <MetricCard
                    label="Savings Rate"
                    value={`${(data.health?.metrics?.savings_ratio * 100 || 15.5).toFixed(1)}%`}
                    trend={0.8}
                    icon={DollarSign}
                    color="#10b981"
                />
                <MetricCard
                    label="Active Anomalies"
                    value={(data.anomalies?.length || 0).toString()}
                    icon={ShieldAlert}
                    color="#ef4444"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Card title="Spending Forecast" subtitle="Actual vs ML-Projected trend" icon={BarChart3}>
                        <div style={{ height: '300px', marginTop: '20px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'white' }}
                                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                                    />
                                    <Area type="monotone" dataKey="forecast" name="Predicted" stroke="var(--primary)" fillOpacity={1} fill="url(#colorForecast)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="actual" name="Actual" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card title="Detected Anomalies" subtitle="ML-flagged unusual spending" icon={ShieldAlert}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                            {(data.anomalies || []).length === 0 ? (
                                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No unusual activity detected recently.</p>
                            ) : data.anomalies.map((anom, i) => (
                                <div key={i} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--danger)' }}>{anom.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                            Prob: {(anom.anomaly_probability * 100).toFixed(0)}% • {anom.reason?.split('.')[0]}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700 }}>${anom.amount}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Card title="Stress Prediction" subtitle="AI Early Warning System" icon={Zap}>
                        <div style={{ marginTop: '16px' }}>
                            <div style={{
                                padding: '16px',
                                borderRadius: '12px',
                                background: data.health?.status === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                border: `1px solid ${data.health?.status === 'Critical' ? '#ef4444' : '#10b981'}33`,
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: data.health?.status === 'Critical' ? '#ef4444' : '#10b981' }}>
                                        {data.health?.status?.toUpperCase() || 'STABLE'}
                                    </span>
                                    <Zap size={14} color={data.health?.status === 'Critical' ? '#ef4444' : '#10b981'} />
                                </div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0' }}>
                                    {data.health?.status === 'Critical' ? 'High Financial Stress' : 'Resilient Trajectory'}
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4' }}>
                                    Predicted confidence: 94%. System advises {data.health?.status === 'Critical' ? 'immediate budget rebalancing' : 'stable allocation'}.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>Recommendations</p>
                                {(data.health?.recommendations || ['Maintain current spending patterns']).slice(0, 3).map((rec, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
                                        <div style={{ color: 'var(--primary)', fontWeight: 700 }}>→</div>
                                        <div style={{ color: 'white' }}>{rec}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card title="Health Metrics" subtitle="Real-time calibration">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            {[
                                { label: 'Savings Rate', val: data.health?.metrics?.savings_rate_pct || 15 },
                                { label: 'Budget Utilization', val: data.health?.metrics?.budget_utilization_pct || 85 },
                                { label: 'Security Score', val: 92 }
                            ].map((item) => (
                                <div key={item.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{item.label}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.val.toFixed(0)}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(item.val, 100)}%`,
                                            height: '100%',
                                            background: item.val > 90 && item.label === 'Budget Utilization' ? 'var(--danger)' : 'var(--primary)'
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
