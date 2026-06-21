import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialUsers = [
  { id: 'u-1', name: 'Jane Doe', role: 'admin', email: 'jane.doe@teamflow.com', avatar: 'JD', initials: 'JD', color: '#1e40af', department: 'Operations', phone: '+1 (555) 019-2834', bio: 'Operations head and internship program director.' },
  { id: 'u-2', name: 'Alex Rivera', role: 'employee', email: 'alex.rivera@teamflow.com', avatar: 'AR', initials: 'AR', color: '#3b82f6', department: 'Engineering', phone: '+1 (555) 014-3829', bio: 'Full-stack software engineering intern focusing on mobile apps.' },
  { id: 'u-3', name: 'Maya Chen', role: 'employee', email: 'maya.chen@teamflow.com', avatar: 'MC', initials: 'MC', color: '#10b981', department: 'Product Design', phone: '+1 (555) 018-9271', bio: 'UI/UX design lead. Loves building responsive interfaces.' },
  { id: 'u-4', name: 'Liam Johnson', role: 'employee', email: 'liam.johnson@teamflow.com', avatar: 'LJ', initials: 'LJ', color: '#8b5cf6', department: 'Engineering', phone: '+1 (555) 012-7384', bio: 'Backend developer focused on API engineering and caching.' },
  { id: 'u-5', name: 'Sarah Taylor', role: 'employee', email: 'sarah.taylor@teamflow.com', avatar: 'ST', initials: 'ST', color: '#ec4899', department: 'Marketing', phone: '+1 (555) 016-8392', bio: 'Growth marketer helping scale organic traffic for our new releases.' },
  { id: 'u-6', name: 'James Smith', role: 'employee', email: 'james.smith@teamflow.com', avatar: 'JS', initials: 'JS', color: '#f59e0b', department: 'Engineering', phone: '+1 (555) 011-8273', bio: 'Frontend engineer specializing in CSS and layouts.' },
  { id: 'u-7', name: 'Emily Brown', role: 'employee', email: 'emily.brown@teamflow.com', avatar: 'EB', initials: 'EB', color: '#06b6d4', department: 'QA Engineering', phone: '+1 (555) 013-8271', bio: 'Quality assurance analyst testing PWA performance and offline functionality.' },
  { id: 'u-8', name: 'David Wilson', role: 'employee', email: 'david.wilson@teamflow.com', avatar: 'DW', initials: 'DW', color: '#14b8a6', department: 'Data Science', phone: '+1 (555) 015-9273', bio: 'Data analyst working on reporting widgets and SVG charts.' }
];

const initialProjects = [
  { id: 'p-1', name: 'Alpha Onboarding Portal', description: 'Design and develop a custom onboarding experience for incoming interns and contractors.', status: 'Active', members: ['u-2', 'u-3', 'u-4'] },
  { id: 'p-2', name: 'Beta Mobile App v2', description: 'Re-platforming our mobile check-in app with modern offline caching and storage capabilities.', status: 'Active', members: ['u-2', 'u-5', 'u-6'] },
  { id: 'p-3', name: 'Delta Analytics Dashboard', description: 'Integrating multi-client reporting metrics into our central operations SaaS platform.', status: 'Not Started', members: ['u-7', 'u-8'] }
];

