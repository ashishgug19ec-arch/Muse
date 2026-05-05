'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Tilt } from '@/components/ui/Tilt';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

interface DashboardData {
  totalPoems: number;
  totalFanfics: number;
  totalCollections: number;
  currentStreak: number;
  monthPoems: number;
  monthFanfics: number;
  yearPoems: number;
  yearFanfics: number;
  recentPoems: { id: string; title: string; createdAt: string }[];
  recentFanfics: { id: string; title: string; fandom: string | null; status: string; chapterCount: number; createdAt: string }[];
  weekActivity: { label: string; poemCount: number; fanficCount: number; future: boolean }[];
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
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

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

  const statCards = [
    { label: 'Poems',       val: data ? fmt(data.totalPoems)       : '—', color: '#c084fc', page: 'Poems' },
    { label: 'Fan Fics',    val: data ? fmt(data.totalFanfics)     : '—', color: '#f472b6', page: 'Fan Fiction' },
    { label: 'Collections', val: data ? fmt(data.totalCollections) : '—', color: '#90c8a8', page: 'Collections' },
    { label: 'Day Streak',  val: data ? `${data.currentStreak}d`   : '—', color: '#f0a8c0', page: null },
  ];

  const weekActivity = data?.weekActivity ?? [];
  const maxCount = Math.max(...weekActivity.map(d => (d.poemCount ?? 0) + (d.fanficCount ?? 0)), 1);
  const weekTotal = weekActivity.reduce((s, d) => s + (d.poemCount ?? 0) + (d.fanficCount ?? 0), 0);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 8 }}>Dashboard</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>
          {timeGreeting()},{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? '…'}
          </em>
        </div>
      </div>

      {/* Stat cards: Poems | Fan Fics | Collections | Streak */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {statCards.map(s => (
          <Tilt key={s.label} onClick={s.page ? () => onNav(s.page!) : undefined} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '20px 22px', cursor: s.page ? 'pointer' : 'default' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 300, color: ink, letterSpacing: '-.04em', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: ink3, fontWeight: 300, marginTop: 8, letterSpacing: '.06em' }}>{s.label}</div>
            <div style={{ height: 3, borderRadius: 50, background: `linear-gradient(90deg,${s.color},transparent)`, marginTop: 10, opacity: .6 }} />
          </Tilt>
        ))}
      </div>

      {/* Streak badge + Daily prompt */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: night ? 'rgba(192,132,252,.08)' : 'rgba(192,132,252,.06)', padding: '20px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 120 }}>
          <div style={{ fontSize: 42, fontFamily: "'Playfair Display',serif", fontWeight: 300, color: '#c084fc', lineHeight: 1 }}>
            {data ? data.currentStreak : '—'}
          </div>
          <div style={{ fontSize: 10, color: ink3, letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 6 }}>day streak</div>
          {data && data.currentStreak > 0 && (
            <div style={{ fontSize: 9, color: '#c084fc', marginTop: 4, opacity: .8 }}>🔥 keep going</div>
          )}
        </div>

        <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: night ? 'rgba(208,100,136,.1)' : 'linear-gradient(148deg,rgba(252,228,240,.9),rgba(238,230,255,.75))', padding: '24px 26px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#d06888', marginBottom: 10 }}>Daily Prompt</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 1.8 }}>
            {data?.dailyPrompt ?? '…'}
          </div>
          <button onClick={() => onNav('Sanctuary')} style={{ marginTop: 18, padding: '10px 24px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', letterSpacing: '.04em' }}>Begin writing</button>
        </div>
      </div>

      {/* Recent Poems + Recent Fan Fics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div onClick={() => onNav('Poems')} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 24px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>Recent Poems</div>
            <span style={{ fontSize: 10, color: '#c084fc' }}>View all →</span>
          </div>
          {data === null ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
          ) : data.recentPoems.length === 0 ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>No poems yet.</div>
          ) : data.recentPoems.map((p, i, arr) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c084fc', opacity: .6, flexShrink: 0 }} />
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: ink2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ fontSize: 10, color: ink3, fontWeight: 300, flexShrink: 0 }}>
                {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

        <div onClick={() => onNav('Fan Fiction')} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 24px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>Recent Fan Fics</div>
            <span style={{ fontSize: 10, color: '#f472b6' }}>View all →</span>
          </div>
          {data === null ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
          ) : data.recentFanfics.length === 0 ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>No fan fics yet.</div>
          ) : data.recentFanfics.map((f, i, arr) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f472b6', opacity: .6, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</div>
                {f.fandom && <div style={{ fontSize: 10, color: ink3, fontWeight: 300, marginTop: 1 }}>{f.fandom} · {f.chapterCount} ch</div>}
              </div>
              <div style={{ fontSize: 10, color: ink3, fontWeight: 300, flexShrink: 0 }}>
                {new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Week bar chart — Sun → Sat */}
      <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>This Week</div>
          <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>
            {weekTotal > 0 ? `${weekTotal} piece${weekTotal === 1 ? '' : 's'} written` : 'Nothing written yet this week'}
          </div>
        </div>
        {data === null ? (
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {weekActivity.map((d, i) => {
              const total = (d.poemCount ?? 0) + (d.fanficCount ?? 0);
              const h = total > 0 ? Math.max(24, Math.round((total / maxCount) * 64)) : 20;
              const isHovered = hoveredDay === i;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}
                  onMouseEnter={() => !d.future && setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {isHovered && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                      marginBottom: 8, zIndex: 10,
                      background: night ? 'rgba(30,15,50,.96)' : 'rgba(255,252,255,.98)',
                      border: `1px solid ${cardBd}`,
                      borderRadius: 10, padding: '8px 12px',
                      boxShadow: '0 6px 24px rgba(0,0,0,.15)',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}>
                      <div style={{ fontSize: 11, color: '#c084fc', marginBottom: 3 }}>Poems: {d.poemCount ?? 0}</div>
                      <div style={{ fontSize: 11, color: '#f472b6' }}>Fanfics: {d.fanficCount ?? 0}</div>
                      <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: night ? 'rgba(30,15,50,.96)' : 'rgba(255,252,255,.98)', border: `1px solid ${cardBd}`, borderTop: 'none', borderLeft: 'none', rotate: '45deg' }} />
                    </div>
                  )}
                  {total > 0 && <div style={{ fontSize: 9, color: ink3, fontWeight: 300 }}>{total}</div>}
                  <div style={{
                    width: '100%', height: h, borderRadius: 6,
                    background: d.future
                      ? (night ? 'rgba(255,255,255,.04)' : 'rgba(208,191,240,.12)')
                      : total > 0
                        ? 'linear-gradient(180deg,#c084fc,#7c3aed)'
                        : (night ? 'rgba(255,255,255,.08)' : 'rgba(208,191,240,.28)'),
                    opacity: d.future ? 0.4 : 1,
                    transition: 'height .3s',
                  }} />
                  <span style={{ fontSize: 10, color: ink3, fontWeight: 300, opacity: d.future ? 0.4 : 1 }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
