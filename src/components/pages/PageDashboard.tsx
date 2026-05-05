'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Tilt } from '@/components/ui/Tilt';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

interface DashboardData {
  stats: { currentStreak: number; totalPoems: number; totalReaders: number } | null;
  recentPoems: { id: string; title: string; createdAt: string }[];
  weekActivity: { date: string; count: number }[];
  dailyPrompt: string;
}

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function PageDashboard({ night }: Props) {
  const { openPage: onNav } = useMuseStore();
  const { user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const s = data?.stats;
  const statCards = [
    { label: 'Poems',       val: s ? fmt(s.totalPoems)    : '—', color: '#c084fc' },
    { label: 'Streak',      val: s ? `${s.currentStreak}d`: '—', color: '#f0a8c0' },
    { label: 'Collections', val: '—',                            color: '#90b898' },
    { label: 'Readers',     val: s ? fmt(s.totalReaders)  : '—', color: '#c8a050' },
  ];

  const weekDays = ['S','M','T','W','T','F','S'];
  const weekActivity = data?.weekActivity ?? [];
  const maxCount = Math.max(...weekActivity.map(d => d.count), 1);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 8 }}>Dashboard</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>
          {timeGreeting()},{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? '…'}
          </em>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {statCards.map(s => (
          <Tilt key={s.label} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '20px 22px' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 300, color: ink, letterSpacing: '-.04em', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: ink3, fontWeight: 300, marginTop: 6, letterSpacing: '.06em' }}>{s.label}</div>
            <div style={{ height: 3, borderRadius: 50, background: `linear-gradient(90deg,${s.color},transparent)`, marginTop: 10, opacity: .6 }} />
          </Tilt>
        ))}
      </div>

      {/* Daily prompt + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14 }}>
        <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: night ? 'rgba(208,100,136,.1)' : 'linear-gradient(148deg,rgba(252,228,240,.9),rgba(238,230,255,.75))', padding: '24px 26px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#d06888', marginBottom: 10 }}>Daily Prompt</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 1.8 }}>
            {data?.dailyPrompt ?? '…'}
          </div>
          <button onClick={() => onNav('Sanctuary')} style={{ marginTop: 18, padding: '10px 24px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', letterSpacing: '.04em' }}>Begin writing</button>
        </div>

        <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px 26px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Recent Poems</div>
          {data === null ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
          ) : data.recentPoems.length === 0 ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>No poems yet — write your first one.</div>
          ) : data.recentPoems.slice(0, 3).map((p, i, arr) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < arr.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc', opacity: .6, flexShrink: 0 }} />
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: ink2, flex: 1 }}>{p.title}</div>
              <div style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>
                {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week activity */}
      <div style={{ marginTop: 14, borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 26px' }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 16 }}>This Week</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {weekDays.map((d, i) => {
            const count = weekActivity[i]?.count ?? 0;
            const h = Math.max(20, Math.round((count / maxCount) * 60));
            const active = count > 0;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: active ? h : 20, borderRadius: 6, background: active ? 'linear-gradient(180deg,#c084fc,#7c3aed)' : (night ? 'rgba(255,255,255,.08)' : 'rgba(208,191,240,.28)'), transition: 'height .3s' }} />
                <span style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>{d}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
