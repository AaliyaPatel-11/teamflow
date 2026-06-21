import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';

export default function CreateTaskModal({ isOpen, onClose, targetProjectId }) {
  const { projects, users, addTask, activeWorkspaceId } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));
  
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Sync selected project ID
  useEffect(() => {
    if (isOpen) {
      const activeProj = targetProjectId || activeWorkspaceId || (projects.length > 0 ? projects[0].id : '');
      setProjectId(activeProj);
    }
  }, [isOpen, targetProjectId, activeWorkspaceId, projects]);

  if (!isOpen) return null;

  // Determine members of the selected project
  const selectedProject = projects.find(p => p.id === projectId);
  const projectMembers = selectedProject 
    ? users.filter(u => selectedProject.members.includes(u.id))
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    addTask({
      projectId,
      title,
      description,
      assignedTo: assignedTo || (projectMembers.length > 0 ? projectMembers[0].id : ''),
      dueDate
    });

    // Reset state
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {!targetProjectId && (
              <div className="form-group">
                <label className="form-label">Project Workspace *</label>
                <select 
                  className="form-control form-select"
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    setAssignedTo(''); // Reset assignee
                  }}
                  required
                >
                  <option value="" disabled>Select a project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input 
                type="text" 
                className="form-control" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement routing guards" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify task deliverables, subtasks, or requirements..." 
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select 
                className="form-control form-select"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select team member</option>
                {projectMembers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
