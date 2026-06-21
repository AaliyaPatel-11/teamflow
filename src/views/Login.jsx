import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { FolderKanban, ShieldCheck, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const { users, switchUser, setCurrentView } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' or 'employee'
  const [selectedUserId, setSelectedUserId] = useState('');

  const admins = users.filter(u => u.role === 'admin');
  const employees = users.filter(u => u.role === 'employee');

  // Sync initial select user
  React.useEffect(() => {
    if (selectedRole === 'admin' && admins.length > 0) {
      setSelectedUserId(admins[0].id);
    } else if (selectedRole === 'employee' && employees.length > 0) {
      setSelectedUserId(employees[0].id);
    }
  }, [selectedRole]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    
    switchUser(selectedUserId);
    setCurrentView('dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic background shapes */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '-10%',
        right: '-10%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0) 70%)',
        bottom: '-10%',
        left: '-10%',
        zIndex: 0
      }} />

      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 1,
        color: '#fff',
        textAlign: 'center'
      }}>
        {/* App Logo */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          color: 'white',
          marginBottom: '16px',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
        }}>
          <FolderKanban size={32} strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-title)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          TeamFlow
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px' }}>
          Workforce & Internship Management Portal
        </p>

        {/* Tab Role Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button 
            type="button"
            onClick={() => setSelectedRole('admin')}
            style={{
              flex: 1,
              background: selectedRole === 'admin' ? 'var(--primary-accent)' : 'none',
              border: 'none',
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              color: '#fff',
              padding: '10px 0',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition-fast)'
            }}
          >
            <ShieldCheck size={14} />
            Administrator
          </button>
          <button 
            type="button"
            onClick={() => setSelectedRole('employee')}
            style={{
              flex: 1,
              background: selectedRole === 'employee' ? 'var(--primary-accent)' : 'none',
              border: 'none',
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              color: '#fff',
              padding: '10px 0',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition-fast)'
            }}
          >
            <User size={14} />
            Intern / Employee
          </button>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Select Account Profile</label>
            <select 
              className="form-control"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                height: '46px',
                fontSize: '14px',
                outline: 'none'
              }}
              required
            >
              {selectedRole === 'admin' 
                ? admins.map(u => (
                    <option key={u.id} value={u.id} style={{ backgroundColor: '#0f172a' }}>
                      {u.name} (Program Director)
                    </option>
                  ))
                : employees.map(u => (
                    <option key={u.id} value={u.id} style={{ backgroundColor: '#0f172a' }}>
                      {u.name} ({u.department})
                    </option>
                  ))
              }
            </select>
          </div>

          <div style={{ marginTop: '28px' }}>
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              style={{
                height: '46px',
                fontSize: '15px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, var(--primary-accent) 0%, #1d4ed8 100%)',
                border: 'none',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
              }}
            >
              Enter Workspace
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div style={{ marginTop: '32px', fontSize: '11px', color: '#64748b' }}>
          TeamFlow Workforce MVP • Offline Capable Progressive Web App
        </div>
      </div>
    </div>
  );
}
