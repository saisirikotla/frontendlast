import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/common/Sidebar';
import ItemCard from '../../components/common/ItemCard';
import { useAuth } from '../../context/AuthContext';
import { publicAPI, itemsAPI } from '../../services/api';
import { Search, Filter, X, Info, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['ALL','ELECTRONICS','BOOKS','CLOTHING','ACCESSORIES','DOCUMENTS','KEYS','BAGS','SPORTS','OTHERS'];
const TYPES = ['ALL','LOST','FOUND'];

// ── Modals defined OUTSIDE BrowseItems so they never remount on parent re-render ──

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
          <span className={`badge badge-${item.status?.toLowerCase()}`}
            style={item.status==='FOUND_REPORTED'?{background:'rgba(124,58,237,0.15)',color:'#a78bfa',border:'1px solid rgba(124,58,237,0.3)'}:{}}>
            {item.status==='FOUND_REPORTED'?'📍 Found!':item.status}
          </span>
        </div>
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title}
            style={{ width:'100%', maxHeight:220, objectFit:'cover', borderRadius:'var(--radius-md)', marginBottom:14, border:'1px solid var(--border-card)' }}
            onError={e => e.target.style.display='none'}
          />
        )}
        <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.6, marginBottom:14 }}>{item.description}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:7, fontSize:13, color:'var(--text-secondary)', marginBottom:16 }}>
          {item.location && <div>📍 <strong style={{color:'var(--text-primary)'}}>Location:</strong> {item.location}</div>}
          {item.contactInfo && <div>📞 <strong style={{color:'var(--text-primary)'}}>Contact:</strong> {item.contactInfo}</div>}
          {item.reportedByName && <div>👤 <strong style={{color:'var(--text-primary)'}}>Reported by:</strong> {item.reportedByName}</div>}
          {/* Found details only visible to the reporter (backend strips them for others) */}
          {item.status==='FOUND_REPORTED' && item.foundLocation ? (
            <div style={{ marginTop:6, padding:'10px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:8 }}>
              <div style={{ color:'#a78bfa', fontWeight:600, marginBottom:4 }}>📍 Found Report</div>
              <div><strong style={{color:'var(--text-primary)'}}>Found at:</strong> {item.foundLocation}</div>
              {item.foundNotes && <div style={{marginTop:3}}><strong style={{color:'var(--text-primary)'}}>Notes:</strong> {item.foundNotes}</div>}
              {item.foundByName && <div style={{marginTop:3}}><strong style={{color:'var(--text-primary)'}}>Found by:</strong> {item.foundByName}</div>}
            </div>
          ) : item.status==='FOUND_REPORTED' ? (
            <div style={{ marginTop:6, padding:'10px 12px', background:'rgba(124,58,237,0.05)', border:'1px dashed rgba(124,58,237,0.2)', borderRadius:8, fontSize:13, color:'var(--text-muted)', textAlign:'center' }}>
              📍 This item has been found — the owner has been notified
            </div>
          ) : null}
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
          Someone found this item. Prove ownership below. Admin will verify and coordinate the return.
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
              value={foundLocation}
              onChange={e => setFoundLocation(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Additional notes (optional)</label>
            <textarea className="input-field"
              placeholder="e.g. Item is with me / I left it at the security desk..."
              value={foundNotes}
              onChange={e => setFoundNotes(e.target.value)}
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

// ── Main component ──
const BrowseItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewModal, setViewModal] = useState(null);
  const [claimModal, setClaimModal] = useState(null);
  const [foundModal, setFoundModal] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    let result = items;
    if (typeFilter !== 'ALL') result = result.filter(i => i.type === typeFilter);
    if (categoryFilter !== 'ALL') result = result.filter(i => i.category === categoryFilter);
    if (search) result = result.filter(i =>
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [items, search, typeFilter, categoryFilter]);

  const fetchItems = async () => {
    try { const res = await publicAPI.getItems(); setItems(res.data); }
    catch { toast.error('Failed to load items'); }
    finally { setLoading(false); }
  };

  const handleClaim = useCallback(async (claimDesc) => {
    try {
      await itemsAPI.claim(claimModal.id, { claimDescription: claimDesc });
      toast.success('Ownership claim submitted! Admin will verify and contact you.');
      setClaimModal(null); fetchItems();
    } catch { toast.error('Failed to submit claim'); }
  }, [claimModal]);

  const handleReportFound = useCallback(async (foundLocation, foundNotes) => {
    try {
      await itemsAPI.reportFound(foundModal.id, { foundLocation, foundNotes });
      toast.success('Thank you! The owner has been notified. Admin will coordinate the return.');
      setFoundModal(null); fetchItems();
    } catch (err) { toast.error(err.response?.data || 'Failed to submit'); }
  }, [foundModal]);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:28, marginBottom:4 }}>Browse Items</h1>
          <p style={{ color:'var(--text-secondary)' }}>Search all reported items on campus</p>
        </div>

        {/* How it works */}
        <div style={{ display:'flex', gap:10, padding:'12px 16px', background:'rgba(79,142,247,0.07)', border:'1px solid rgba(79,142,247,0.18)', borderRadius:'var(--radius-md)', marginBottom:24, fontSize:13, color:'var(--text-secondary)' }}>
          <Info size={16} style={{ flexShrink:0, marginTop:1, color:'var(--accent-primary)' }}/>
          <span>
            🟢 <strong style={{color:'var(--text-primary)'}}>FOUND items</strong> — Click <em>"This is Mine"</em> to claim ownership. &nbsp;|&nbsp;
            🔴 <strong style={{color:'var(--text-primary)'}}>LOST items</strong> — Click <em>"I Found This!"</em> if you physically found the object.
          </span>
        </div>

        {/* Filters */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-card)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:24 }}>
          <div style={{ position:'relative', marginBottom:14 }}>
            <Search size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
            <input className="input-field" placeholder="Search by title, description, or location..."
              value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:42 }}/>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
            <span style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', marginRight:2 }}>Type:</span>
            {TYPES.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`btn ${typeFilter===t?'btn-primary':'btn-ghost'}`}
                style={{ fontSize:12, padding:'6px 14px' }}>
                {t==='LOST'?'🔴':t==='FOUND'?'🟢':'🔵'} {t}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', marginRight:2 }}>Category:</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)}
                className={`btn ${categoryFilter===c?'btn-primary':'btn-ghost'}`}
                style={{ fontSize:11, padding:'5px 10px' }}>
                {c==='ALL'?'All':c.charAt(0)+c.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:16, fontSize:14, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:8 }}>
          <Filter size={14}/>
          Showing <strong style={{color:'var(--text-primary)'}}>{filtered.length}</strong> item{filtered.length!==1?'s':''}
          {(search||typeFilter!=='ALL'||categoryFilter!=='ALL') && (
            <button onClick={() => { setSearch(''); setTypeFilter('ALL'); setCategoryFilter('ALL'); }}
              className="btn btn-ghost" style={{ fontSize:12, padding:'4px 10px', marginLeft:4 }}>
              <X size={12}/> Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid-3">{[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:270, borderRadius:'var(--radius-lg)' }}/>)}</div>
        ) : filtered.length > 0 ? (
          <div className="grid-3">
            {filtered.map(item => (
              <ItemCard key={item.id} item={item}
                onClaim={item.type==='FOUND' ? setClaimModal : null}
                onReportFound={item.type==='LOST' ? setFoundModal : null}
                onView={setViewModal}
                currentUserId={user?.userId}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon" style={{ fontSize:32 }}>🔍</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:600 }}>No items found</h3>
            <p style={{ color:'var(--text-secondary)', fontSize:14 }}>Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <ViewModal
        item={viewModal}
        currentUserId={user?.userId}
        onClose={() => setViewModal(null)}
        onOpenClaim={() => { setClaimModal(viewModal); setViewModal(null); }}
        onOpenFound={() => { setFoundModal(viewModal); setViewModal(null); }}
      />
      <ClaimModal item={claimModal} onClose={() => setClaimModal(null)} onSubmit={handleClaim} />
      <FoundModal item={foundModal} onClose={() => setFoundModal(null)} onSubmit={handleReportFound} />
    </div>
  );
};

export default BrowseItems;
