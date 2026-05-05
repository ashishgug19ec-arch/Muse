'use client';
import { useEffect, useState } from 'react';

interface Props { night: boolean; }

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string | null;
  isRead: number;
  createdAt: string;
}

function typeIcon(type: string) {
  if (type === 'like') return '♡';
  if (type === 'comment') return '💬';
  if (type === 'follow') return '👥';
  if (type === 'featured') return '🌟';
  if (type === 'badge') return '🎯';
  if (type === 'streak') return '🔥';
  return '🌸';
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

export function PageNotifications({ night }: Props) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => { setNotifs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function markAllRead() {
    await fetch('/api/notifications/read-all', { method: 'POST' });
    setNotifs(n => n.map(x => ({ ...x, isRead: 1 })));
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Account</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Notifications</div>
        </div>
        {notifs.some(n => !n.isRead) && (
          <button onClick={markAllRead} style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Mark all read</button>
        )}
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
      ) : notifs.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300, marginBottom: 10 }}>All quiet here</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>Notifications will appear when others interact with your work.</div>
        </div>
      ) : (
        <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
          {notifs.map((n, i) => (
            <div key={n.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
              borderBottom: i < notifs.length - 1 ? `1px solid ${cardBd}` : 'none',
              background: !n.isRead ? (night ? 'rgba(124,58,237,.06)' : 'rgba(192,132,252,.05)') : 'transparent',
              cursor: 'pointer',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: !n.isRead ? '#c084fc' : 'transparent', flexShrink: 0 }} />
              <div style={{ fontSize: 20, flexShrink: 0 }}>{typeIcon(n.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: !n.isRead ? ink : ink2, fontWeight: !n.isRead ? 400 : 300, lineHeight: 1.5 }}>{n.title}</div>
                {n.body && <div style={{ fontSize: 11, color: ink3, marginTop: 2 }}>{n.body}</div>}
              </div>
              <div style={{ fontSize: 10, color: ink3, flexShrink: 0 }}>{relativeTime(n.createdAt ?? '')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
