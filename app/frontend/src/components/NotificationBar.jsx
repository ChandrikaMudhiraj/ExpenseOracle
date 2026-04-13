import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const NotificationBar = ({ notifications = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [displayNotifications, setDisplayNotifications] = useState([]);

    useEffect(() => {
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
        setDisplayNotifications(notifications);
    }, [notifications]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'warning':
                return <AlertCircle size={18} style={{ color: '#ef4444' }} />;
            case 'success':
                return <CheckCircle size={18} style={{ color: '#10b981' }} />;
            case 'info':
            default:
                return <Info size={18} style={{ color: 'var(--primary)' }} />;
        }
    };

    const getNotificationStyle = (type) => {
        const baseStyle = {
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
            borderLeft: '4px solid',
            animation: 'slideIn 0.3s ease-out'
        };

        switch (type) {
            case 'warning':
                return {
                    ...baseStyle,
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderLeftColor: '#ef4444',
                    color: '#fca5a5'
                };
            case 'success':
                return {
                    ...baseStyle,
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderLeftColor: '#10b981',
                    color: '#a7f3d0'
                };
            case 'info':
            default:
                return {
                    ...baseStyle,
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderLeftColor: 'var(--primary)',
                    color: '#c7d2fe'
                };
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Notification Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    ':hover': {
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)'
                    }
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.target.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.target.style.background = 'none';
                        e.target.style.color = 'var(--muted)';
                    }
                }}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            background: '#ef4444',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '700'
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Popup */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '45px',
                        right: '-80px',
                        background: 'var(--background)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '16px',
                        width: '350px',
                        maxHeight: '400px',
                        overflow: 'auto',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 1000
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Notifications</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--muted)',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {displayNotifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <div>
                            {displayNotifications.map((notif, index) => (
                                <div key={index} style={getNotificationStyle(notif.type)}>
                                    {getNotificationIcon(notif.type)}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '2px' }}>
                                            {notif.title}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                            {notif.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};