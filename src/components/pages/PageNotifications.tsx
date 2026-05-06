'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { night: boolean; }

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string | null;
  isRead: number;
  createdAt: string;
}

const TYPE_META: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  like:     { icon: '♡', color: '#f472b6', bg: 'rgba(244,114,182,.12)', border: 'rgba(244,114,182,.3)' },
  comment:  { icon: '💬', color: '#90a8c0', bg: 'rgba(144,168,192,.12)', border: 'rgba(144,168,192,.3)' },
  follow:   { icon: '👥', color: '#c084fc', bg: 'rgba(192,132,252,.12)', border: 'rgba(192,132,252,.3)' },
  featured: { icon: '🌟', color: '#c8a050', bg: 'rgba(200,160,80,.12)',  border: 'rgba(200,160,80,.3)'  },
  badge:    { icon: '🎯', color: '#5e9975', bg: 'rgba(144,200,168,.12)', border: 'rgba(144,200,168,.3)' },
  streak:   { icon: '🔥', color: '#f472b6', bg: 'rgba(244,114,182,.12)', border: 'rgba(244,114,182,.3)' },
};

function getTypeMeta(type: string) {
  return TYPE_META[type] ?? { icon: '🌸', color: '#c084fc', bg: 'rgba(192,132,252,.12)', border: 'rgba(192,132,252,.3)' };
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export function PageNotifications({ night }: Props) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => { setNotifs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function markAllRead() {
    await fetch('/api/notifications/read-all', { method: 'POST' });
    setNotifs(prev => prev.map(x => ({ ...x, isRead: 1 })));
  }

  const unreadCount = notifs.filter(x => !x.isRead).length;
  const displayed = filter === 'unread' ? notifs.filter(x => !x.isRead) : notifs;

  return (
    <div style={{ padding: '36px 44px', maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>Account</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Notifications</em>
          </h1>
          {unreadCount > 0 && (
            <p style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>{unreadCount} unread</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', background: n ? 'rgba(255,255,255,.05)' : 'rgba(245,240,255,.8)', borderRadius: 10, border: `1px solid ${cardBd}`, overflow: 'hidden' }}>
            {(['all', 'unread'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: 11, background: filter === f ? 'linear-gradient(135deg,#c084fc,#7c3aed)' : 'transparent', color: filter === f ? '#fff' : ink3, fontFamily: "'DM Sans',sans-serif", textTransform: 'capitalize', transition: 'all .2s' }}>{f}</button>
            ))}
          </div>
          {unreadCount > 0 && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} onClick={markAllRead} style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Mark all read</motion.button>
          )}
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          </motion.div>
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
        </div>
      )}

      {/* Empty */}
      {!loading && displayed.length === 0 && (
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '72px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🌸</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink2, fontWeight: 300, marginBottom: 8 }}>
            {filter === 'unread' ? 'All caught up' : 'All quiet here'}
          </div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>
            {filter === 'unread' ? 'No unread notifications.' : 'Notifications will appear when others interact with your work.'}
          </div>
        </motion.div>
      )}

      {/* List */}
      {!loading && displayed.length > 0 && (
        <motion.div
          initial="hidden" animate="show" variants={stagger}
          style={{ borderRadius: 24, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}
        >
          <AnimatePresence>
            {displayed.map((notif, i) => {
              const meta = getTypeMeta(notif.type);
              const isUnread = !notif.isRead;
              return (
                <motion.div
                  key={notif.id}
                  variants={fadeUp}
                  layout
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px',
                    borderBottom: i < displayed.length - 1 ? `1px solid ${cardBd}` : 'none',
                    background: isUnread ? (n ? 'rgba(124,58,237,.06)' : 'rgba(192,132,252,.04)') : 'transparent',
                    cursor: 'pointer', transition: 'background .15s',
                  }}
                  whileHover={{ backgroundColor: n ? 'rgba(160,124,200,.07)' : 'rgba(208,191,240,.14)' }}
                >
                  {/* Unread dot */}
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: isUnread ? meta.color : 'transparent', flexShrink: 0, marginTop: 6 }} />

                  {/* Type icon */}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{meta.icon}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: isUnread ? ink : ink2, fontWeight: isUnread ? 400 : 300, lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>{notif.title}</div>
                    {notif.body && <div style={{ fontSize: 11, color: ink3, marginTop: 3, fontFamily: "'DM Sans',sans-serif" }}>{notif.body}</div>}
                  </div>

                  <div style={{ fontSize: 10, color: ink3, flexShrink: 0, marginTop: 2 }}>{relativeTime(notif.createdAt ?? '')}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
