import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  User, 
  LogOut,
  FolderKanban,
  Clock,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { 
    currentView, 
    setCurrentView, 
    projects, 
    activeWorkspaceId, 
    setActiveWorkspaceId,
    currentUser,
    switchUser,
    users
  } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));

  const menuItems = [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'users', label: currentUser?.role === 'admin' ? 'User Directory' : 'Directory', icon: Users },
    { view: 'profile', label: 'My Profile', icon: User }
  ];

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (window.innerWidth <= 768) {
      toggleSidebar(false); // Close sidebar on mobile select
    }
  };

  const handleWorkspaceSelect = (projId) => {
    setActiveWorkspaceId(projId);
    setCurrentView('workspace');
    if (window.innerWidth <= 768) {
      toggleSidebar(false);
    }
  };

  // Determine user list for quick switching
  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={() => toggleSidebar(false)}></div>}

      {/* Sidebar for Desktop & Slide-out for Mobile */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">
              <FolderKanban size={22} strokeWidth={2.5} />
            </span>
            <span>TeamFlow</span>
          </div>
          {window.innerWidth <= 768 && (
            <button className="modal-close-btn" style={{color: '#fff'}} onClick={() => toggleSidebar(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <li key={item.view}>
                <a 
                  className={`sidebar-item-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.view)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}

          <li style={{ marginTop: '16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', paddingLeft: '16px' }}>
              Workspaces
            </span>
          </li>

          {/* List of Projects (Workspaces) user is member of (or all if admin) */}
          {projects
            .filter(p => currentUser?.role === 'admin' || p.members.includes(currentUser?.id))
            .map((p) => {
              const isActive = currentView === 'workspace' && activeWorkspaceId === p.id;
              return (
                <li key={p.id}>
                  <a 
                    className={`sidebar-item-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleWorkspaceSelect(p.id)}
                    style={{ fontSize: '13px', paddingLeft: '24px' }}
                  >
                    <Briefcase size={14} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </span>
                  </a>
                </li>
              );
            })}
        </ul>

        {/* Quick Swapper */}
        <div className="sidebar-footer" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div className="avatar" style={{ backgroundColor: currentUser?.color, color: 'white', width: '32px', height: '32px', fontSize: '12px' }}>
              {currentUser?.initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentUser?.name}</div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>{currentUser?.role}</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
            <label style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Switch User (Demo Mode):
            </label>
            <select 
              value={currentUser?.id} 
              onChange={(e) => switchUser(e.target.value)}
              style={{
                width: '100%', 
                fontSize: '12px', 
                backgroundColor: '#1e293b', 
                color: '#fff', 
                border: '1px solid #334155',
                borderRadius: '4px',
                padding: '4px 8px',
                outline: 'none'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'admin' ? 'Admin' : 'Intern'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bottombar">
        <a 
          className={`bottombar-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigate('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>
        <a 
          className={`bottombar-item ${currentView === 'workspace' ? 'active' : ''}`}
          onClick={() => handleWorkspaceSelect(activeWorkspaceId || projects[0]?.id)}
        >
          <Briefcase size={20} />
          <span>Workspace</span>
        </a>
        <a 
          className={`bottombar-item ${currentView === 'users' ? 'active' : ''}`}
          onClick={() => handleNavigate('users')}
        >
          <Users size={20} />
          <span>Directory</span>
        </a>
        <a 
          className={`bottombar-item ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => handleNavigate('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </a>
      </nav>
    </>
  );
}
