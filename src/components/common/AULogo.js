import React from 'react';
import { Link } from 'react-router-dom';

// Official Anurag University logo from Wikimedia Commons (CC BY-SA 4.0)
const AU_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_Anurag_University.svg/512px-Logo_Anurag_University.svg.png';

export const AULogoFull = ({ style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, ...style }}>
    <img
      src={AU_LOGO_URL}
      alt="Anurag University"
      style={{ height: 52, objectFit: 'contain' }}
      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
    />
    {/* Fallback if image fails */}
    <div style={{
      display: 'none', alignItems: 'center', gap: 10,
      background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
      padding: '8px 16px', borderRadius: 10,
    }}>
      <span style={{ fontFamily: 'serif', fontWeight: 900, fontSize: 22, color: '#ffd700' }}>AU</span>
      <span style={{ fontFamily: 'serif', fontWeight: 700, fontSize: 14, color: 'white', lineHeight: 1.2 }}>
        Anurag<br/>University
      </span>
    </div>
    <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
      Lost & Found Portal
    </div>
  </div>
);

export const AULogoSmall = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img
      src={AU_LOGO_URL}
      alt="Anurag University"
      style={{ height: 32, objectFit: 'contain' }}
      onError={e => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    {/* Fallback */}
    <div style={{
      display: 'none', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32,
      background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
      borderRadius: 8,
      fontFamily: 'serif', fontWeight: 900, fontSize: 14, color: '#ffd700',
    }}>
      AU
    </div>
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1 }}>
        Anurag University
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
        Lost & Found Portal
      </div>
    </div>
  </div>
);

export default AULogoFull;
