import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Workspace from './views/Workspace';
import UsersDirectory from './views/UsersDirectory';
import ProfileSettings from './views/ProfileSettings';

function AppContent() {
  const { currentView } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If view is login, render full screen login page
  if (currentView === 'login') {
    return <Login />;
  }

  // Render current dashboard/workspace/directories
  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'workspace':
        return <Workspace />;
      case 'users':
        return <UsersDirectory />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
      
      <div className="main-content">
        <Topbar onToggleSidebar={setSidebarOpen} />
        
        <main className="content-body">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
