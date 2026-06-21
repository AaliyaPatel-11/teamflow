import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Bell, 
  Menu, 
  LogOut, 
  ShieldAlert, 
  UserCheck, 
  ChevronDown 
} from 'lucide-react';

export default function Topbar({ onToggleSidebar }) {
  const { 
    currentUser, 
    currentView, 
    projects, 
    activeWorkspaceId, 
    notifications, 
    clearNotifications,
    setCurrentView,
    switchUser,
    users
  } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));

  const [showNotifications, setShowNotifications] = useState(false);

  // Determine current page title
  let pageTitle = 'Dashboard';
  if (currentView === 'users') {
    pageTitle = currentUser?.role === 'admin' ? 'User Directory & Management' : 'Team Directory';
  } else if (currentView === 'profile') {
    pageTitle = 'My Profile Settings';
  } else if (currentView === 'workspace') {
    const activeProject = projects.find(p => p.id === activeWorkspaceId);
    pageTitle = activeProject ? activeProject.name : 'Project Workspace';
  }

  const handleLogout = () => {
    // Navigate back to login view (we can handle login screen easily in App.jsx)
    setCurrentView('login');
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClearNotifications = (e) => {
    e.stopPropagation();
    clearNotifications();
    setShowNotifications(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="modal-close-btn" 
          style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
          onClick={() => onToggleSidebar(true)}
        >
          <Menu size={20} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-title)' }}>
          {pageTitle}
        </h2>
      </div>

      <div className="topbar-right">
        {/* Role Quick Indicator */}
        <div className={`badge ${currentUser?.role === 'admin' ? 'badge-primary' : 'badge-success'}`} style={{ gap: '6px', fontSize: '11px', display: 'flex', alignItems: 'center' }}>
          {currentUser?.role === 'admin' ? <ShieldAlert size={12} /> : <UserCheck size={12} />}
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
            {currentUser?.role === 'admin' ? 'Admin Mode' : 'Employee Mode'}
          </span>
        </div>

        {/* Notifications Icon with Badge */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary btn-icon" 
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
            onClick={handleToggleNotifications}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: 'var(--danger)',
                color: 'white',
                fontSize: '10px',
                height: '18px',
                width: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: '0',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              width: '260px',
              zIndex: 200,
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700' }}>Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={handleClearNotifications} style={{ fontSize: '11px', color: 'var(--primary-accent)', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600' }}>
                    Clear
                  </button>
                )}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {notifications.length === 0 ? (
                  <li style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                    No new notifications
                  </li>
                ) : (
                  notifications.map(n => (
                    <li key={n.id} style={{ fontSize: '12px', padding: '6px', borderBottom: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {n.text}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User profile dropdown trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="avatar" style={{ backgroundColor: currentUser?.color || '#3b82f6', color: 'white' }}>
            {currentUser?.initials}
          </div>
          {window.innerWidth > 768 && (
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{currentUser?.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser?.department}</span>
            </div>
          )}
          
          <button 
            className="btn btn-secondary btn-icon" 
            style={{ border: 'none', background: 'none', color: 'var(--text-muted)' }}
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
