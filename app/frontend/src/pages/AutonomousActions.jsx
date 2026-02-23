import React, { useState, useEffect } from 'react';
import { Cpu, Zap, CheckCircle, Clock, ShieldCheck, Play } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const AutonomousActions = ({ user }) => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(null);

    const fetchActions = async () => {
        try {
            const data = await api.getAutonomousActions(user?.id || 1);
            setActions(data.autonomous_actions || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActions();
    }, []);

    const handleExecute = async (actionId) => {
        setExecuting(actionId);
        await new Promise(r => setTimeout(r, 1500));
        setActions(prev => prev.filter((_, i) => i !== actionId));
        setExecuting(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '8px' }}>
                        <Cpu size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Autonomous Engine</h1>
                        <p style={{ color: 'var(--muted)' }}>ML-driven strategy optimization and Explainable AI</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {loading ? (
                    <div style={{ color: 'var(--muted)', padding: '40px' }}>Polling strategy center...</div>
                ) : actions.length === 0 ? (
                    <Card style={{ padding: '48px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                        <h3>Strategy Optimized</h3>
                        <p style={{ color: 'var(--muted)' }}>No high-priority autonomous actions pending. Your current allocations are within risk parameters.</p>
                    </Card>
                ) : actions.map((action, i) => (
                    <Card key={i} title={action.type.replace(/_/g, ' ')} icon={Zap}>
                        <div style={{ marginTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Priority</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: action.priority_score > 0.8 ? 'var(--danger)' : 'var(--primary)' }}>
                                    {(action.priority_score * 100).toFixed(0)}%
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: 'white' }}>
                                {action.message}
                            </p>
                            <p style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'var(--accent)', fontWeight: 500, background: 'rgba(16, 185, 129, 0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <Play size={12} style={{ marginRight: '6px' }} /> Recommendation: {action.action}
                            </p>

                            {action.why && action.why.length > 0 && (
                                <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explainable AI (Reasoning)</p>
                                    {action.why.map((reason, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '4px' }}>
                                            <div style={{ color: 'var(--primary)' }}>•</div>
                                            <div>{reason}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    className="btn-primary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    onClick={() => handleExecute(i)}
                                    disabled={executing === i}
                                >
                                    {executing === i ? 'Executing...' : 'Approve & Execute'}
                                </button>
                                <button className="btn-ghost" style={{ flex: 0.4 }}>Dismiss</button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card title="System Sovereignty" icon={ShieldCheck}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                            The autonomous engine operates with "Human-in-the-loop" constraints. Critical capital moves always require manual verification.
                        </p>
                    </div>
                    <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                        ACTIVE & SECURE
                    </div>
                </div>
            </Card>
        </div>
    );
};
