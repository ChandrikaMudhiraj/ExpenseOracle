import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.login(email, password);
                onAuthSuccess(res);
            } else {
                await api.register(email, password);
                const res = await api.login(email, password);
                onAuthSuccess(res);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            padding: '20px'
        }}>
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'var(--primary)',
                        borderRadius: 16,
                        margin: '0 auto 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Sparkles size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>ExpenseOracle</h1>
                    <p style={{ color: 'var(--muted)' }}>Precision intelligence for your wealth</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>

                        {error && (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid var(--danger)',
                                borderRadius: '8px',
                                color: 'var(--danger)',
                                fontSize: '0.85rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} size={18} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '12px 12px 12px 42px',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '12px 12px 12px 42px',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ padding: '14px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            {loading ? 'Authenticating...' : (isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Register</>)}
                        </button>

                        <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ fontSize: '0.85rem' }}
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
