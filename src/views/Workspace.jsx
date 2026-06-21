import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ArrowLeft, 
  Layout, 
  CheckSquare, 
  Calendar, 
  Users, 
  Megaphone, 
  History, 
  Plus, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Mail,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import CreateTaskModal from '../components/CreateTaskModal';

export default function Workspace() {
  const { 
    currentUser, 
    projects, 
    users, 
    tasks, 
    attendance, 
    announcements, 
    activityFeed,
    getProjectCompletion,
    setCurrentView,
    activeWorkspaceId,
    updateTaskStatus,
    clockIn,
    clockOut,
    markManualAttendance,
    postAnnouncement,
    assignUserToProject,
    getTodayString
  } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));

  const [activeTab, setActiveTab] = useState('overview'); // overview, tasks, attendance, members, announcements, activity
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [assignUserId, setAssignUserId] = useState('');

  // Find the active project
  const project = projects.find(p => p.id === activeWorkspaceId);

  if (!project) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Project Workspace not found or has been deleted.</p>
        <button className="btn btn-primary" onClick={() => setCurrentView('dashboard')} style={{ marginTop: '12px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const completionRate = getProjectCompletion(project.id);
  const projectMembers = users.filter(u => project.members.includes(u.id));
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectAnnouncements = announcements.filter(a => a.projectId === project.id);
  const projectActivities = activityFeed.filter(a => a.projectId === project.id);

  // Group tasks by status for Kanban Board
  const tasksByStatus = {
    'Not Started': projectTasks.filter(t => t.status === 'Not Started'),
    'In Progress': projectTasks.filter(t => t.status === 'In Progress'),
    'Blocked': projectTasks.filter(t => t.status === 'Blocked'),
    'Completed': projectTasks.filter(t => t.status === 'Completed')
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) return;

    postAnnouncement({
      projectId: project.id,
      title: newAnnouncementTitle,
      content: newAnnouncementContent
    });

    setNewAnnouncementTitle('');
    setNewAnnouncementContent('');
    setShowAnnouncementForm(false);
  };

  const handleAssignMember = (e) => {
    e.preventDefault();
    if (!assignUserId) return;
    assignUserToProject(project.id, assignUserId);
    setAssignUserId('');
  };

  const handleGoBack = () => {
    setCurrentView('dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Back Button & Workspace Title Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '16px'
      }}>
        <button className="btn btn-secondary btn-icon" onClick={handleGoBack} style={{ borderRadius: '50%' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>
              Project Workspace
            </span>
            <span className={`badge ${completionRate === 100 ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
              {completionRate}% Complete
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, lineHeight: 1.2 }}>{project.name}</h2>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header-container">
        <div className="tabs-list">
          {[
            { id: 'overview', label: 'Overview', icon: Layout },
            { id: 'tasks', label: 'Task Board', icon: CheckSquare },
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'members', label: 'Team Members', icon: Users },
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
            { id: 'activity', label: 'Activity Feed', icon: History }
          ].map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Screen Body */}
      <div className="workspace-tab-body">
        
        {/* ======================= OVERVIEW TAB ======================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr',
              gap: '24px'
            }}>
              
              {/* Description & KPI cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card">
                  <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Project Summary</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {project.description}
                  </p>
                  
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                      <span>Workspace Progress Status</span>
                      <span>{completionRate}% Completed</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '10px' }}>
                      <div className="progress-bar-fill" style={{ width: `${completionRate}%`, backgroundColor: 'var(--primary-accent)' }}></div>
                    </div>
                  </div>
                </div>

                {/* Micro Widgets stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>{projectTasks.length}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Tasks</span>
                  </div>
                  <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--success)' }}>
                      {projectTasks.filter(t => t.status === 'Completed').length}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Completed</span>
                  </div>
                  <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--danger)' }}>
                      {projectTasks.filter(t => t.status === 'Blocked').length}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Blocked</span>
                  </div>
                </div>
              </div>

              {/* Members Checklist & Status */}
              <div className="card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '14px' }}>Workspace Members ({projectMembers.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {projectMembers.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar" style={{ backgroundColor: m.color, color: 'white', width: '32px', height: '32px', fontSize: '12px' }}>
                        {m.initials}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{m.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick tasks overview table */}
            <div className="card">
              <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Workspace Tasks Checklist</h3>
              {projectTasks.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>No tasks created yet in this workspace.</p>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Task Name</th>
                        <th>Assigned Member</th>
                        <th>Status</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectTasks.map(t => {
                        const ass = users.find(u => u.id === t.assignedTo);
                        
                        let badgeColor = 'badge-neutral';
                        if (t.status === 'Completed') badgeColor = 'badge-success';
                        else if (t.status === 'In Progress') badgeColor = 'badge-primary';
                        else if (t.status === 'Blocked') badgeColor = 'badge-danger';
                        
                        return (
                          <tr key={t.id}>
                            <td data-label="Task">{t.title}</td>
                            <td data-label="Assigned">
                              {ass ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  <div className="avatar" style={{ backgroundColor: ass.color, color: 'white', width: '22px', height: '22px', fontSize: '9px' }}>
                                    {ass.initials}
                                  </div>
                                  <span style={{ fontSize: '13px' }}>{ass.name}</span>
                                </div>
                              ) : 'Unassigned'}
                            </td>
                            <td data-label="Status">
                              <span className={`badge ${badgeColor}`}>{t.status}</span>
                            </td>
                            <td data-label="Due">{t.dueDate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TASKS TAB ======================= */}
        {activeTab === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Kanban Task Board</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Update status instantly using selector pills on task cards</p>
              </div>
              {currentUser?.role === 'admin' && (
                <button className="btn btn-primary btn-sm" onClick={() => setIsTaskModalOpen(true)}>
                  <Plus size={14} />
                  Add Task
                </button>
              )}
            </div>

            <div className="kanban-board">
              {Object.keys(tasksByStatus).map(status => {
                const columnTasks = tasksByStatus[status];
                
                let colIconColor = 'var(--text-muted)';
                if (status === 'In Progress') colIconColor = 'var(--primary-accent)';
                else if (status === 'Blocked') colIconColor = 'var(--danger)';
                else if (status === 'Completed') colIconColor = 'var(--success)';

                return (
                  <div key={status} className="kanban-column">
                    <div className="column-header">
                      <span className="column-title" style={{ color: colIconColor }}>
                        {status === 'Completed' && <CheckCircle size={14} />}
                        {status === 'In Progress' && <PlayCircle size={14} />}
                        {status === 'Blocked' && <AlertCircle size={14} />}
                        {status === 'Not Started' && <Clock size={14} />}
                        {status}
                      </span>
                      <span className="column-count">{columnTasks.length}</span>
                    </div>

                    <div className="kanban-tasks-list">
                      {columnTasks.length === 0 ? (
                        <div style={{
                          border: '2px dashed var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '16px',
                          textAlign: 'center',
                          fontSize: '11px',
                          color: 'var(--text-light)',
                          margin: 'auto 0'
                        }}>
                          Empty Column
                        </div>
                      ) : (
                        columnTasks.map(t => {
                          const ass = users.find(u => u.id === t.assignedTo);
                          const isAssignedToMe = currentUser?.id === t.assignedTo;

                          return (
                            <div key={t.id} className="task-card" style={{
                              borderLeft: isAssignedToMe ? '4px solid var(--primary-accent)' : '1px solid var(--border)'
                            }}>
                              <h4 className="task-card-title">{t.title}</h4>
                              <p className="task-card-desc">{t.description}</p>
                              
                              {/* Touch Action Switch Status Dropdown */}
                              <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                                <label style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                                  Update Status:
                                </label>
                                <select 
                                  value={t.status}
                                  onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                                  disabled={currentUser?.role !== 'admin' && !isAssignedToMe}
                                  style={{
                                    width: '100%',
                                    fontSize: '11px',
                                    padding: '4px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '4px',
                                    backgroundColor: 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    outline: 'none'
                                  }}
                                >
                                  <option value="Not Started">Not Started</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Blocked">Blocked</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>

                              <div className="task-card-footer">
                                <span className="task-date">
                                  <Calendar size={11} />
                                  {t.dueDate}
                                </span>
                                {ass && (
                                  <div className="avatar" style={{ 
                                    backgroundColor: ass.color, 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    fontSize: '9px'
                                  }} title={ass.name}>
                                    {ass.initials}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= ATTENDANCE TAB ======================= */}
        {activeTab === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Clock-In Panel (Visible to Employees check-in) */}
            {currentUser?.role !== 'admin' && (
              <div className="card" style={{
                background: 'linear-gradient(135deg, var(--primary-light) 0%, #eff6ff 100%)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="widget-icon-wrapper" style={{ backgroundColor: 'white', color: 'var(--primary-accent)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                    <Clock size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Workplace Attendance punch card</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Clock in before 09:30 AM to log your daily attendance check.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={clockIn}>
                    Clock In
                  </button>
                  <button className="btn btn-secondary" onClick={clockOut}>
                    Clock Out
                  </button>
                </div>
              </div>
            )}

            {/* Calendar list logs (Admin overrides members check-in / Intern reviews self history) */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '16px' }}>
                  {currentUser?.role === 'admin' ? 'Project Attendance Logs' : 'My Attendance History'}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  June 2026 Cohort
                </span>
              </div>

              {currentUser?.role === 'admin' ? (
                // Admin Management ledger
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Manual Marking form for admin */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    markManualAttendance(
                      fd.get('userId'),
                      fd.get('date'),
                      fd.get('status'),
                      fd.get('clockIn') || '--',
                      fd.get('clockOut') || '--'
                    );
                    e.target.reset();
                  }} style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 768 ? '2fr 2fr 1.5fr 1fr 1.5fr' : '1fr',
                    gap: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}>
                    <select name="userId" className="form-control" required style={{ fontSize: '12px' }}>
                      <option value="">Select Member</option>
                      {projectMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <input type="date" name="date" className="form-control" required style={{ fontSize: '12px' }} />
                    <select name="status" className="form-control" required style={{ fontSize: '12px' }}>
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </select>
                    <input type="text" name="clockIn" className="form-control" placeholder="In (e.g. 09:00 AM)" style={{ fontSize: '12px' }} />
                    <button type="submit" className="btn btn-primary btn-sm" style={{ height: '36px' }}>
                      Override Log
                    </button>
                  </form>

                  {/* Log list */}
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Team Member</th>
                          <th>Status</th>
                          <th>Clock In</th>
                          <th>Clock Out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance
                          .filter(a => project.members.includes(a.userId))
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map(log => {
                            const u = users.find(user => user.id === log.userId);
                            let statusBadge = 'badge-neutral';
                            if (log.status === 'Present') statusBadge = 'badge-success';
                            else if (log.status === 'Late') statusBadge = 'badge-warning';
                            else if (log.status === 'Absent') statusBadge = 'badge-danger';

                            return (
                              <tr key={log.id}>
                                <td data-label="Date">{log.date}</td>
                                <td data-label="Member">
                                  {u ? (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                      <div className="avatar" style={{ backgroundColor: u.color, color: 'white', width: '22px', height: '22px', fontSize: '9px' }}>
                                        {u.initials}
                                      </div>
                                      <span style={{ fontSize: '13px' }}>{u.name}</span>
                                    </div>
                                  ) : 'Unknown'}
                                </td>
                                <td data-label="Status">
                                  <span className={`badge ${statusBadge}`}>{log.status}</span>
                                </td>
                                <td data-label="Clock In">{log.clockIn}</td>
                                <td data-label="Clock Out">{log.clockOut}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Intern personal list
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance
                        .filter(a => a.userId === currentUser.id)
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map(log => {
                          let statusBadge = 'badge-neutral';
                          if (log.status === 'Present') statusBadge = 'badge-success';
                          else if (log.status === 'Late') statusBadge = 'badge-warning';
                          else if (log.status === 'Absent') statusBadge = 'badge-danger';

                          return (
                            <tr key={log.id}>
                              <td data-label="Date">{log.date}</td>
                              <td data-label="Status">
                                <span className={`badge ${statusBadge}`}>{log.status}</span>
                              </td>
                              <td data-label="Clock In">{log.clockIn}</td>
                              <td data-label="Clock Out">{log.clockOut}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= MEMBERS TAB ======================= */}
        {activeTab === 'members' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {currentUser?.role === 'admin' && (
              <div className="card" style={{ padding: '16px' }}>
                <form onSubmit={handleAssignMember} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flexGrow: 1, minWidth: '200px' }}>
                    <select 
                      className="form-control form-select"
                      value={assignUserId}
                      onChange={(e) => setAssignUserId(e.target.value)}
                      style={{ fontSize: '13px' }}
                      required
                    >
                      <option value="">Assign new employee to workspace...</option>
                      {users
                        .filter(u => u.role === 'employee' && !project.members.includes(u.id))
                        .map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                        ))
                      }
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ height: '40px' }}>
                    Assign Member
                  </button>
                </form>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {projectMembers.map(m => (
                <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <div className="avatar" style={{ backgroundColor: m.color, color: 'white', width: '38px', height: '38px', fontSize: '14px' }}>
                        {m.initials}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{m.name}</h4>
                        <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '1px 5px' }}>
                          {m.department}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4', height: '34px', overflow: 'hidden' }}>
                      {m.bio}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: '600' }}>Email:</span>
                      <a href={`mailto:${m.email}`} style={{ color: 'var(--primary-accent)' }}>{m.email}</a>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: '600' }}>Phone:</span>
                      <span>{m.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= ANNOUNCEMENTS TAB ======================= */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Create Announcement Block (Admin only) */}
            {currentUser?.role === 'admin' && (
              <div className="card">
                {!showAnnouncementForm ? (
                  <button className="btn btn-primary" onClick={() => setShowAnnouncementForm(true)} style={{ gap: '8px' }}>
                    <Megaphone size={16} />
                    Post New Announcement
                  </button>
                ) : (
                  <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700' }}>New Project Broadcast Notice</h4>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAnnouncementForm(false)}>
                        Cancel
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject Title *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Design checklist frozen"
                        value={newAnnouncementTitle}
                        onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Broadcast Content Details *</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Type the notice details..."
                        value={newAnnouncementContent}
                        onChange={(e) => setNewAnnouncementContent(e.target.value)}
                        rows="3"
                        required
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-primary">
                        Post Announcement
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* List of project announcements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projectAnnouncements.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  <p>No project-specific announcements posted yet.</p>
                </div>
              ) : (
                projectAnnouncements.map(ann => {
                  const poster = users.find(u => u.id === ann.postedBy);
                  return (
                    <div key={ann.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{ann.title}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{ann.date}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {ann.content}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-light)', borderTop: '1px solid var(--bg-tertiary)', paddingTop: '8px' }}>
                        <span>Broadcasted by:</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                          {poster ? poster.name : 'Unknown Admin'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================= ACTIVITY TAB ======================= */}
        {activeTab === 'activity' && (
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Workspace Event Timeline</h3>
            
            {projectActivities.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                No events recorded in this project workspace yet.
              </p>
            ) : (
              <div className="timeline">
                {projectActivities.map(act => (
                  <div key={act.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                          {act.userName}
                        </span>
                        <span className="timeline-time">{act.timestamp}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {act.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Creation Modal setup */}
      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        targetProjectId={project.id} 
      />
    </div>
  );
}
