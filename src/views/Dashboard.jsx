import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FolderKanban, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PlusCircle,
  Megaphone,
  ChevronRight,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateUserModal from '../components/CreateUserModal';

export default function Dashboard() {
  const { 
    currentUser, 
    projects, 
    users, 
    tasks, 
    attendance, 
    announcements, 
    getProjectCompletion,
    setCurrentView,
    setActiveWorkspaceId
  } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Filter projects depending on user permission
  const userProjects = currentUser?.role === 'admin' 
    ? projects 
    : projects.filter(p => p.members.includes(currentUser?.id));

  // 1. KPI Stats Calculation
  const totalProjectsCount = userProjects.length;
  
  const totalMembersCount = users.filter(u => u.role === 'employee').length;

  const projectIds = userProjects.map(p => p.id);
  const relevantTasks = tasks.filter(t => currentUser?.role === 'admin' || projectIds.includes(t.projectId));
  
  const pendingTasksCount = relevantTasks.filter(t => t.status !== 'Completed').length;
  const completedTasksCount = relevantTasks.filter(t => t.status === 'Completed').length;

  // Attendance rate calculation
  const employeeAttendance = attendance.filter(a => currentUser?.role === 'admin' || a.userId === currentUser?.id);
  const presentRecords = employeeAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const totalAttendanceRecords = employeeAttendance.length;
  const attendanceRate = totalAttendanceRecords > 0 
    ? Math.round((presentRecords / totalAttendanceRecords) * 100) 
    : 100;

  // 2. Announcements
  const recentAnnouncements = announcements.slice(0, 3);

  // Open Workspace Action
  const handleOpenWorkspace = (projId) => {
    setActiveWorkspaceId(projId);
    setCurrentView('workspace');
  };

  // SVGs for Analytics
  const blockedTasksCount = relevantTasks.filter(t => t.status === 'Blocked').length;
  const inProgressTasksCount = relevantTasks.filter(t => t.status === 'In Progress').length;
  const notStartedTasksCount = relevantTasks.filter(t => t.status === 'Not Started').length;
  
  const totalTasks = relevantTasks.length || 1;
  const compPct = Math.round((completedTasksCount / totalTasks) * 100);
  const progPct = Math.round((inProgressTasksCount / totalTasks) * 100);
  const blockPct = Math.round((blockedTasksCount / totalTasks) * 100);
  const nsPct = Math.round((notStartedTasksCount / totalTasks) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderRadius: 'var(--radius-md)',
        padding: '28px 32px',
        color: 'white',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
            Welcome back, {currentUser?.name}!
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.85, maxWidth: '550px' }}>
            You have <strong style={{ color: '#fff' }}>{pendingTasksCount} pending tasks</strong> across your active project workspaces. Let's keep the momentum going!
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" style={{ border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff' }} onClick={() => setIsUserModalOpen(true)}>
              <Plus size={16} />
              Add Member
            </button>
            <button className="btn btn-secondary" style={{ border: 'none', background: '#fff', color: 'var(--primary)' }} onClick={() => setIsProjectModalOpen(true)}>
              <PlusCircle size={16} />
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* KPI widgets Grid */}
      <div className="widgets-grid">
        <div className="widget-card">
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-accent)' }}>
            <FolderKanban size={22} />
          </div>
          <div className="widget-info">
            <span className="widget-value">{totalProjectsCount}</span>
            <span className="widget-label">Projects Workspaces</span>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
            <Users size={22} />
          </div>
          <div className="widget-info">
            <span className="widget-value">{totalMembersCount}</span>
            <span className="widget-label">Active Interns/Employees</span>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Clock size={22} />
          </div>
          <div className="widget-info">
            <span className="widget-value">{pendingTasksCount}</span>
            <span className="widget-label">Pending Tasks</span>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="widget-info">
            <span className="widget-value">{completedTasksCount}</span>
            <span className="widget-label">Completed Tasks</span>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-icon-wrapper" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <AlertCircle size={22} />
          </div>
          <div className="widget-info">
            <span className="widget-value">{attendanceRate}%</span>
            <span className="widget-label">Attendance Rate</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout (SVG Chart and Announcements) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 992 ? '3fr 2fr' : '1fr',
        gap: '24px'
      }}>
        
        {/* Task Metrics Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px' }}>Task Progression Distribution</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time state overview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            {/* SVG Visual */}
            <div style={{ display: 'flex', justifyContent: 'center', flex: 1, minWidth: '150px' }}>
              <svg width="150" height="150" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--bg-tertiary)" strokeWidth="3" />
                
                {/* Completed (Green) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--success)" strokeWidth="3.2" 
                  strokeDasharray={`${compPct} ${100 - compPct}`} strokeDashoffset="0" />
                
                {/* In Progress (Blue) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--primary-accent)" strokeWidth="3.2" 
                  strokeDasharray={`${progPct} ${100 - progPct}`} strokeDashoffset={-compPct} />

                {/* Blocked (Red) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--danger)" strokeWidth="3.2" 
                  strokeDasharray={`${blockPct} ${100 - blockPct}`} strokeDashoffset={-(compPct + progPct)} />
              </svg>
            </div>
            
            {/* Legend Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1.5, minWidth: '180px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                  <span>Completed Tasks</span>
                </div>
                <strong>{completedTasksCount} ({compPct}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)' }}></span>
                  <span>In Progress</span>
                </div>
                <strong>{inProgressTasksCount} ({progPct}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></span>
                  <span>Blocked / At Risk</span>
                </div>
                <strong>{blockedTasksCount} ({blockPct}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--text-light)' }}></span>
                  <span>Not Started</span>
                </div>
                <strong>{notStartedTasksCount} ({nsPct}%)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Bulletin */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone size={16} className="text-gradient" />
              Latest Announcements
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--primary-accent)', fontWeight: '600' }}>Bulletin Board</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1 }}>
            {recentAnnouncements.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
                No announcements posted yet.
              </div>
            ) : (
              recentAnnouncements.map(ann => {
                const isGlobal = ann.projectId === 'global';
                return (
                  <div key={ann.id} style={{ 
                    borderBottom: '1px solid var(--border)', 
                    paddingBottom: '10px',
                    '&:last-child': { borderBottom: 'none' } 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span className={`badge ${isGlobal ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {isGlobal ? 'Global' : 'Project Spec'}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>{ann.date}</span>
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{ann.title}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ann.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Projects Title Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>My Project Workspaces</h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Showing {totalProjectsCount} projects
          </span>
        </div>

        {userProjects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <FolderKanban size={32} style={{ marginBottom: '12px', color: 'var(--text-light)' }} />
            <p style={{ fontSize: '14px' }}>You have not been assigned to any project workspaces yet.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {userProjects.map(proj => {
              const comp = getProjectCompletion(proj.id);
              const activeCount = tasks.filter(t => t.projectId === proj.id && t.status !== 'Completed').length;
              
              // Project status styling
              let statusColor = 'badge-warning';
              if (comp === 100) statusColor = 'badge-success';
              else if (comp === 0) statusColor = 'badge-neutral';

              // Project members detail mapping
              const projMembers = users.filter(u => proj.members.includes(u.id));

              return (
                <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="project-card-header">
                      <span className={`badge ${statusColor}`}>
                        {comp === 100 ? 'Completed' : comp === 0 ? 'Not Started' : 'In Progress'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>
                        ID: {proj.id.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="project-card-title">{proj.name}</h4>
                    <p className="project-card-desc">{proj.description}</p>

                    <div className="project-progress-section">
                      <div className="project-progress-labels">
                        <span>Progress</span>
                        <span>{comp}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${comp}%`, backgroundColor: 'var(--primary-accent)' }}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="project-card-metrics">
                      <div className="project-metric-item">
                        <Clock size={14} />
                        <span>{activeCount} active tasks</span>
                      </div>
                      <div className="project-metric-item" style={{ justifyContent: 'flex-end' }}>
                        {/* Member avatar group preview */}
                        <div className="avatar-group">
                          {projMembers.slice(0, 3).map(m => (
                            <div key={m.id} className="avatar" style={{ 
                              backgroundColor: m.color, 
                              color: 'white',
                              width: '24px',
                              height: '24px',
                              fontSize: '9px',
                              borderWidth: '1px'
                            }} title={m.name}>
                              {m.initials}
                            </div>
                          ))}
                          {projMembers.length > 3 && (
                            <div className="avatar" style={{ 
                              backgroundColor: '#475569', 
                              color: 'white',
                              width: '24px',
                              height: '24px',
                              fontSize: '9px',
                              borderWidth: '1px'
                            }}>
                              +{projMembers.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="project-card-footer">
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => handleOpenWorkspace(proj.id)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                      >
                        Enter Workspace
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button for mobile quick project entry */}
      {currentUser?.role === 'admin' && (
        <button className="mobile-fab" onClick={() => setIsProjectModalOpen(true)} title="Create Project">
          <Plus size={24} />
        </button>
      )}

      {/* Modals setup */}
      <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
      <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <CreateUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
    </div>
  );
}
