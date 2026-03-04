import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, Brain, MessageCircle, Zap, Clock, Loader2 } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const Assistant = ({ user }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: 'Hi! I\'m your AI Financial Assistant, powered by advanced machine learning. I analyze your spending patterns, provide personalized insights, and help you make smarter financial decisions. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = {
            role: 'user',
            text: input,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setIsTyping(true);

        try {
            const res = await api.oracleChat(input);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: res.response || "I've analyzed your request and updated your financial strategy accordingly.",
                timestamp: new Date()
            }]);
        } catch (e) {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: "I'm experiencing a temporary connection issue with my neural network. Please try again in a moment.",
                error: true,
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "Help me create a budget for next month",
        "Am I spending too much on dining out?",
        "What's my best investment option right now?",
        "How can I save $500 this month?",
        "Review my recent transactions"
    ];

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            height: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            padding: '0 20px'
        }}>
            {/* Simplified Header */}
            <header style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(255,255,255,0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        margin: 0,
                        background: 'linear-gradient(135deg, rgb(255,255,255) 0%, rgba(255,255,255,0.8) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        AI Financial Assistant
                    </h1>
                    <div style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
                        border: '1px solid rgba(16,185,129,0.4)',
                        borderRadius: '24px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                        <Sparkles size={14} />
                        ONLINE & LEARNING
                    </div>
                </div>
                <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.1rem',
                    margin: 0
                }}>
                    Your intelligent financial companion powered by advanced machine learning.
                </p>
            </header>

            {/* Clean Chat Interface */}
            <Card style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '0',
                overflow: 'hidden'
            }}>
                {/* Messages Container */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    background: 'transparent'
                }}>

                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: '16px',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            alignItems: 'flex-start',
                            animation: `slideIn 0.5s ease forwards ${i * 0.1}s`,
                            opacity: 0,
                            transform: 'translateY(20px)'
                        }}>
                            {/* Avatar */}
                            <div style={{
                                padding: '12px',
                                background: msg.role === 'user' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '50%',
                                flexShrink: 0
                            }}>
                                {msg.role === 'user' ? <User size={20} color="white" /> : <Bot size={20} color="#10b981" />}
                            </div>

                            {/* Message Bubble */}
                            <div style={{
                                background: msg.role === 'user' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)',
                                padding: '16px 20px',
                                borderRadius: '20px',
                                maxWidth: '70%',
                                border: msg.error
                                    ? '1px solid rgba(239, 68, 68, 0.3)'
                                    : '1px solid rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                position: 'relative'
                            }}>
                                {msg.error && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        left: '16px',
                                        padding: '4px 8px',
                                        background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Error
                                    </div>
                                )}
                                <div style={{
                                    fontSize: '1rem',
                                    color: msg.error ? '#fca5a5' : 'white',
                                    lineHeight: '1.6',
                                    marginBottom: '8px'
                                }}>
                                    {msg.text}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <Clock size={12} />
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {/* Message Tail */}
                            <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                [msg.role === 'user' ? 'right' : 'left']: '-8px',
                                width: '0',
                                height: '0',
                                borderStyle: 'solid',
                                borderWidth: msg.role === 'user' ? '8px 0 8px 16px' : '8px 16px 8px 0',
                                borderColor: msg.role === 'user'
                                    ? 'transparent transparent transparent rgba(99, 102, 241, 0.3)'
                                    : 'transparent rgba(255, 255, 255, 0.12) transparent transparent'
                            }}></div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'flex-start',
                            animation: 'slideIn 0.5s ease forwards'
                        }}>
                            <div style={{
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '50%',
                                flexShrink: 0
                            }}>
                                <Bot size={20} color="#10b981" />
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '16px 20px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        background: '#10b981',
                                        borderRadius: '50%',
                                        animation: 'pulse 1.5s infinite'
                                    }}></div>
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        background: '#10b981',
                                        borderRadius: '50%',
                                        animation: 'pulse 1.5s infinite 0.2s'
                                    }}></div>
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        background: '#10b981',
                                        borderRadius: '50%',
                                        animation: 'pulse 1.5s infinite 0.4s'
                                    }}></div>
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Oracle is analyzing...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Clean Input Area */}
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '24px 32px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about your finances, budgeting, investments, or savings strategies..."
                                style={{
                                    width: '100%',
                                    minHeight: '56px',
                                    maxHeight: '120px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '16px 20px',
                                    color: 'white',
                                    outline: 'none',
                                    resize: 'none',
                                    fontSize: '1rem',
                                    lineHeight: '1.5',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            style={{
                                padding: '16px',
                                background: loading || !input.trim()
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                                border: 'none',
                                borderRadius: '16px',
                                color: loading || !input.trim() ? 'var(--muted)' : 'white',
                                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: loading || !input.trim() ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '56px',
                                minHeight: '56px'
                            }}
                        >
                            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
                        </button>
                    </div>

                    {/* Simplified Suggested Questions */}
                    {messages.length <= 1 && (
                        <div style={{ marginTop: '32px' }}>
                            <div style={{
                                textAlign: 'center',
                                marginBottom: '24px',
                                padding: '16px 24px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                display: 'inline-block',
                                margin: '0 auto 24px auto'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '1rem',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 600,
                                    marginBottom: '4px'
                                }}>
                                    <Sparkles size={18} color="#f59e0b" />
                                    <span>💡 Popular Questions</span>
                                </div>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    margin: 0,
                                    fontWeight: 400
                                }}>
                                    Click on any question below to get started
                                </p>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '16px',
                                maxWidth: '100%'
                            }}>
                                {suggestedQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInput(question)}
                                        style={{
                                            padding: '20px 24px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            fontSize: '0.95rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            backdropFilter: 'blur(10px)',
                                            textAlign: 'left',
                                            lineHeight: '1.5'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                                            e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                background: 'linear-gradient(135deg, #10b981, #f59e0b)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                flexShrink: 0
                                            }}>
                                                {index === 0 ? '💰' : index === 1 ? '🍽️' : index === 2 ? '📈' : index === 3 ? '💸' : '📊'}
                                            </div>
                                            <span>{question}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div style={{
                                marginTop: '32px',
                                padding: '24px',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)',
                                borderRadius: '20px',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                backdropFilter: 'blur(15px)',
                                textAlign: 'center'
                            }}>
                                <h4 style={{
                                    fontSize: '1.1rem',
                                    color: 'white',
                                    margin: '0 0 16px 0',
                                    fontWeight: 600
                                }}>
                                    🚀 Why Choose Oracle?
                                </h4>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '16px',
                                    fontSize: '0.9rem',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                        <span>Real-time Analysis</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div>
                                        <span>Personalized Insights</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#8b5cf6', borderRadius: '50%' }}></div>
                                        <span>24/7 Availability</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