const initialTasks = [
  { id: 't-1', projectId: 'p-1', title: 'Finalize Wireframes', description: 'Design the responsive dashboard layouts and mobile user flow mockups.', assignedTo: 'u-3', status: 'Completed', dueDate: '2026-06-15' },
  { id: 't-2', projectId: 'p-1', title: 'Setup API Integration', description: 'Implement login and user profile retrieval mock endpoints.', assignedTo: 'u-2', status: 'In Progress', dueDate: '2026-06-25' },
  { id: 't-3', projectId: 'p-1', title: 'Test Service Workers', description: 'Verify offline capabilities and asset storage in browser environments.', assignedTo: 'u-4', status: 'Blocked', dueDate: '2026-06-22' },
  { id: 't-4', projectId: 'p-1', title: 'Write Setup Documentation', description: 'Write code documentation for workspace and developer onboarding.', assignedTo: 'u-3', status: 'Not Started', dueDate: '2026-06-30' },
  { id: 't-5', projectId: 'p-2', title: 'Configure IndexedDB Store', description: 'Setup local databases for mobile state synchronization.', assignedTo: 'u-2', status: 'In Progress', dueDate: '2026-06-28' },
  { id: 't-6', projectId: 'p-2', title: 'Push Notification Setup', description: 'Integrate browser notifications for attendance clock-ins.', assignedTo: 'u-6', status: 'Blocked', dueDate: '2026-06-24' },
  { id: 't-7', projectId: 'p-2', title: 'Profile Settings Layout', description: 'Design the edit profile form and input validation state.', assignedTo: 'u-5', status: 'Not Started', dueDate: '2026-07-02' },
  { id: 't-8', projectId: 'p-2', title: 'Generate Base Assets', description: 'Create responsive SVG illustrations and branding elements.', assignedTo: 'u-5', status: 'Completed', dueDate: '2026-06-12' },
  { id: 't-9', projectId: 'p-3', title: 'Database Schema Draft', description: 'Outline relational tables and fields for operational metrics.', assignedTo: 'u-8', status: 'Not Started', dueDate: '2026-07-05' },
  { id: 't-10', projectId: 'p-3', title: 'Analytics SVG Prototypes', description: 'Create clean, pure-SVG interactive visual representations.', assignedTo: 'u-7', status: 'Not Started', dueDate: '2026-07-10' }
];

const initialAnnouncements = [
  { id: 'a-1', projectId: 'p-1', title: 'Sprint Planning Meeting', content: 'Sprint planning will take place at 10 AM via our conference room link. Please review your task boards before joining.', date: '2026-06-19', postedBy: 'u-1' },
  { id: 'a-2', projectId: 'global', title: 'Welcome Summer Cohort!', content: 'Welcome to the summer onboarding program! Explore your workspace, sync your tasks, and remember to clock in every morning.', date: '2026-06-15', postedBy: 'u-1' },
  { id: 'a-3', projectId: 'p-2', title: 'Branding Guidelines Freeze', content: 'Design guidelines for v2 are finalized. All CSS rules should strictly follow the color palettes in index.css.', date: '2026-06-18', postedBy: 'u-1' }
];

const generateInitialAttendance = () => {
  const attendance = [];
  const dates = ['2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19'];
  
  initialUsers.forEach(u => {
    if (u.role === 'admin') return;
    
    dates.forEach(d => {
      // Randomly assign present (80%), late (15%), or absent (5%)
      const rand = Math.random();
      let status = 'Present';
      let clockIn = '09:00 AM';
      let clockOut = '05:00 PM';
      
      if (rand > 0.95) {
        status = 'Absent';
        clockIn = '--';
        clockOut = '--';
      } else if (rand > 0.8) {
        status = 'Late';
        clockIn = '09:45 AM';
      }
      
      attendance.push({
        id: `att-${u.id}-${d}`,
        userId: u.id,
        date: d,
        status,
        clockIn,
        clockOut
      });
    });
  });
  
  return attendance;
};

