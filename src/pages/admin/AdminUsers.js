import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { adminAPI } from '../../services/api';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => {
    if (search) setFiltered(users.filter(u =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId?.toLowerCase().includes(search.toLowerCase())
    ));
    else setFiltered(users);
  }, [users, search]);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const toggleUser = async (id) => {
    try {
      await adminAPI.toggleUser(id);
      toast.success('User status updated');
      fetchUsers();
    } catch { toast.error('Failed to update user'); }
  };

  const admins = users.filter(u => u.role === 'ADMIN').length;
  const active = users.filter(u => u.isActive).length;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, marginBottom: 4 }}>Manage Users</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and manage all registered students</p>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { label: 'Total Users', value: users.length, color: 'blue', emoji: '👥' },
            { label: 'Active', value: active, color: 'green', emoji: '✅' },
            { label: 'Inactive', value: users.length - active, color: 'red', emoji: '⛔' },
            { label: 'Admins', value: admins, color: 'purple', emoji: '⚡' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</div>
              <div className="stat-number">{loading ? '—' : s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-field" placeholder="Search by name, email, or student ID..."
            value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Student ID</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Reports</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, flexShrink: 0,
                          background: user.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #7c3aed, #4f8ef7)'
                            : 'linear-gradient(135deg, #4f8ef7, #06b6d4)',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700, color: 'white',
                        }}>
                          {user.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 14 }}>{user.fullName}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{user.studentId || '—'}</td>
                    <td style={{ fontSize: 13 }}>{user.phoneNumber || '—'}</td>
                    <td>
                      {user.role === 'ADMIN' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>
                          <Shield size={12} /> Admin
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Student</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, textAlign: 'center' }}>{user.itemsReported}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 100,
                        fontSize: 11, fontWeight: 600,
                        background: user.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: user.isActive ? '#10b981' : '#ef4444',
                        border: `1px solid ${user.isActive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleUser(user.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                            fontSize: 12, fontWeight: 500, border: 'none',
                            background: user.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                            color: user.isActive ? '#ef4444' : '#10b981',
                          }}
                        >
                          {user.isActive ? <><UserX size={13} /> Disable</> : <><UserCheck size={13} /> Enable</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>No users found</p></div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
