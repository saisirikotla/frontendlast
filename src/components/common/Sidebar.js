import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Search, PlusCircle, Package, LogOut,
  Users, Menu, X
} from 'lucide-react';
import AnuragLogo from '../../assets/AnuragLogo';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/browse', icon: Search, label: 'Browse Items' },
    { to: '/report', icon: PlusCircle, label: 'Report Item' },
    { to: '/my-items', icon: Package, label: 'My Reports' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/items', icon: Package, label: 'Manage Items' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
  ];

  const links = isAdmin() ? adminLinks : userLinks;

  return (
    <>
      <div style={{
        width: 260,
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-card)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0,
        zIndex: 100,
        overflowY: 'auto',
      }}>
        {/* Anurag University Logo Header */}
        <div style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'linear-gradient(135deg, rgba(139,26,26,0.08), rgba(139,26,26,0.03))',
        }}>
          {/* Logo */}
          <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'white',
              borderRadius: 10,
              padding: '8px 12px',
              display: 'inline-flex',
              alignItems: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}>
              <AnuragLogo height={34} />
            </div>
          </div>
          {/* App name pill */}
          <div style={{
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: '#c0392b',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '4px 0',
            background: 'rgba(139,26,26,0.1)',
            borderRadius: 20,
            border: '1px solid rgba(139,26,26,0.2)',
          }}>
            📍 Lost &amp; Found Portal
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card)',
          }}>
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              background: isAdmin()
                ? 'linear-gradient(135deg, #8B1A1A, #c0392b)'
                : 'var(--gradient-primary)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white',
            }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.7px',
                color: isAdmin() ? '#e74c3c' : 'var(--accent-primary)',
                textTransform: 'uppercase',
              }}>
                {isAdmin() ? '⚡ Admin' : '🎓 AU Student'}
              </div>
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div style={{ padding: '4px 20px 8px', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>
          Navigation
        </div>

        {/* Nav links */}
        <nav style={{ padding: '0 10px', flex: 1 }}>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/dashboard'}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(79, 142, 247, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(79,142,247,0.2)' : '1px solid transparent',
                transition: 'var(--transition)',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '14px 10px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleLogout}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
