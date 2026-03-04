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
import { Profile } from './pages/Profile';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [activeTab, setTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('oracle_user');
    const savedToken = localStorage.getItem('oracle_token');

    // Emergency Check: If we merged JWT but user has old session without token, clear it.
    if (savedUser && !savedToken) {
      localStorage.removeItem('oracle_user');
      setUser(null);
    } else if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('oracle_user');
        localStorage.removeItem('oracle_token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleSwitchTab = (e) => setTab(e.detail);
    const handleAuthError = () => handleLogout();

    window.addEventListener('switchTab', handleSwitchTab);
    window.addEventListener('oracle_auth_error', handleAuthError);

    return () => {
      window.removeEventListener('switchTab', handleSwitchTab);
      window.removeEventListener('oracle_auth_error', handleAuthError);
    };
  }, []);

  const handleAuthSuccess = (data) => {
    const userToStore = data.user || { id: 1, email: 'user@example.com' };
    localStorage.setItem('oracle_user', JSON.stringify(userToStore));
    if (data.access_token) {
      localStorage.setItem('oracle_token', data.access_token);
    }
    setUser(userToStore);
  };

  const handleLogout = () => {
    localStorage.removeItem('oracle_user');
    localStorage.removeItem('oracle_token');
    setUser(null);
    setTab('dashboard');
  };

  const handleUserUpdate = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    localStorage.setItem('oracle_user', JSON.stringify(newUser));
    setUser(newUser);
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
          {activeTab === 'goals' && <GoalPlanning user={user} />}
          {activeTab === 'simulator' && <InvestmentSimulator user={user} />}
          {activeTab === 'autonomous' && <AutonomousActions user={user} />}
          {activeTab === 'profile' && <Profile user={user} onUpdateUser={handleUserUpdate} />}

          {['dashboard', 'assistant', 'expenses', 'budgets', 'goals', 'simulator', 'autonomous', 'analytics', 'anomalies', 'profile'].indexOf(activeTab) === -1 && (
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
