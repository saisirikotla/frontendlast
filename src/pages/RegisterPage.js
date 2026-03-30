import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnuragLogo from '../assets/AnuragLogo';

const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '', studentId: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register(form);
      const { token, email, fullName, role, userId } = res.data;
      login({ email, fullName, role, userId }, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      let msg = 'Registration failed. Please try again.';
      if (!err.response) msg = 'Cannot connect to server. Make sure the backend is running on port 8080.';
      else if (typeof err.response.data === 'string') msg = err.response.data;
      else if (err.response.data?.message) msg = err.response.data.message;
      else if (err.response.status === 400) msg = 'Invalid input. Please check your details.';
      else if (err.response.status === 409) msg = 'Email already registered. Please login instead.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--gradient-hero)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{
              background: 'white', borderRadius: 14, padding: '10px 22px',
              display: 'inline-flex', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', marginBottom: 14,
            }}>
              <AnuragLogo height={38} />
            </div>
          </Link>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
            background: 'rgba(139,26,26,0.12)', border: '1px solid rgba(139,26,26,0.25)',
            borderRadius: 100, fontSize: 12, color: '#e07070', fontWeight: 500, marginBottom: 12,
          }}>
            📍 Lost &amp; Found Portal
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, marginBottom: 4 }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Register as an Anurag University student</p>
        </div>

        <div className="card" style={{ padding: 30 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 13px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 13, color: '#ef4444' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" required className="input-field" placeholder="e.g. Arjun Sharma" value={form.fullName} onChange={set('fullName')} />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" required className="input-field" placeholder="rollno@anurag.edu.in" value={form.email} onChange={set('email')} />
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Student ID / Roll No.</label>
                <input type="text" className="input-field" placeholder="e.g. CS21001" value={form.studentId} onChange={set('studentId')} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Phone Number</label>
                <input type="tel" className="input-field" placeholder="9876543210" value={form.phoneNumber} onChange={set('phoneNumber')} />
              </div>
            </div>
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} required className="input-field" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} minLength={6} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 4, background: 'linear-gradient(135deg, #c0392b, #8B1A1A)', color: 'white', boxShadow: '0 4px 15px rgba(139,26,26,0.3)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e07070', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>

        <div style={{ marginTop: 14, padding: '9px 14px', background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.18)', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>
          💡 Make sure the Spring Boot backend is running on <strong style={{ color: 'var(--accent-primary)' }}>localhost:8080</strong>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
