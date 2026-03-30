import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Package, Users, CheckCircle, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getAllItems()])
      .then(([statsRes, itemsRes]) => {
        setStats(statsRes.data);
        setRecentItems(itemsRes.data.slice(0, 5));
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Items', value: stats.totalItems, icon: Package, color: 'blue', bg: 'rgba(79,142,247,0.15)', iconColor: 'var(--accent-primary)' },
    { label: 'Lost Items', value: stats.lostItems, icon: AlertCircle, color: 'red', bg: 'rgba(239,68,68,0.15)', iconColor: '#ef4444' },
    { label: 'Found Items', value: stats.foundItems, icon: TrendingUp, color: 'green', bg: 'rgba(16,185,129,0.15)', iconColor: '#10b981' },
    { label: 'Active Items', value: stats.activeItems, icon: Clock, color: 'teal', bg: 'rgba(6,182,212,0.15)', iconColor: 'var(--accent-teal)' },
    { label: 'Claimed', value: stats.claimedItems, icon: CheckCircle, color: 'orange', bg: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'purple', bg: 'rgba(124,58,237,0.15)', iconColor: '#a78bfa' },
  ] : [];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 14px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 100,
            fontSize: 12, color: '#a78bfa',
            marginBottom: 12, fontWeight: 600,
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            ⚡ Admin Panel
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, marginBottom: 4 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor and manage all lost & found activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid-3" style={{ marginBottom: 36 }}>
          {loading ? (
            [1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--radius-lg)' }} />)
          ) : (
            statCards.map((s, i) => (
              <div key={s.label} className={`stat-card ${s.color}`} style={{ animation: `fadeIn 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="stat-number">{s.value}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
                  </div>
                  <div style={{
                    width: 44, height: 44,
                    background: s.bg,
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <s.icon size={20} color={s.iconColor} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Recent Activity</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 'var(--radius-md)' }} />)}
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Reported By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 14 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.location}
                        </div>
                      </td>
                      <td><span className={`badge badge-${item.type?.toLowerCase()}`}>{item.type}</span></td>
                      <td style={{ fontSize: 13 }}>{item.category?.charAt(0) + item.category?.slice(1).toLowerCase()}</td>
                      <td style={{ fontSize: 13 }}>{item.reportedByName || '—'}</td>
                      <td><span className={`badge badge-${item.status?.toLowerCase()}`}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick action cards */}
        <div className="grid-2" style={{ marginTop: 32 }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(124,58,237,0.1))',
            borderColor: 'rgba(79,142,247,0.25)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>📦 Manage Items</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
              Review, approve, and update the status of all reported items.
            </p>
            <a href="/admin/items" className="btn btn-secondary" style={{ fontSize: 13 }}>Go to Items →</a>
          </div>
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))',
            borderColor: 'rgba(124,58,237,0.25)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>👥 Manage Users</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
              View all registered students and manage their account status.
            </p>
            <a href="/admin/users" className="btn btn-secondary" style={{ fontSize: 13 }}>Go to Users →</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
