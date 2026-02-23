import React from 'react';
import { Home, Activity, Target, Bot, Cpu, Settings, LogOut, Calculator, ShieldCheck, Briefcase } from 'lucide-react';
export const Sidebar = ({ activeTab, setTab, onLogout, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'expenses', label: 'Expenses', icon: Activity },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'goals', label: 'Goal Planning', icon: Briefcase },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'simulator', label: 'Simulator', icon: Calculator },
    { id: 'autonomous', label: 'Autonomy', icon: Cpu },
  ];

  return (
    <div className="glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: 'calc(100vh - 40px)',
      margin: '20px',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px'
    }}>
      <div style={{ padding: '0 12px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8 }}></div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>ExpenseOracle</h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`btn-ghost ${activeTab === item.id ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
              width: '100%',
              background: activeTab === item.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: activeTab === item.id ? 'var(--primary)' : 'var(--muted)',
            }}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          padding: '16px 12px',
          marginBottom: '12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: 0 }}>Active Session</p>
          </div>
        </div>

        <button className="btn-ghost" onClick={() => setTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={20} />
          <span>Profile & Settings</span>
        </button>
        <button className="btn-ghost" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export const Card = ({ title, children, subtitle, icon: Icon }) => (
  <div className="card animate-fade-in">
    {(title || Icon) && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          {title && <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>}
          {subtitle && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{subtitle}</p>}
        </div>
        {Icon && <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}><Icon size={20} color="var(--primary)" /></div>}
      </div>
    )}
    {children}
  </div>
);

export const MetricCard = ({ label, value, trend, icon: Icon, color = 'var(--primary)' }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ padding: '12px', background: `${color}15`, borderRadius: '12px' }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</h2>
          {trend && <span style={{ color: trend > 0 ? 'var(--accent)' : 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>}
        </div>
      </div>
    </div>
  </Card>
);
