import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Assistant = ({ user }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am your ExpenseOracle. How can I help you optimize your finances today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.oracleChat(user?.id || 1, input);
            setMessages(prev => [...prev, { role: 'assistant', text: res.response || "I've analyzed your request and updated your strategy." }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble connecting to my intelligence core right now.", error: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <header>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sparkles color="var(--primary)" /> AI Assistant
                </h1>
                <p style={{ color: 'var(--muted)' }}>Contextual financial advice powered by ML</p>
            </header>

            <Card>
                <div style={{ height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: '12px',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{
                                padding: '8px',
                                background: msg.role === 'user' ? 'var(--primary)' : 'var(--glass)',
                                borderRadius: '8px'
                            }}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div style={{
                                background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                maxWidth: '80%',
                                fontSize: '0.95rem',
                                border: msg.error ? '1px solid var(--danger)' : '1px solid var(--glass-border)',
                                color: msg.error ? 'var(--danger)' : 'inherit'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && <div style={{ color: 'var(--muted)', fontSize: '0.8rem', paddingLeft: '40px' }}>Oracle is thinking...</div>}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your budget, savings, or investment strategy..."
                        style={{
                            flex: 1,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <button onClick={handleSend} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={18} />
                    </button>
                </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <Card title="Suggested Actions" icon={AlertCircle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className="btn-ghost" style={{ textAlign: 'left', fontSize: '0.85rem', padding: '12px', border: '1px solid var(--glass-border)' }}>
                            "Rebalance my 'Eating Out' budget"
                        </button>
                        <button className="btn-ghost" style={{ textAlign: 'left', fontSize: '0.85rem', padding: '12px', border: '1px solid var(--glass-border)' }}>
                            "Analyze my last salary event"
                        </button>
                    </div>
                </Card>
                <Card title="Quick Insight" icon={Sparkles}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                        Based on your spending patterns, you can save an additional $200 this month by reducing
                        subscription overlaps detected in January.
                    </p>
                </Card>
            </div>
        </div>
    );
};
