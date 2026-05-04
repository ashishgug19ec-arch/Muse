'use client';

interface Props { night: boolean; }

const notifs = [
  { icon: '♡', text: 'Yuki M. liked your poem "Between two words"', time: '2m ago', unread: true },
  { icon: '💬', text: 'Celia R. commented: "This made me cry in the best way"', time: '18m ago', unread: true },
  { icon: '👥', text: 'Priya S. started following you', time: '1h ago', unread: true },
  { icon: '🌟', text: 'Your poem "Instructions for forgetting" was featured', time: '3h ago', unread: false },
  { icon: '♡', text: 'Mei L. liked your collection "Moonlit Verses"', time: '5h ago', unread: false },
  { icon: '💬', text: 'Sora K. commented: "The third stanza — I felt it in my chest"', time: 'Yesterday', unread: false },
  { icon: '🎯', text: 'You\'ve written 12 days in a row! Keep going.', time: 'Yesterday', unread: false },
  { icon: '🌸', text: 'Your ikigai alignment reached 92% — a new milestone!', time: '2 days ago', unread: false },
];

export function PageNotifications({ night }: Props) {
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Account</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Notifications</div>
        </div>
        <button style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Mark all read</button>
      </div>

      <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
        {notifs.map((n, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
            borderBottom: i < notifs.length - 1 ? `1px solid ${cardBd}` : 'none',
            background: n.unread ? (night ? 'rgba(124,58,237,.06)' : 'rgba(192,132,252,.05)') : 'transparent',
            cursor: 'pointer',
          }}>
            {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc', flexShrink: 0 }} />}
            {!n.unread && <div style={{ width: 6, height: 6, flexShrink: 0 }} />}
            <div style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: n.unread ? ink : ink2, fontWeight: n.unread ? 400 : 300, lineHeight: 1.5 }}>{n.text}</div>
            </div>
            <div style={{ fontSize: 10, color: ink3, flexShrink: 0 }}>{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