const initialActivity = [
  { id: 'ac-1', projectId: 'p-1', userId: 'u-1', userName: 'Jane Doe', type: 'project_created', message: 'created the Project Workspace.', timestamp: '2026-06-15 09:00 AM' },
  { id: 'ac-2', projectId: 'p-1', userId: 'u-3', userName: 'Maya Chen', type: 'task_status_change', message: 'completed task "Finalize Wireframes".', timestamp: '2026-06-16 02:30 PM' },
  { id: 'ac-3', projectId: 'p-1', userId: 'u-1', userName: 'Jane Doe', type: 'announcement', message: 'posted announcement "Sprint Planning Meeting".', timestamp: '2026-06-19 09:15 AM' },
  { id: 'ac-4', projectId: 'p-2', userId: 'u-5', userName: 'Sarah Taylor', type: 'task_status_change', message: 'completed task "Generate Base Assets".', timestamp: '2026-06-18 11:00 AM' },
  { id: 'ac-5', projectId: 'p-2', userId: 'u-2', userName: 'Alex Rivera', type: 'task_status_change', message: 'moved task "Configure IndexedDB Store" to In Progress.', timestamp: '2026-06-19 04:00 PM' }
];

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('tf_users');
    return local ? JSON.parse(local) : initialUsers;
  });

  const [projects, setProjects] = useState(() => {
    const local = localStorage.getItem('tf_projects');
    return local ? JSON.parse(local) : initialProjects;
  });

  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem('tf_tasks');
    return local ? JSON.parse(local) : initialTasks;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const local = localStorage.getItem('tf_announcements');
    return local ? JSON.parse(local) : initialAnnouncements;
  });

  const [attendance, setAttendance] = useState(() => {
    const local = localStorage.getItem('tf_attendance');
    return local ? JSON.parse(local) : generateInitialAttendance();
  });

  const [activityFeed, setActivityFeed] = useState(() => {
    const local = localStorage.getItem('tf_activity');
    return local ? JSON.parse(local) : initialActivity;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const local = localStorage.getItem('tf_current_user');
    return local ? JSON.parse(local) : initialUsers[0]; // Jane Doe by default
  });

  const [currentView, setCurrentView] = useState(() => {
    const local = localStorage.getItem('tf_current_view');
    return local ? local : 'dashboard';
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    const local = localStorage.getItem('tf_active_workspace_id');
    return local ? local : 'p-1';
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New task assigned in Alpha Portal', read: false },
    { id: 2, text: 'Admin Jane Doe posted a sprint update', read: false }
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('tf_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tf_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tf_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('tf_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('tf_activity', JSON.stringify(activityFeed));
  }, [activityFeed]);

  useEffect(() => {
    localStorage.setItem('tf_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tf_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('tf_active_workspace_id', activeWorkspaceId);
  }, [activeWorkspaceId]);

  // Get date helper
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Activity logger helper
  const logActivity = (projectId, userId, type, message) => {
    const user = users.find(u => u.id === userId);
    const newLog = {
      id: `ac-${Date.now()}`,
      projectId,
      userId,
      userName: user ? user.name : 'Unknown User',
      type,
      message,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivityFeed(prev => [newLog, ...prev]);
  };

  // 1. User Actions
  const switchUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      // Clean up view states
      setCurrentView('dashboard');
    }
  };

  const addUser = (userData) => {
    const newId = `u-${users.length + 1}`;
    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Pick avatar color based on name hash
    const colors = ['#1e40af', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#14b8a6'];
    const charCodeSum = userData.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const color = colors[charCodeSum % colors.length];

    const newUser = {
      id: newId,
      ...userData,
      initials,
      color,
      avatar: initials
    };

    setUsers(prev => [...prev, newUser]);
    logActivity('global', currentUser.id, 'user_added', `added user "${newUser.name}" to TeamFlow.`);
    return newUser;
  };

  const updateProfile = (profileData) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...profileData } : u));
    setCurrentUser(prev => ({ ...prev, ...profileData }));
    logActivity('global', currentUser.id, 'profile_updated', `updated their profile settings.`);
  };

  // 2. Project Actions
  const addProject = (projectData) => {
    const newId = `p-${projects.length + 1}`;
    const newProject = {
      id: newId,
      name: projectData.name,
      description: projectData.description,
      status: 'Active',
      members: projectData.members || []
    };
    setProjects(prev => [...prev, newProject]);
    logActivity(newId, currentUser.id, 'project_created', `created the Project Workspace "${newProject.name}".`);
    return newProject;
  };

  const assignUserToProject = (projectId, userId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const alreadyMember = p.members.includes(userId);
        const updatedMembers = alreadyMember ? p.members : [...p.members, userId];
        return { ...p, members: updatedMembers };
      }
      return p;
    }));
    logActivity(projectId, currentUser.id, 'project_member_added', `assigned user to project workspace.`);
  };

  // Calculate Project Completion Rate Based on Task Completion
  const getProjectCompletion = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(t => t.status === 'Completed');
    return Math.round((completedTasks.length / projectTasks.length) * 100);
  };

  // 3. Task Actions
  const addTask = (taskData) => {
    const newId = `t-${tasks.length + 1}`;
    const newTask = {
      id: newId,
      projectId: taskData.projectId || activeWorkspaceId,
      title: taskData.title,
      description: taskData.description,
      assignedTo: taskData.assignedTo,
      status: 'Not Started',
      dueDate: taskData.dueDate || getTodayString()
    };
    setTasks(prev => [...prev, newTask]);
    logActivity(newTask.projectId, currentUser.id, 'task_created', `created task "${newTask.title}".`);
    return newTask;
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const oldStatus = t.status;
        if (oldStatus !== newStatus) {
          logActivity(t.projectId, currentUser.id, 'task_status_change', `moved task "${t.title}" from ${oldStatus} to ${newStatus}.`);
        }
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  // 4. Attendance Actions
  const clockIn = () => {
    const today = getTodayString();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if record exists
    const existingIndex = attendance.findIndex(a => a.userId === currentUser.id && a.date === today);
    
    // Standard rule: after 09:30 AM is late
    const now = new Date();
    const checkHour = now.getHours();
    const checkMin = now.getMinutes();
    let status = 'Present';
    if (checkHour > 9 || (checkHour === 9 && checkMin > 30)) {
      status = 'Late';
    }

    if (existingIndex > -1) {
      // update it
      setAttendance(prev => prev.map((a, idx) => idx === existingIndex ? { ...a, clockIn: time, status } : a));
    } else {
      // create it
      const newRecord = {
        id: `att-${currentUser.id}-${today}`,
        userId: currentUser.id,
        date: today,
        status,
        clockIn: time,
        clockOut: '--'
      };
      setAttendance(prev => [...prev, newRecord]);
    }
    logActivity('global', currentUser.id, 'attendance', `clocked in at ${time} (${status}).`);
  };

  const clockOut = () => {
    const today = getTodayString();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const existingIndex = attendance.findIndex(a => a.userId === currentUser.id && a.date === today);
    if (existingIndex > -1) {
      setAttendance(prev => prev.map((a, idx) => idx === existingIndex ? { ...a, clockOut: time } : a));
      logActivity('global', currentUser.id, 'attendance', `clocked out at ${time}.`);
    }
  };

  const markManualAttendance = (userId, date, status, clockIn, clockOut) => {
    const existingIndex = attendance.findIndex(a => a.userId === userId && a.date === date);
    
    if (existingIndex > -1) {
      setAttendance(prev => prev.map((a, idx) => idx === existingIndex ? { ...a, status, clockIn, clockOut } : a));
    } else {
      const newRecord = {
        id: `att-${userId}-${date}`,
        userId,
        date,
        status,
        clockIn,
        clockOut
      };
      setAttendance(prev => [...prev, newRecord]);
    }
    logActivity('global', currentUser.id, 'attendance_override', `marked attendance for user ${userId} on ${date} as ${status}.`);
  };

  // 5. Announcements Actions
  const postAnnouncement = (announcementData) => {
    const newId = `a-${announcements.length + 1}`;
    const newAnnouncement = {
      id: newId,
      projectId: announcementData.projectId || 'global',
      title: announcementData.title,
      content: announcementData.content,
      date: getTodayString(),
      postedBy: currentUser.id
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    logActivity(newAnnouncement.projectId, currentUser.id, 'announcement', `posted announcement "${newAnnouncement.title}".`);
    return newAnnouncement;
  };

  // Notification clear helper
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      users,
      projects,
      tasks,
      announcements,
      attendance,
      activityFeed,
      currentUser,
      currentView,
      activeWorkspaceId,
      notifications,
      getProjectCompletion,
      setCurrentView,
      setActiveWorkspaceId,
      switchUser,
      addUser,
      updateProfile,
      addProject,
      assignUserToProject,
      addTask,
      updateTaskStatus,
      clockIn,
      clockOut,
      markManualAttendance,
      postAnnouncement,
      clearNotifications,
      getTodayString
    }}>
      {children}
    </AppContext.Provider>
  );
};
