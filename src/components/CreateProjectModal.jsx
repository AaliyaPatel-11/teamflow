import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Check } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose }) {
  const { users, addProject } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!isOpen) return null;

  const employees = users.filter(u => u.role === 'employee');

  const handleToggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name,
      description,
      members: selectedMembers
    });

    // Reset state
    setName('');
    setDescription('');
    setSelectedMembers([]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Project Workspace</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input 
                type="text" 
                className="form-control" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gamma Database Sync" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the goals of this workspace..." 
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Assign Team Members</label>
              <div style={{
                maxHeight: '160px',
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {employees.map(u => {
                  const isChecked = selectedMembers.includes(u.id);
                  return (
                    <label key={u.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '4px 0'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleToggleMember(u.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <div className="avatar" style={{ 
                        backgroundColor: u.color, 
                        color: 'white', 
                        width: '26px', 
                        height: '26px', 
                        fontSize: '10px' 
                      }}>
                        {u.initials}
                      </div>
                      <span>{u.name} ({u.department})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
