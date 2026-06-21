import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';

export default function CreateUserModal({ isOpen, onClose }) {
  const { addUser } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('Engineering');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      email,
      role,
      department,
      phone: phone || '--',
      bio: bio || 'No biography written yet.'
    });

    // Reset state
    setName('');
    setEmail('');
    setRole('employee');
    setDepartment('Engineering');
    setPhone('');
    setBio('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Member</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Smith" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. liam.smith@teamflow.com" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role *</label>
              <select 
                className="form-control form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="employee">Intern / Employee</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select 
                className="form-control form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="Engineering">Engineering</option>
                <option value="Product Design">Product Design</option>
                <option value="QA Engineering">QA Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 012-3456" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Biography</label>
              <textarea 
                className="form-control" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about this team member..." 
                rows="2"
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
