import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Mail, Phone, UserPlus, Filter, Shield, User } from 'lucide-react';
import CreateUserModal from '../components/CreateUserModal';

export default function UsersDirectory() {
  const { users, currentUser } = useContext(useContext(AppContext) ? AppContext : React.createContext({}));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const departments = ['Engineering', 'Product Design', 'QA Engineering', 'Operations', 'Marketing', 'Data Science'];

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchDept = deptFilter === 'all' || u.department === deptFilter;

    return matchSearch && matchRole && matchDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Actions Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Roster Directory</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage and contact TeamFlow organization members
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={16} />
            Add New Member
          </button>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search box */}
          <div style={{ position: 'relative', flexGrow: 2, minWidth: '200px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by name, email or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)'
            }} />
          </div>

          {/* Role Filter */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '130px' }}>
            <select 
              className="form-control form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ fontSize: '13px' }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="employee">Interns / Employees</option>
            </select>
          </div>

          {/* Department Filter */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '150px' }}>
            <select 
              className="form-control form-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ fontSize: '13px' }}
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Roster Grid */}
      {filteredUsers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <p>No team members match your filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '20px'
        }}>
          {filteredUsers.map(user => {
            const isAdmin = user.role === 'admin';
            
            return (
              <div key={user.id} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                border: user.id === currentUser.id ? '2px solid var(--primary-accent)' : '1px solid var(--border)'
              }}>
                <div>
                  {/* Card top bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div className="avatar" style={{ 
                      backgroundColor: user.color, 
                      color: 'white',
                      width: '42px',
                      height: '42px',
                      fontSize: '16px'
                    }}>
                      {user.initials}
                    </div>
                    <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-success'}`} style={{ gap: '4px', padding: '2px 8px', fontSize: '10px' }}>
                      {isAdmin ? <Shield size={10} /> : <User size={10} />}
                      {isAdmin ? 'Admin' : 'Intern'}
                    </span>
                  </div>

                  {/* Name and titles */}
                  <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '2px' }}>
                    {user.name} {user.id === currentUser.id && <span style={{ fontSize: '11px', color: 'var(--primary-accent)' }}>(You)</span>}
                  </h4>
                  <span className="badge badge-neutral" style={{ fontSize: '10px', marginBottom: '10px', padding: '2px 6px' }}>
                    {user.department}
                  </span>
                  
                  {/* Bio */}
                  <p style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '16px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '50px'
                  }}>
                    {user.bio}
                  </p>
                </div>

                {/* Contact details */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Mail size={13} style={{ color: 'var(--text-light)' }} />
                    <a href={`mailto:${user.email}`} style={{ color: 'var(--primary-accent)', textDecoration: 'none' }}>
                      {user.email}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Phone size={13} style={{ color: 'var(--text-light)' }} />
                    <span>{user.phone || '--'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Roster Modals */}
      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
