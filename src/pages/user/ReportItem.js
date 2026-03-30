import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { itemsAPI } from '../../services/api';
import { CheckCircle, Upload, X, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['ELECTRONICS','BOOKS','CLOTHING','ACCESSORIES','DOCUMENTS','KEYS','BAGS','SPORTS','OTHERS'];

const ReportItem = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [form, setForm] = useState({
    title:'', description:'', type:'LOST', category:'ELECTRONICS',
    location:'', contactInfo:'', dateLostOrFound: new Date().toISOString().split('T')[0],
  });

  const set = field => e => setForm({ ...form, [field]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    const reader = new FileReader();
    reader.onload = (ev) => {
      // Compress image using canvas before storing
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        setImagePreview(compressed);
        setImageBase64(compressed);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await itemsAPI.create({
        ...form,
        imageUrl: imageBase64 || null,
        dateLostOrFound: new Date(form.dateLostOrFound).toISOString(),
      });
      setSubmitted(true);
      toast.success('Item reported successfully!');
    } catch { toast.error('Failed to report item. Please try again.'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setSubmitted(false);
    setImagePreview(null);
    setImageBase64(null);
    setForm({ title:'', description:'', type:'LOST', category:'ELECTRONICS', location:'', contactInfo:'', dateLostOrFound: new Date().toISOString().split('T')[0] });
  };

  if (submitted) {
    return (
      <div className="page-layout">
        <Sidebar />
        <main className="main-content" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center', maxWidth:440 }}>
            <div style={{ width:80, height:80, background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', animation:'float 3s ease-in-out infinite' }}>
              <CheckCircle size={36} color="#10b981"/>
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:26, marginBottom:12 }}>Item Reported!</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:15, marginBottom:32, lineHeight:1.6 }}>
              Your item has been successfully reported and is now visible to all students on campus.
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              <button className="btn btn-primary" onClick={resetForm}>Report Another</button>
              <button className="btn btn-ghost" onClick={() => navigate('/my-items')}>View My Reports</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:28, marginBottom:4 }}>Report an Item</h1>
          <p style={{ color:'var(--text-secondary)' }}>Fill in the details about the lost or found item</p>
        </div>

        <div style={{ maxWidth:700 }}>
          <div className="card" style={{ padding:36 }}>

            {/* Type selector */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:500, color:'var(--text-secondary)', marginBottom:10, display:'block' }}>What are you reporting? *</label>
              <div style={{ display:'flex', gap:12 }}>
                {['LOST','FOUND'].map(type => (
                  <button key={type} type="button" onClick={() => setForm({...form, type})}
                    style={{
                      flex:1, padding:16, borderRadius:'var(--radius-md)', cursor:'pointer',
                      border: form.type===type
                        ? type==='LOST' ? '2px solid rgba(239,68,68,0.6)' : '2px solid rgba(16,185,129,0.6)'
                        : '1px solid var(--border-subtle)',
                      background: form.type===type
                        ? type==='LOST' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'
                        : 'transparent',
                      transition:'var(--transition)',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                      fontFamily:'var(--font-display)', fontWeight:600, fontSize:16,
                      color: form.type===type ? (type==='LOST'?'#ef4444':'#10b981') : 'var(--text-secondary)',
                    }}>
                    <span style={{ fontSize:22 }}>{type==='LOST'?'🔴':'🟢'}</span>
                    {type==='LOST'?'I Lost an Item':'I Found an Item'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div className="input-group">
                <label>Item Title *</label>
                <input type="text" required className="input-field" placeholder="e.g. Black Samsung Galaxy Earbuds"
                  value={form.title} onChange={set('title')}/>
              </div>

              <div className="input-group">
                <label>Description *</label>
                <textarea required className="input-field"
                  placeholder="Describe the item in detail — colour, brand, any marks, what was inside, etc."
                  value={form.description} onChange={set('description')} rows={4} style={{ resize:'vertical' }}/>
              </div>

              <div style={{ display:'flex', gap:16 }}>
                <div className="input-group" style={{ flex:1 }}>
                  <label>Category *</label>
                  <select required className="input-field" value={form.category} onChange={set('category')}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{ flex:1 }}>
                  <label>Date {form.type==='LOST'?'Lost':'Found'} *</label>
                  <input type="date" required className="input-field" value={form.dateLostOrFound}
                    onChange={set('dateLostOrFound')} max={new Date().toISOString().split('T')[0]}/>
                </div>
              </div>

              <div className="input-group">
                <label>Location *</label>
                <input type="text" required className="input-field"
                  placeholder="e.g. Main Library 2nd Floor, Block B entrance, Sports Ground"
                  value={form.location} onChange={set('location')}/>
              </div>

              <div className="input-group">
                <label>Contact Information</label>
                <input type="text" className="input-field" placeholder="e.g. your@email.com or phone number"
                  value={form.contactInfo} onChange={set('contactInfo')}/>
              </div>

              {/* Image Upload */}
              <div className="input-group">
                <label>Item Photo (optional)</label>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageChange}/>

                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      border:'2px dashed var(--border-card)', borderRadius:'var(--radius-md)',
                      padding:'28px', textAlign:'center', cursor:'pointer',
                      background:'var(--bg-secondary)', transition:'var(--transition)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent-primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='var(--border-card)'}
                  >
                    <Upload size={28} color="var(--text-muted)" style={{ marginBottom:8 }}/>
                    <div style={{ color:'var(--text-secondary)', fontSize:14, fontWeight:500 }}>Click to upload a photo</div>
                    <div style={{ color:'var(--text-muted)', fontSize:12, marginTop:4 }}>PNG, JPG, WEBP · Max 5MB</div>
                  </div>
                ) : (
                  <div style={{ position:'relative', display:'inline-block' }}>
                    <img src={imagePreview} alt="preview"
                      style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:'var(--radius-md)', border:'1px solid var(--border-card)' }}/>
                    <button type="button" onClick={removeImage}
                      style={{
                        position:'absolute', top:8, right:8,
                        background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%',
                        width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center',
                        cursor:'pointer', color:'white',
                      }}>
                      <X size={14}/>
                    </button>
                    <button type="button" onClick={() => fileInputRef.current.click()}
                      style={{ display:'block', marginTop:8, fontSize:12, color:'var(--accent-primary)', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                      Change photo
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display:'flex', gap:12, paddingTop:4 }}>
                <button type="button" className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => navigate(-1)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex:2, justifyContent:'center', padding:14 }}>
                  {loading ? 'Submitting...' : `🚀 Report ${form.type==='LOST'?'Lost':'Found'} Item`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportItem;
