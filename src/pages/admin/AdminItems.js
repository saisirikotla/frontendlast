import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { adminAPI } from '../../services/api';
import { Search, Trash2, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    let result = items;
    if (statusFilter !== 'ALL') result = result.filter(i => i.status === statusFilter);
    if (typeFilter !== 'ALL') result = result.filter(i => i.type === typeFilter);
    if (search) result = result.filter(i =>
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.reportedByName?.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [items, search, statusFilter, typeFilter]);

  const fetchItems = async () => {
    try { const res = await adminAPI.getAllItems(); setItems(res.data); }
    catch { toast.error('Failed to load items'); }
    finally { setLoading(false); }
  };

  const approveClaim = async (id) => {
    try {
      await adminAPI.approveClaim(id);
      toast.success('✅ Claim approved! Item marked as resolved.');
      fetchItems(); setViewItem(null);
    } catch { toast.error('Failed to approve'); }
  };

  const rejectClaim = async (id) => {
    try {
      await adminAPI.rejectClaim(id);
      toast.success('Claim rejected — item returned to active list.');
      fetchItems(); setViewItem(null);
    } catch { toast.error('Failed to reject'); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await adminAPI.deleteItem(id); toast.success('Deleted'); fetchItems(); setViewItem(null); }
    catch { toast.error('Failed to delete'); }
  };

  const categoryEmoji = { ELECTRONICS:'📱', BOOKS:'📚', CLOTHING:'👕', ACCESSORIES:'⌚', DOCUMENTS:'📄', KEYS:'🔑', BAGS:'🎒', SPORTS:'⚽', OTHERS:'📦' };

  const pendingCount = items.filter(i => i.status === 'CLAIMED' || i.status === 'FOUND_REPORTED').length;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:28, marginBottom:4 }}>Manage Items</h1>
          <p style={{ color:'var(--text-secondary)' }}>Review and action all pending claims</p>
        </div>

        {/* Pending claims alert */}
        {pendingCount > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.35)', borderRadius:'var(--radius-md)', marginBottom:24 }}>
            <span style={{ fontSize:22 }}>🔔</span>
            <div>
              <div style={{ fontWeight:600, color:'#f59e0b', fontSize:14 }}>{pendingCount} pending action{pendingCount > 1 ? 's' : ''} require your review</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>Click on a CLAIMED or FOUND_REPORTED item to Approve or Reject the claim.</div>
            </div>
            <button onClick={() => setStatusFilter('CLAIMED')} className="btn" style={{ marginLeft:'auto', fontSize:12, padding:'6px 14px', background:'rgba(245,158,11,0.2)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.4)' }}>
              View Claims
            </button>
          </div>
        )}

        {/* Filters */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-card)', borderRadius:'var(--radius-lg)', padding:20, marginBottom:20 }}>
          <div style={{ position:'relative', marginBottom:14 }}>
            <Search size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
            <input className="input-field" placeholder="Search items, users, locations..."
              value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:42 }}/>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['ALL','LOST','FOUND'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`btn ${typeFilter===t?'btn-primary':'btn-ghost'}`}
                style={{ fontSize:12, padding:'5px 12px' }}>{t}</button>
            ))}
            <div style={{ width:1, background:'var(--border-subtle)', margin:'0 4px' }}/>
            {['ALL','ACTIVE','CLAIMED','FOUND_REPORTED','RESOLVED'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`btn ${statusFilter===s?'btn-primary':'btn-ghost'}`}
                style={{ fontSize:12, padding:'5px 12px', position:'relative' }}>
                {s === 'ALL' ? 'All' : s === 'FOUND_REPORTED' ? '📍 Found!' : s}
                {(s === 'CLAIMED') && items.filter(i=>i.status==='CLAIMED').length > 0 && (
                  <span style={{ position:'absolute', top:-6, right:-6, background:'#f59e0b', color:'white', borderRadius:'50%', width:16, height:16, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                    {items.filter(i=>i.status==='CLAIMED').length}
                  </span>
                )}
                {(s === 'FOUND_REPORTED') && items.filter(i=>i.status==='FOUND_REPORTED').length > 0 && (
                  <span style={{ position:'absolute', top:-6, right:-6, background:'#a78bfa', color:'white', borderRadius:'50%', width:16, height:16, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                    {items.filter(i=>i.status==='FOUND_REPORTED').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:14 }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} shown
        </div>

        {loading ? (
          <div className="skeleton" style={{ height:300, borderRadius:'var(--radius-lg)' }}/>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Reported By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} style={{ background: (item.status==='CLAIMED'||item.status==='FOUND_REPORTED') ? 'rgba(245,158,11,0.04)' : undefined }}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:20 }}>{categoryEmoji[item.category]||'📦'}</span>
                        <div>
                          <div style={{ color:'var(--text-primary)', fontWeight:500, fontSize:14 }}>{item.title}</div>
                          <div style={{ color:'var(--text-muted)', fontSize:11 }}>{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge badge-${item.type?.toLowerCase()}`}>{item.type}</span></td>
                    <td style={{ fontSize:13, maxWidth:130, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.location}</td>
                    <td style={{ fontSize:13 }}>{item.reportedByName||'—'}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{item.createdAt ? format(new Date(item.createdAt),'MMM d') : '—'}</td>
                    <td>
                      <span className={`badge badge-${item.status?.toLowerCase()}`}
                        style={item.status==='FOUND_REPORTED'?{background:'rgba(124,58,237,0.15)',color:'#a78bfa',border:'1px solid rgba(124,58,237,0.3)'}:{}}>
                        {item.status==='FOUND_REPORTED'?'📍 Found!':item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:5 }}>
                        <button title="View details" onClick={() => setViewItem(item)}
                          style={{ background:'rgba(79,142,247,0.1)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'var(--accent-primary)', display:'flex' }}>
                          <Eye size={14}/>
                        </button>
                        {/* Approve — for CLAIMED and FOUND_REPORTED */}
                        {(item.status==='CLAIMED'||item.status==='FOUND_REPORTED') && (
                          <button title="Approve claim" onClick={() => approveClaim(item.id)}
                            style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#10b981', display:'flex' }}>
                            <CheckCircle size={14}/>
                          </button>
                        )}
                        {/* Reject — for CLAIMED and FOUND_REPORTED */}
                        {(item.status==='CLAIMED'||item.status==='FOUND_REPORTED') && (
                          <button title="Reject claim" onClick={() => rejectClaim(item.id)}
                            style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#f59e0b', display:'flex' }}>
                            <XCircle size={14}/>
                          </button>
                        )}
                        <button title="Delete" onClick={() => deleteItem(item.id)}
                          style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, padding:'5px 8px', cursor:'pointer', color:'#ef4444', display:'flex' }}>
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <p style={{ color:'var(--text-muted)' }}>No items match your filters</p>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {viewItem && (
          <div className="modal-overlay" onClick={() => setViewItem(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>{viewItem.title}</h3>
                <button onClick={() => setViewItem(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
                <span className={`badge badge-${viewItem.type?.toLowerCase()}`}>{viewItem.type}</span>
                <span className={`badge badge-${viewItem.status?.toLowerCase()}`}
                  style={viewItem.status==='FOUND_REPORTED'?{background:'rgba(124,58,237,0.15)',color:'#a78bfa',border:'1px solid rgba(124,58,237,0.3)'}:{}}>
                  {viewItem.status==='FOUND_REPORTED'?'📍 Found!':viewItem.status}
                </span>
              </div>

              {viewItem.imageUrl && (
                <img src={viewItem.imageUrl} alt={viewItem.title}
                  style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:'var(--radius-md)', marginBottom:14, border:'1px solid var(--border-card)' }}
                  onError={e => e.target.style.display='none'}
                />
              )}
              <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.6, marginBottom:14 }}>{viewItem.description}</p>

              <div style={{ display:'flex', flexDirection:'column', gap:7, fontSize:13, marginBottom:16 }}>
                <div style={{ color:'var(--text-secondary)' }}>📍 <strong style={{color:'var(--text-primary)'}}>Location:</strong> {viewItem.location}</div>
                <div style={{ color:'var(--text-secondary)' }}>👤 <strong style={{color:'var(--text-primary)'}}>Reported by:</strong> {viewItem.reportedByName} ({viewItem.reportedByEmail})</div>
                {viewItem.contactInfo && <div style={{ color:'var(--text-secondary)' }}>📞 <strong style={{color:'var(--text-primary)'}}>Contact:</strong> {viewItem.contactInfo}</div>}
              </div>

              {/* Claim details */}
              {viewItem.status === 'CLAIMED' && viewItem.claimedByName && (
                <div style={{ padding:'14px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:'#f59e0b', marginBottom:8, fontSize:14 }}>🙋 Ownership Claim — Awaiting Your Decision</div>
                  <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:4 }}>
                    <strong style={{color:'var(--text-primary)'}}>Claimed by:</strong> {viewItem.claimedByName}
                  </div>
                  <div style={{ fontSize:13, color:'var(--text-secondary)', fontStyle:'italic', lineHeight:1.5 }}>
                    "{viewItem.claimDescription}"
                  </div>
                </div>
              )}

              {/* Found report details */}
              {viewItem.status === 'FOUND_REPORTED' && viewItem.foundLocation && (
                <div style={{ padding:'14px', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:10, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:'#a78bfa', marginBottom:8, fontSize:14 }}>📍 Found Report — Awaiting Your Decision</div>
                  {viewItem.foundByName && <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:4 }}><strong style={{color:'var(--text-primary)'}}>Found by:</strong> {viewItem.foundByName}</div>}
                  <div style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:4 }}><strong style={{color:'var(--text-primary)'}}>Found at:</strong> {viewItem.foundLocation}</div>
                  {viewItem.foundNotes && <div style={{ fontSize:13, color:'var(--text-secondary)', fontStyle:'italic' }}>"{viewItem.foundNotes}"</div>}
                </div>
              )}

              {/* Action buttons */}
              {(viewItem.status === 'CLAIMED' || viewItem.status === 'FOUND_REPORTED') && (
                <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                  <button className="btn btn-primary" style={{ flex:1, justifyContent:'center', background:'linear-gradient(135deg,#10b981,#06b6d4)' }}
                    onClick={() => approveClaim(viewItem.id)}>
                    <CheckCircle size={15}/> Approve & Resolve
                  </button>
                  <button className="btn" style={{ flex:1, justifyContent:'center', background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.4)' }}
                    onClick={() => rejectClaim(viewItem.id)}>
                    <XCircle size={15}/> Reject Claim
                  </button>
                </div>
              )}

              <button className="btn btn-danger" style={{ width:'100%', justifyContent:'center', fontSize:13 }}
                onClick={() => deleteItem(viewItem.id)}>
                <Trash2 size={14}/> Delete Item
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminItems;
