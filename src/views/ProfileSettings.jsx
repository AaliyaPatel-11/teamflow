import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Save, User, Shield, Briefcase, Mail, Phone, FileText } from 'lucide-react';

export default function ProfileSettings() {
  const { currentUser, updateProfile } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if currentUser switches
  React.useEffect(() => {
    setName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
    setPhone(currentUser?.phone || '');
    setBio(currentUser?.bio || '');
    setSavedSuccess(false);
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    updateProfile({
      name,
      email,
      phone,
      bio
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: '700' }}>My Profile</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Update your public contact info, avatar and biography details
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          backgroundColor: 'var(--success-light)',
          color: 'var(--success)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--success)',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span> Profile settings updated successfully! Changes synchronized with localStorage.
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Cover image area */}
        <div className="profile-cover"></div>

        {/* Profile Avatar & Primary Info */}
        <div className="profile-avatar-container">
          <div className="profile-avatar-large" style={{ 
            backgroundColor: currentUser?.color || '#3b82f6', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '700'
          }}>
            {currentUser?.initials}
          </div>
          <div className="profile-info-header">
            <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '2px' }}>
              {currentUser?.name}
            </h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className={`badge ${currentUser?.role === 'admin' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                {currentUser?.role === 'admin' ? 'Administrator' : 'Intern'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{currentUser?.department}</span>
            </div>
          </div>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 576 ? '1fr 1fr' : '1fr',
            gap: '18px',
            marginBottom: '18px'
          }}>
            <div className="form-group">
              <label className="form-label">
                <User size={12} style={{ marginRight: '6px', color: 'var(--text-light)' }} />
                Full Name
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={12} style={{ marginRight: '6px', color: 'var(--text-light)' }} />
                Email Address
              </label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 576 ? '1fr 1fr' : '1fr',
            gap: '18px',
            marginBottom: '18px'
          }}>
            <div className="form-group">
              <label className="form-label">
                <Phone size={12} style={{ marginRight: '6px', color: 'var(--text-light)' }} />
                Contact Phone
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="e.g. +1 (555) 012-3456" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Briefcase size={12} style={{ marginRight: '6px', color: 'var(--text-light)' }} />
                Department (Read Only)
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={currentUser?.department} 
                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }} 
                disabled 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">
              <FileText size={12} style={{ marginRight: '6px', color: 'var(--text-light)' }} />
              Biography / Professional Summary
            </label>
            <textarea 
              className="form-control" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              rows="4"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
            <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
              <Save size={16} />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
