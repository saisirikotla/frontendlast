import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnuragLogo from '../assets/AnuragLogo';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      const { token, email, fullName, role, userId } = res.data;
      login({ email, fullName, role, userId }, token);
      toast.success(`Welcome back, ${fullName}!`);
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      let msg = 'Login failed. Please try again.';
      if (!err.response) msg = 'Cannot connect to server. Make sure the backend is accessible.';
      else if (err.response.status === 400 || err.response.status === 401) msg = 'Invalid email or password.';
      else if (typeof err.response.data === 'string') msg = err.response.data;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    setError('');
    if (type === 'admin') setForm({ email: 'admin@campus.edu', password: 'admin123' });
    else setForm({ email: 'student@campus.edu', password: 'student123' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--gradient-hero)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              background: 'white',
              borderRadius: 14,
              padding: '12px 24px',
              display: 'inline-flex',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              marginBottom: 16,
            }}>
              <AnuragLogo height={40} />
            </div>
          </Link>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px',
            background: 'rgba(139,26,26,0.12)',
            border: '1px solid rgba(139,26,26,0.25)',
            borderRadius: 100,
            fontSize: 12, color: '#e07070',
            fontWeight: 500, marginBottom: 14,
          }}>
            📍 Lost &amp; Found Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--text-primary)', marginBottom: 4 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sign in with your AU student account</p>
        </div>

        <div className="card" style={{ padding: 30 }}>
          {/* Demo buttons */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 9, textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Quick Demo Access</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => fillDemo('admin')} className="btn btn-ghost" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>⚡ Admin Demo</button>
              <button onClick={() => fillDemo('user')} className="btn btn-ghost" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>🎓 Student Demo</button>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-subtle)', marginBottom: 20, position: 'relative', height: 1 }}>
            <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', padding: '0 12px', fontSize: 11, color: 'var(--text-muted)' }}>or sign in manually</span>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 13px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 13, color: '#ef4444' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" required className="input-field" placeholder="you@anurag.edu.in" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} required className="input-field" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4, background: 'linear-gradient(135deg, #c0392b, #8B1A1A)', color: 'white', boxShadow: '0 4px 15px rgba(139,26,26,0.3)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#e07070', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
          </p>
        </div>

        <div style={{ marginTop: 14, padding: '9px 14px', background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.18)', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>
          💡 Make sure the Spring Boot backend is <strong style={{ color: 'var(--accent-primary)' }}>live</strong>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
