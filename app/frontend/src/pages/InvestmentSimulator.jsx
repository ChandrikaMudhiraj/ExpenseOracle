import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Calculator, Sparkles } from 'lucide-react';
import { Card, MetricCard } from '../components/Layout';
import { api } from '../services/api';

export const InvestmentSimulator = () => {
    const [principal, setPrincipal] = useState(1000);
    const [years, setYears] = useState(1);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const data = await api.simulateInvestments(principal, years);
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header>
                <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calculator color="var(--primary)" /> Future Investment Growth
                </h1>
                <p style={{ color: 'var(--muted)' }}>We estimate how your investment may grow over time based on market patterns.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'clamp(250px, 100%, 1fr) 1fr', gap: '24px', minWidth: 0 }}>
                <Card title="Choose Your Savings Plan">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>How much are you starting with? ($)</label>
                            <input
                                type="number"
                                value={principal}
                                onChange={e => setPrincipal(Number(e.target.value))}
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>How many years will you save for?</label>
                            <input
                                type="number"
                                value={years}
                                onChange={e => setYears(Number(e.target.value))}
                                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px', color: 'white' }}
                            />
                        </div>
                        <button className="btn-primary" onClick={handleSimulate} disabled={loading} style={{ marginTop: '10px' }}>
                            {loading ? 'Calculating...' : 'Show My Future Savings'}
                        </button>
                    </div>
                </Card>

                {result ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {Object.entries(result.simulations || {}).map(([name, data]) => (
                                <Card key={name} title={name} icon={TrendingUp}>
                                    <div style={{ marginTop: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 10px',
                                                background: data.risk_band === 'High Risk' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                color: data.risk_band === 'High Risk' ? '#ef4444' : '#10b981',
                                                borderRadius: '20px',
                                                fontWeight: 600
                                            }}>
                                                {data.risk_band === 'High Risk' ? 'Fast Growth' : 'Steady Growth'}
                                            </span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Risk vs Reward Score: {data.risk_reward_score}</span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Estimated Growth</span>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{data.expected_return}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Risk Level</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{data.projection?.risk_level}</span>
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: '12px',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--glass-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '6px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Estimated Total at End</span>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>${data.projection?.mean.toLocaleString()}</span>
                                            </div>
                                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', margin: '4px 0' }}>
                                                <div style={{ width: '60%', height: '100%', background: 'var(--primary)', margin: '0 auto' }}></div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)' }}>
                                                <span>Lowest Expected Outcome: ${data.projection?.lowest_outcome.toLocaleString()}</span>
                                                <span>Best Expected Outcome: ${data.projection?.best_outcome.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '12px', lineHeight: '1.4' }}>
                                            Composition: {data.composition}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Card title="Our Money-Saving Tip" icon={Sparkles}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.95rem', color: 'white', lineHeight: '1.6' }}>
                                        Our future growth estimate based on 1,000 market patterns suggests that a <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Conservative</span> allocation
                                        is currently optimal for your {years}-year horizon, giving you the best risk vs reward score while keeping your risk level low.
                                    </p>
                                </div>
                                <div style={{
                                    padding: '12px 24px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                    MOVE SURPLUS TO SAVINGS
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <Card>
                        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--muted)' }}>
                            <div>
                                <Sparkles size={48} color="rgba(99, 102, 241, 0.2)" style={{ margin: '0 auto 16px' }} />
                                <p>Fill in the boxes above to see how your money could grow.</p>
                                <p style={{ fontSize: '0.8rem' }}>We use smart calculations to show you different possibilities.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
