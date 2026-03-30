import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { itemsAPI } from '../../services/api';
import { PlusCircle, Package, Bell, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const categoryEmoji = { ELECTRONICS:'📱', BOOKS:'📚', CLOTHING:'👕', ACCESSORIES:'⌚', DOCUMENTS:'📄', KEYS:'🔑', BAGS:'🎒', SPORTS:'⚽', OTHERS:'📦' };

const FoundNotificationModal = ({ item, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>🎉 Someone Found Your Item!</h3>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
      </div>
      <div style={{ padding:'14px', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:10, marginBottom:16 }}>
        <div style={{ fontWeight:600, color:'#a78bfa', marginBottom:10, fontSize:15 }}>📍 Found Report Details</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13, color:'var(--text-secondary)' }}>
          <div><strong style={{color:'var(--text-primary)'}}>Item:</strong> {item.title}</div>
          {item.foundByName && <div><strong style={{color:'var(--text-primary)'}}>Found by:</strong> {item.foundByName}</div>}
          {item.foundLocation && (
            <div style={{ display:'flex', gap:6, alignItems:'flex-start' }}>
              <MapPin size={13} style={{ color:'#a78bfa', marginTop:2, flexShrink:0 }}/>
              <div><strong style={{color:'var(--text-primary)'}}>Found at:</strong> {item.foundLocation}</div>
            </div>
          )}
          {item.foundNotes && <div><strong style={{color:'var(--text-primary)'}}>Notes:</strong> <em>"{item.foundNotes}"</em></div>}
          {item.foundReportedAt && <div><strong style={{color:'var(--text-primary)'}}>Reported:</strong> {format(new Date(item.foundReportedAt), 'MMM d, yyyy · h:mm a')}</div>}
        </div>
      </div>
      <div style={{ padding:'12px 14px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:8, fontSize:13, color:'var(--text-secondary)', marginBottom:16 }}>
        ✅ The admin has been notified and will contact both you and the finder to coordinate the return of your item.
      </div>
      <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={onClose}>Got it!</button>
    </div>
  </div>
);

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedFoundItem, setSelectedFoundItem] = useState(null);

  useEffect(() => {
    itemsAPI.getMyItems()
      .then(res => setItems(res.data))
      .catch(() => toast.error('Failed to load your items'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'ALL' ? items
    : activeTab === 'LOST' ? items.filter(i => i.type === 'LOST')
    : items.filter(i => i.type === 'FOUND');

  // Lost items that have been found by someone
  const foundNotifications = items.filter(i => i.type === 'LOST' && i.status === 'FOUND_REPORTED');

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:28, marginBottom:4 }}>My Reports</h1>
            <p style={{ color:'var(--text-secondary)' }}>Track all the items you have reported</p>
          </div>
          <Link to="/report" className="btn btn-primary"><PlusCircle size={16}/> Report Item</Link>
        </div>

        {/* 🔔 Found Notifications — shown when someone found your lost item */}
        {foundNotifications.length > 0 && (
          <div style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <Bell size={16} color="#a78bfa"/>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'#a78bfa' }}>
                New Notifications ({foundNotifications.length})
              </span>
            </div>
            {foundNotifications.map(item => (
              <div key={item.id} onClick={() => setSelectedFoundItem(item)}
                style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'14px 18px',
                  background:'rgba(124,58,237,0.08)',
                  border:'1px solid rgba(124,58,237,0.3)',
                  borderRadius:'var(--radius-md)',
                  cursor:'pointer', marginBottom:8,
                  transition:'var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(124,58,237,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(124,58,237,0.08)'}
              >
                <div style={{ width:42, height:42, background:'rgba(124,58,237,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>
                  📍
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, color:'var(--text-primary)', fontSize:14, marginBottom:2 }}>
                    Someone found your item: <span style={{ color:'#a78bfa' }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)' }}>
                    Found at: <strong style={{color:'var(--text-primary)'}}>{item.foundLocation}</strong>
                    {item.foundByName && ` · by ${item.foundByName}`}
                  </div>
                </div>
                <div style={{ fontSize:12, color:'#a78bfa', fontWeight:500 }}>View details →</div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom:24 }}>
          {[
            { label:'Total Reports', value:items.length, emoji:'📋', color:'blue' },
            { label:'Active', value:items.filter(i=>i.status==='ACTIVE').length, emoji:'🔵', color:'teal' },
            { label:'Resolved', value:items.filter(i=>i.status==='RESOLVED').length, emoji:'✅', color:'green' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div style={{ fontSize:24, marginBottom:8 }}>{s.emoji}</div>
              <div className="stat-number">{s.value}</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {['ALL','LOST','FOUND'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab===tab?'btn-primary':'btn-ghost'}`}
              style={{ fontSize:13 }}>
              {tab==='LOST'?'🔴':tab==='FOUND'?'🟢':'📋'} {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[1,2,3].map(i=><div key={i} className="skeleton" style={{ height:80, borderRadius:'var(--radius-md)' }}/>)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Updates</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}
                    style={{ background: item.status==='FOUND_REPORTED' ? 'rgba(124,58,237,0.05)' : undefined }}
                    onClick={() => item.status==='FOUND_REPORTED' && setSelectedFoundItem(item)}
                  >
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:20 }}>{categoryEmoji[item.category]||'📦'}</span>
                        <div>
                          <div style={{ color:'var(--text-primary)', fontWeight:500, fontSize:14 }}>{item.title}</div>
                          <div style={{ color:'var(--text-muted)', fontSize:12, maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge badge-${item.type?.toLowerCase()}`}>{item.type}</span></td>
                    <td style={{ fontSize:13, maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.location}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{item.createdAt ? format(new Date(item.createdAt),'MMM d, yyyy') : '—'}</td>
                    <td>
                      <span className={`badge badge-${item.status?.toLowerCase()}`}
                        style={item.status==='FOUND_REPORTED'?{background:'rgba(124,58,237,0.15)',color:'#a78bfa',border:'1px solid rgba(124,58,237,0.3)'}:{}}>
                        {item.status==='FOUND_REPORTED'?'📍 Found!':item.status}
                      </span>
                    </td>
                    <td style={{ fontSize:12 }}>
                      {item.status==='FOUND_REPORTED' ? (
                        <button onClick={() => setSelectedFoundItem(item)}
                          style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:6, padding:'4px 10px', cursor:'pointer', color:'#a78bfa', fontSize:12, fontWeight:500 }}>
                          📍 View Details
                        </button>
                      ) : item.status==='CLAIMED' && item.claimedByName ? (
                        <div>
                          <div style={{ color:'var(--accent-yellow)', fontWeight:500 }}>{item.claimedByName}</div>
                          <div style={{ color:'var(--text-muted)', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.claimDescription}</div>
                        </div>
                      ) : item.status==='RESOLVED' ? (
                        <span style={{ color:'var(--accent-green)', fontWeight:500 }}>✅ Returned</span>
                      ) : (
                        <span style={{ color:'var(--text-muted)' }}>No updates yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Package size={32}/></div>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:600 }}>No reports yet</h3>
            <p style={{ color:'var(--text-secondary)', fontSize:14 }}>You haven't reported any items yet</p>
            <Link to="/report" className="btn btn-primary" style={{ marginTop:8 }}>
              <PlusCircle size={16}/> Report Your First Item
            </Link>
          </div>
        )}
      </main>

      {selectedFoundItem && (
        <FoundNotificationModal item={selectedFoundItem} onClose={() => setSelectedFoundItem(null)} />
      )}
    </div>
  );
};

export default MyItems;
