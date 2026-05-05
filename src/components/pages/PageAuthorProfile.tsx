'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface Props { night: boolean; }

interface DashData {
  stats: { totalPoems: number; totalReaders: number; currentStreak: number } | null;
  recentPoems: { id: string; title: string; createdAt: string }[];
}

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export function PageAuthorProfile({ night }: Props) {
  const { user } = useUser();
  const [data, setData] = useState<DashData | null>(null);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const s = data?.stats;
  const statItems = [
    { label: 'Poems',   value: s ? fmt(s.totalPoems)   : '—' },
    { label: 'Readers', value: s ? fmt(s.totalReaders) : '—' },
    { label: 'Streak',  value: s ? `${s.currentStreak}d` : '—' },
  ];

  const initials = user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '🌸';
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'Poet';

  return (
    <div style={{ padding: '24px 40px', maxWidth: 700, margin: '0 auto' }}>
      {/* Profile header */}
      <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: '#fff', fontWeight: 600,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, color: ink, marginBottom: 4 }}>{displayName}</div>
            <div style={{ fontSize: 12, color: ink3, marginBottom: 14 }}>
              {user?.emailAddresses?.[0]?.emailAddress}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 28, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${cardBd}` }}>
          {statItems.map(st => (
            <div key={st.label}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 300, color: ink }}>{st.value}</div>
              <div style={{ fontSize: 10, color: ink3, fontWeight: 300, letterSpacing: '.06em', marginTop: 2 }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent poems */}
      <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px 28px' }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 16 }}>Recent Poems</div>
        {!data ? (
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
        ) : data.recentPoems.length === 0 ? (
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', color: ink3 }}>No poems yet.</div>
        ) : data.recentPoems.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < data.recentPoems.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c084fc', opacity: .6, flexShrink: 0 }} />
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: ink2, flex: 1 }}>{p.title}</div>
            <div style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>
              {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
