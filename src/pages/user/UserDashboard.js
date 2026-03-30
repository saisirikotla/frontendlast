import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { publicAPI, itemsAPI } from '../../services/api';
import ItemCard from '../../components/common/ItemCard';
import { PlusCircle, Search, Package, ArrowRight, X, Info, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Modals outside component so they never remount ──

const ViewModal = ({ item, currentUserId, onClose, onOpenClaim, onOpenFound }) => {
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>{item.title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
          <span className={`badge badge-${item.type?.toLowerCase()}`}>{item.type}</span>
          <span className={`badge badge-${item.status?.toLowerCase()}`}>{item.status}</span>
        </div>
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title}
            style={{ width:'100%', maxHeight:220, objectFit:'cover', borderRadius:'var(--radius-md)', marginBottom:14, border:'1px solid var(--border-card)' }}
            onError={e => e.target.style.display='none'}
          />
        )}
        <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.6, marginBottom:14 }}>{item.description}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
          {item.location && <div>📍 <strong style={{color:'var(--text-primary)'}}>Location:</strong> {item.location}</div>}
          {item.contactInfo && <div>📞 <strong style={{color:'var(--text-primary)'}}>Contact:</strong> {item.contactInfo}</div>}
          {item.reportedByName && <div>👤 <strong style={{color:'var(--text-primary)'}}>Reported by:</strong> {item.reportedByName}</div>}
        </div>
        {item.status==='ACTIVE' && item.type==='FOUND' && item.reportedById !== currentUserId && (
          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={onOpenClaim}>
            🙋 This item is mine — Claim it
          </button>
        )}
        {item.status==='ACTIVE' && item.type==='LOST' && item.reportedById !== currentUserId && (
          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', background:'linear-gradient(135deg,#7c3aed,#4f8ef7)', marginTop:8 }} onClick={onOpenFound}>
            📍 I Found This Item!
          </button>
        )}
        {item.status==='FOUND_REPORTED' && item.reportedById === currentUserId && item.foundLocation && (
          <div style={{ padding:'12px 14px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:8, fontSize:13, color:'var(--text-secondary)' }}>
            <div style={{ fontWeight:600, color:'#a78bfa', marginBottom:6 }}>📍 Someone Found Your Item!</div>
            <div><strong style={{color:'var(--text-primary)'}}>Found at:</strong> {item.foundLocation}</div>
            {item.foundNotes && <div style={{marginTop:3}}><strong style={{color:'var(--text-primary)'}}>Notes:</strong> {item.foundNotes}</div>}
            {item.foundByName && <div style={{marginTop:3}}><strong style={{color:'var(--text-primary)'}}>Found by:</strong> {item.foundByName}</div>}
          </div>
        )}
        {item.status==='FOUND_REPORTED' && item.reportedById !== currentUserId && (
          <div style={{ padding:'10px 14px', background:'rgba(124,58,237,0.05)', border:'1px dashed rgba(124,58,237,0.2)', borderRadius:8, fontSize:13, color:'var(--text-muted)', textAlign:'center' }}>
            📍 This item has been found — the owner has been notified
          </div>
        )}
        {item.type==='LOST' && item.status==='ACTIVE' && item.reportedById === currentUserId && (
          <div style={{ display:'flex', gap:8, padding:'10px 14px', background:'rgba(79,142,247,0.08)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:8, fontSize:13, color:'var(--text-secondary)' }}>
            <Info size={14} style={{ flexShrink:0, marginTop:1, color:'var(--accent-primary)' }}/>
            If someone finds this item they can click "I Found This!" to notify you.
          </div>
        )}
      </div>
    </div>
  );
};

const ClaimModal = ({ item, onClose, onSubmit }) => {
  const [claimDesc, setClaimDesc] = useState('');
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>Claim Ownership</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
        </div>
        <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:14 }}>
          Claiming: <strong style={{color:'var(--text-primary)'}}>{item.title}</strong>
        </p>
        <div style={{ display:'flex', gap:8, padding:'10px 14px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:8, fontSize:13, color:'var(--text-secondary)', marginBottom:18 }}>
          <Info size={14} style={{ flexShrink:0, marginTop:1, color:'#10b981' }}/>
          Someone found this item. Prove your ownership and admin will coordinate the return.
        </div>
        <div className="input-group" style={{ marginBottom:20 }}>
          <label>Prove this item is yours *</label>
          <textarea
            className="input-field"
            placeholder="Describe specific details only the owner would know — brand, colour, contents, your name/roll no. written on it, when & where you lost it..."
            value={claimDesc}
            onChange={e => setClaimDesc(e.target.value)}
            rows={5}
            style={{ resize:'vertical' }}
          />
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex:1, justifyContent:'center' }} onClick={() => onSubmit(claimDesc)} disabled={!claimDesc.trim()}>
            Submit Claim
          </button>
        </div>
      </div>
    </div>
  );
};

const FoundModal = ({ item, onClose, onSubmit }) => {
  const [foundLocation, setFoundLocation] = useState('');
  const [foundNotes, setFoundNotes] = useState('');
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>Report Item Found</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
        </div>
        <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:14 }}>
          You found: <strong style={{color:'var(--text-primary)'}}>{item.title}</strong>
        </p>
        <div style={{ display:'flex', gap:8, padding:'10px 14px', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:8, fontSize:13, color:'var(--text-secondary)', marginBottom:18 }}>
          <MapPin size={14} style={{ flexShrink:0, marginTop:1, color:'#a78bfa' }}/>
          Tell us where you found it so the admin can help return it to the owner.
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:20 }}>
          <div className="input-group">
            <label>Where did you find it? *</label>
            <input type="text" className="input-field"
              placeholder="e.g. Library 2nd floor / Canteen table 5 / Block B corridor"
              value={foundLocation} onChange={e => setFoundLocation(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Additional notes (optional)</label>
            <textarea className="input-field"
              placeholder="e.g. Item is with me / I left it at the security desk..."
              value={foundNotes} onChange={e => setFoundNotes(e.target.value)}
              rows={3} style={{ resize:'vertical' }} />
          </div>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex:1, justifyContent:'center', background:'linear-gradient(135deg,#7c3aed,#4f8ef7)' }}
            onClick={() => onSubmit(foundLocation, foundNotes)} disabled={!foundLocation.trim()}>
            📍 Submit Found Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ──
const UserDashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [claimModal, setClaimModal] = useState(null);
  const [foundModal, setFoundModal] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pubRes, myRes] = await Promise.all([publicAPI.getItems(), itemsAPI.getMyItems()]);
      setItems(pubRes.data.slice(0, 6));
      setMyItems(myRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleClaim = useCallback(async (claimDesc) => {
    try {
      await itemsAPI.claim(claimModal.id, { claimDescription: claimDesc });
      toast.success('Ownership claim submitted! Admin will verify and contact you.');
      setClaimModal(null); fetchData();
    } catch { toast.error('Failed to submit claim'); }
  }, [claimModal]);

  const handleReportFound = useCallback(async (foundLocation, foundNotes) => {
    try {
      await itemsAPI.reportFound(foundModal.id, { foundLocation, foundNotes });
      toast.success('Thank you! The owner has been notified. Admin will coordinate the return.');
      setFoundModal(null); fetchData();
    } catch (err) { toast.error(err.response?.data || 'Failed to submit'); }
  }, [foundModal]);

  const recentFound = items.filter(i => i.type === 'FOUND').slice(0, 3);
  const recentLost  = items.filter(i => i.type === 'LOST').slice(0, 3);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:28, marginBottom:4 }}>
                Hello, {user?.fullName?.split(' ')[0]} 👋
              </h1>
              <p style={{ color:'var(--text-secondary)', fontSize:15 }}>Welcome to the AU Lost &amp; Found Portal</p>
            </div>
            <Link to="/report" className="btn btn-primary"><PlusCircle size={16}/> Report Item</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom:32 }}>
          {[
            { label:'My Reports', value:myItems.length, icon:'📋', color:'blue' },
            { label:'Active Listings', value:items.length, icon:'🔍', color:'green' },
            { label:'Lost Items', value:items.filter(i=>i.type==='LOST').length, icon:'🔴', color:'red' },
            { label:'Found Items', value:items.filter(i=>i.type==='FOUND').length, icon:'🟢', color:'teal' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div className="stat-number">{loading?'—':s.value}</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid-2" style={{ marginBottom:32 }}>
          <Link to="/browse" className="card" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:52, height:52, background:'rgba(79,142,247,0.15)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Search size={22} color="var(--accent-primary)"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, marginBottom:3 }}>Browse Found Items</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)' }}>See what's been found — claim yours</div>
            </div>
            <ArrowRight size={18} color="var(--text-muted)"/>
          </Link>
          <Link to="/my-items" className="card" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:52, height:52, background:'rgba(16,185,129,0.15)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Package size={22} color="var(--accent-green)"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, marginBottom:3 }}>My Reports</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)' }}>Track your reported items</div>
            </div>
            <ArrowRight size={18} color="var(--text-muted)"/>
          </Link>
        </div>

        {/* Found Items */}
        <div style={{ marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>🟢 Recently Found Items</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Someone found these — is one of them yours?</p>
          </div>
          <Link to="/browse" style={{ fontSize:13, color:'var(--accent-primary)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>View all <ArrowRight size={14}/></Link>
        </div>
        <div className="grid-3" style={{ marginBottom:32 }}>
          {loading
            ? [1,2,3].map(i=><div key={i} className="skeleton" style={{ height:240, borderRadius:'var(--radius-lg)' }}/>)
            : recentFound.length > 0
              ? recentFound.map(item=><ItemCard key={item.id} item={item} onClaim={setClaimModal} onView={setViewModal} currentUserId={user?.userId}/>)
              : <div style={{ gridColumn:'1/-1', textAlign:'center', padding:40, color:'var(--text-muted)' }}>No found items yet</div>
          }
        </div>

        {/* Lost Items */}
        <div style={{ marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>🔴 Recently Lost Items</h2>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Found one of these? Click "I Found This!" to help.</p>
          </div>
          <Link to="/browse" style={{ fontSize:13, color:'var(--accent-primary)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>View all <ArrowRight size={14}/></Link>
        </div>
        <div className="grid-3">
          {loading
            ? [1,2,3].map(i=><div key={i} className="skeleton" style={{ height:240, borderRadius:'var(--radius-lg)' }}/>)
            : recentLost.length > 0
              ? recentLost.map(item=><ItemCard key={item.id} item={item} onReportFound={setFoundModal} onClaim={null} onView={setViewModal} currentUserId={user?.userId}/>)
              : <div style={{ gridColumn:'1/-1', textAlign:'center', padding:40, color:'var(--text-muted)' }}>No lost items reported recently</div>
          }
        </div>
      </main>

      <ViewModal item={viewModal} currentUserId={user?.userId}
        onClose={() => setViewModal(null)}
        onOpenClaim={() => { setClaimModal(viewModal); setViewModal(null); }}
        onOpenFound={() => { setFoundModal(viewModal); setViewModal(null); }}
      />
      <ClaimModal item={claimModal} onClose={() => setClaimModal(null)} onSubmit={handleClaim} />
      <FoundModal item={foundModal} onClose={() => setFoundModal(null)} onSubmit={handleReportFound} />
    </div>
  );
};

export default UserDashboard;
