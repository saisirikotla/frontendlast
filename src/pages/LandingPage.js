import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, ArrowRight } from 'lucide-react';
import AnuragLogo from '../assets/AnuragLogo';

const LandingPage = () => {
  const features = [
    { icon: '🔍', title: 'Smart Search', desc: 'Search through all reported items instantly with filters by category, location, and date.' },
    { icon: '📸', title: 'Photo Reports', desc: 'Attach images to your lost or found reports to help with identification.' },
    { icon: '🔔', title: 'Instant Claims', desc: 'Claim found items directly through the platform and connect with the finder.' },
    { icon: '🛡️', title: 'Admin Verified', desc: 'All claims are reviewed by campus admins to prevent fraud and ensure safe returns.' },
  ];

  const stats = [
    { num: '500+', label: 'Items Recovered' },
    { num: '1200+', label: 'Students Helped' },
    { num: '95%', label: 'Success Rate' },
    { num: '24h', label: 'Avg. Resolution' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10, 14, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Anurag Logo + App Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              background: 'white',
              borderRadius: 8,
              padding: '5px 10px',
              display: 'inline-flex',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}>
              <AnuragLogo height={28} />
            </div>
            <div style={{ borderLeft: '1px solid var(--border-card)', paddingLeft: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Lost &amp; Found Portal
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Anurag University, Hyderabad</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login" className="btn btn-ghost" style={{ fontSize: 14 }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 14 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '90px 0 70px',
        background: 'var(--gradient-hero)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(139,26,26,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          {/* University badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,26,26,0.3)',
            borderRadius: 100,
            marginBottom: 32,
          }}>
            <div style={{ background: 'white', borderRadius: 6, padding: '3px 8px' }}>
              <AnuragLogo height={18} />
            </div>
            <span style={{ fontSize: 13, color: '#e07070', fontWeight: 500 }}>Official Campus Portal — Anurag University</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(38px, 6.5vw, 68px)',
            lineHeight: 1.1, marginBottom: 24,
            color: 'var(--text-primary)',
          }}>
            Lost Something on
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #e07070, #8B1A1A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              AU Campus?
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 19px)',
            color: 'var(--text-secondary)',
            maxWidth: 540, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            The official Lost &amp; Found system for Anurag University students. Report, search, and recover your belongings quickly and safely within the campus community.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: 15, padding: '13px 26px', background: 'linear-gradient(135deg, #c0392b, #8B1A1A)', boxShadow: '0 4px 15px rgba(139,26,26,0.4)' }}>
              Report Lost Item <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: 15, padding: '13px 26px' }}>
              <Search size={17} /> Browse Found Items
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="grid-4">
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 38,
                  background: 'linear-gradient(135deg, #e07070, #8B1A1A)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>{s.num}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '76px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(26px, 4vw, 40px)', marginBottom: 12 }}>
              Everything AU students need to
              <span style={{ color: '#e07070' }}> recover their items</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Built exclusively for the Anurag University campus community</p>
          </div>
          <div className="grid-2" style={{ maxWidth: 880, margin: '0 auto' }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ display: 'flex', gap: 16 }}>
                <div style={{ fontSize: 30, flexShrink: 0, lineHeight: 1 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg-card)', border: '1px solid rgba(139,26,26,0.2)',
            borderRadius: 'var(--radius-xl)', padding: 'clamp(36px, 6vw, 64px)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(139,26,26,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
            {/* Logo in CTA */}
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'white', borderRadius: 10, padding: '8px 16px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <AnuragLogo height={36} />
              </div>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 4vw, 38px)', marginBottom: 14 }}>
              Ready to find your lost item?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 30, maxWidth: 460, margin: '0 auto 30px' }}>
              Join your fellow AU students using this portal to recover their belongings every day on campus.
            </p>
            <Link to="/register" className="btn" style={{ fontSize: 15, padding: '13px 30px', background: 'linear-gradient(135deg, #c0392b, #8B1A1A)', color: 'white', boxShadow: '0 4px 15px rgba(139,26,26,0.35)' }}>
              Create Free Account <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '20px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <div style={{ background: 'white', borderRadius: 6, padding: '4px 10px', opacity: 0.85 }}>
            <AnuragLogo height={20} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          © 2024 Anurag University Lost &amp; Found Portal · Venkatapur, Hyderabad, Telangana
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
