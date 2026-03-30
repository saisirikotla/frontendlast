import React from 'react';
import { MapPin, Calendar, Tag, User, Eye } from 'lucide-react';
import { format } from 'date-fns';

const categoryEmoji = {
  ELECTRONICS: '📱', BOOKS: '📚', CLOTHING: '👕', ACCESSORIES: '⌚',
  DOCUMENTS: '📄', KEYS: '🔑', BAGS: '🎒', SPORTS: '⚽', OTHERS: '📦'
};

const ItemCard = ({ item, onClaim, onReportFound, onView, showActions = true, currentUserId }) => {
  const isLost = item.type === 'LOST';
  const isFound = item.type === 'FOUND';
  const isMyReport = item.reportedById === currentUserId;

  // FOUND item: anyone (except reporter) can claim ownership
  const canClaim = isFound && !isMyReport && onClaim;

  // LOST item: anyone except the reporter can say "I found this"
  const canReportFound = isLost && !isMyReport && onReportFound && item.status === 'ACTIVE';

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onView && onView(item)}>

      {/* Top colour strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: isLost
          ? 'linear-gradient(90deg, #ef4444, #f97316)'
          : 'linear-gradient(90deg, #10b981, #06b6d4)',
      }} />

      {/* Image if present */}
      {item.imageUrl && (
        <div style={{ margin:'-1px -1px 14px -1px' }}>
          <img src={item.imageUrl} alt={item.title}
            style={{ width:'100%', height:140, objectFit:'cover', borderRadius:'var(--radius-lg) var(--radius-lg) 0 0' }}
            onError={e => e.target.style.display='none'}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>{categoryEmoji[item.category] || '📦'}</span>
          <span className={`badge badge-${item.type?.toLowerCase()}`}>
            {isLost ? '🔴' : '🟢'} {item.type}
          </span>
        </div>
        <span className={`badge badge-${item.status?.toLowerCase()}`} style={
          item.status === 'FOUND_REPORTED'
            ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }
            : {}
        }>
          {item.status === 'FOUND_REPORTED' ? '📍 Found!' : item.status}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
        color: 'var(--text-primary)', marginBottom: 8,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {item.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5,
      }}>
        {item.description}
      </p>

      {/* Found report banner — location only shown if backend returned it (i.e. user is the reporter) */}
      {item.status === 'FOUND_REPORTED' && (
        <div style={{
          display: 'flex', gap: 6, padding: '8px 10px',
          background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 8, marginBottom: 12, fontSize: 12, color: '#a78bfa',
        }}>
          <span style={{ flexShrink: 0 }}>📍</span>
          {item.foundLocation
            ? <span><strong>Found at:</strong> {item.foundLocation}</span>
            : <span>Someone reported finding this item — the owner has been notified</span>
          }
        </div>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
        {item.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <MapPin size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.location}</span>
          </div>
        )}
        {item.dateLostOrFound && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <Calendar size={12} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
            <span>{format(new Date(item.dateLostOrFound), 'MMM d, yyyy')}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
          <Tag size={12} style={{ color: '#a78bfa', flexShrink: 0 }} />
          <span>{item.category?.charAt(0) + item.category?.slice(1).toLowerCase()}</span>
        </div>
        {item.reportedByName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <User size={12} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isMyReport ? '👤 You reported this' : item.reportedByName}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: 13, padding: '8px 12px' }}
            onClick={(e) => { e.stopPropagation(); onView && onView(item); }}
          >
            <Eye size={14} /> View
          </button>

          {/* FOUND item: user can claim it as theirs */}
          {canClaim && item.status === 'ACTIVE' && (
            <button
              className="btn btn-primary"
              style={{ flex: 1, fontSize: 13, padding: '8px 12px' }}
              onClick={(e) => { e.stopPropagation(); onClaim(item); }}
            >
              🙋 This is Mine
            </button>
          )}

          {/* LOST item: someone else can say they found it */}
          {canReportFound && (
            <button
              className="btn btn-primary"
              style={{ flex: 1, fontSize: 13, padding: '8px 12px', background: 'linear-gradient(135deg, #7c3aed, #4f8ef7)' }}
              onClick={(e) => { e.stopPropagation(); onReportFound(item); }}
            >
              📍 I Found This!
            </button>
          )}

          {/* Own report label */}
          {(isFound && isMyReport) || (isLost && isMyReport) ? (
            <div style={{
              flex: 1, fontSize: 12, padding: '8px 12px', textAlign: 'center',
              color: 'var(--text-muted)', border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}>
              Your report
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
