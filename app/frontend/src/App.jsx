import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Assistant } from './pages/Assistant';
import { Expenses } from './pages/Expenses';
import { Budgets } from './pages/Budgets';
import { GoalPlanning } from './pages/GoalPlanning';
import { Auth } from './pages/Auth';
import { InvestmentSimulator } from './pages/InvestmentSimulator';
import { AutonomousActions } from './pages/AutonomousActions';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('oracle_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('oracle_user');
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (data) => {
    const userToStore = data.user || { id: 1, email: 'user@example.com' };
    localStorage.setItem('oracle_user', JSON.stringify(userToStore));
    setUser(userToStore);
  };

  const handleLogout = () => {
    localStorage.removeItem('oracle_user');
    setUser(null);
    setTab('dashboard');
  };

  if (loading) return <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'white' }}></div>;

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} setTab={setTab} onLogout={handleLogout} user={user} />

      <main style={{
        flex: 1,
        marginLeft: 'calc(var(--sidebar-width) + 40px)',
        padding: '40px 40px 40px 0',
        maxWidth: '1200px'
      }}>
        <ErrorBoundary>
          {activeTab === 'dashboard' && <Dashboard user={user} />}
          {activeTab === 'assistant' && <Assistant user={user} />}
          {activeTab === 'analytics' && <Dashboard user={user} />}
          {activeTab === 'anomalies' && <Dashboard user={user} />}
          {activeTab === 'expenses' && <Expenses user={user} />}
          {activeTab === 'budgets' && <Budgets user={user} />}
          {activeTab === 'simulator' && <InvestmentSimulator user={user} />}
          {activeTab === 'autonomous' && <AutonomousActions user={user} />}

          {['dashboard', 'assistant', 'expenses', 'budgets', 'simulator', 'autonomous', 'analytics', 'anomalies'].indexOf(activeTab) === -1 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              <h2 style={{ marginBottom: '10px' }}>Intelligence Module Coming Soon</h2>
              <p>We are currently calibrating the {activeTab} autonomous engine.</p>
              <button className="btn-primary" onClick={() => setTab('dashboard')} style={{ marginTop: '20px' }}>
                Return to Dashboard
              </button>
            </div>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
