'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const statIcons = [
  <svg key="poems" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M8 8h5M8 16h6"/></svg>,
  <svg key="fanfics" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  <svg key="collections" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  <svg key="streak" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
];

export function PageDashboard({ night }: Props) {
  const { openPage: onNav, nickname } = useMuseStore();
  const { user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Poems',       val: data ? fmt(data.totalPoems)       : '—', color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)', page: 'Poems' },
    { label: 'Fan Fics',    val: data ? fmt(data.totalFanfics)     : '—', color: '#f472b6', grad: 'linear-gradient(135deg,#f472b6,#e05080)', page: 'Fan Fiction' },
    { label: 'Collections', val: data ? fmt(data.totalCollections) : '—', color: '#90c8a8', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)', page: 'Collections' },
    { label: 'Day Streak',  val: data ? `${data.currentStreak}d`   : '—', color: '#f0a8c0', grad: 'linear-gradient(135deg,#f8d890,#c8a050)', page: null },
  ];

  const weekActivity = data?.weekActivity ?? [];
  const maxCount = Math.max(...weekActivity.map(d => (d.poemCount ?? 0) + (d.fanficCount ?? 0)), 1);
  const weekTotal = weekActivity.reduce((s, d) => s + (d.poemCount ?? 0) + (d.fanficCount ?? 0), 0);

  return (
    <div style={{ padding: '36px 44px', maxWidth: 980, margin: '0 auto' }}>

      {/* Greeting */}
      <motion.div
        initial="hidden" animate="show" variants={stagger}
        style={{ marginBottom: 32 }}
      >
        <motion.div variants={fadeUp} style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          Dashboard
        </motion.div>
        <motion.div variants={fadeUp} style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.2 }}>
          {timeGreeting()},{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {nickname ? nickname.charAt(0).toUpperCase() + nickname.slice(1) : (user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? '…')}
          </em>
        </motion.div>
        <motion.div variants={fadeUp} style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>
          Your garden of poetry awaits.
        </motion.div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial="hidden" animate="show" variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}
      >
        {statCards.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Tilt
              onClick={s.page ? () => onNav(s.page!) : undefined}
              style={{
                borderRadius: 22, border: `1.5px solid ${cardBd}`,
                background: cardBg, backdropFilter: 'blur(24px)',
                padding: '22px 24px', cursor: s.page ? 'pointer' : 'default',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: s.grad, opacity: 0.07, filter: 'blur(16px)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ color: s.color, opacity: 0.8 }}>{statIcons[i]}</div>
                {s.page && <span style={{ fontSize: 10, color: ink3 }}>→</span>}
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 300, color: ink, letterSpacing: '-.04em', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: ink3, fontWeight: 300, marginTop: 6, letterSpacing: '.06em' }}>{s.label}</div>
              <div style={{ height: 2.5, borderRadius: 50, background: s.grad, marginTop: 12, opacity: .55 }} />
            </Tilt>
          </motion.div>
        ))}
      </motion.div>

      {/* Streak + Daily prompt row */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14, marginBottom: 14 }}
      >
        {/* Streak orb */}
        <motion.div variants={fadeUp} style={{
          borderRadius: 22, border: `1.5px solid ${night ? 'rgba(192,132,252,.22)' : 'rgba(192,132,252,.35)'}`,
          background: night ? 'rgba(192,132,252,.08)' : 'rgba(245,230,255,.55)',
          backdropFilter: 'blur(20px)',
          padding: '24px 16px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <div style={{ fontSize: 11, color: ink3, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Streak</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 300, color: '#c084fc', lineHeight: 1 }}>
            {data ? data.currentStreak : '—'}
          </div>
          <div style={{ fontSize: 10, color: ink3, letterSpacing: '.06em' }}>days</div>
          {data && data.currentStreak > 0 && (
            <div style={{ fontSize: 11, marginTop: 4, background: 'linear-gradient(135deg,#f8d890,#c8a050)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🔥 keep going
            </div>
          )}
        </motion.div>

        {/* Daily prompt */}
        <motion.div variants={fadeUp} style={{
          borderRadius: 22, border: `1.5px solid ${night ? 'rgba(208,100,136,.22)' : 'rgba(240,168,192,.45)'}`,
          background: night
            ? 'linear-gradient(148deg,rgba(208,100,136,.12),rgba(100,60,180,.1))'
            : 'linear-gradient(148deg,rgba(252,228,240,.9),rgba(238,230,255,.8))',
          backdropFilter: 'blur(20px)',
          padding: '24px 28px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: 'radial-gradient(circle,rgba(240,168,192,.35),transparent)', borderRadius: '50%' }} />
          <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#d06888', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#d06888"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
            Daily Prompt
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 1.8, marginBottom: 16 }}>
            {data?.dailyPrompt ?? '…'}
          </div>
          <button onClick={() => onNav('Sanctuary')} style={{
            padding: '10px 26px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
            color: '#fff', fontSize: 12, fontFamily: "'DM Sans',sans-serif",
            cursor: 'pointer', letterSpacing: '.04em',
            boxShadow: '0 6px 20px rgba(124,58,237,.28)',
          }}>Begin writing →</button>
        </motion.div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}
      >
        {[
          { label: 'New Poem', icon: '✦', page: 'Sanctuary', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)', desc: 'Express your thoughts' },
          { label: 'Write Fan Fic', icon: '⊞', page: 'Fan Fiction', grad: 'linear-gradient(135deg,#f472b6,#c084fc)', desc: 'Continue your story' },
          { label: 'Explore', icon: '◎', page: 'Explore', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)', desc: 'Discover new voices' },
        ].map(q => (
          <motion.div key={q.label} variants={fadeUp}>
            <Tilt
              onClick={() => onNav(q.page)}
              style={{
                borderRadius: 18, border: `1.5px solid ${cardBd}`,
                background: cardBg, backdropFilter: 'blur(20px)',
                padding: '18px 20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: q.grad, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 16, color: '#fff',
              }}>{q.icon}</div>
              <div>
                <div style={{ fontSize: 13, color: ink, fontWeight: 400, fontFamily: "'DM Sans',sans-serif" }}>{q.label}</div>
                <div style={{ fontSize: 11, color: ink3, fontWeight: 300, marginTop: 2 }}>{q.desc}</div>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent poems + fanfics */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}
      >
        {/* Recent poems */}
        <motion.div variants={fadeUp} onClick={() => onNav('Poems')} style={{
          borderRadius: 20, border: `1.5px solid ${cardBd}`,
          background: cardBg, backdropFilter: 'blur(20px)',
          padding: '22px 24px', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M8 8h5M8 16h6"/></svg>
              <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>Recent Poems</span>
            </div>
            <span style={{ fontSize: 10, color: '#c084fc' }}>View all →</span>
          </div>
          {data === null ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
          ) : data.recentPoems.length === 0 ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>No poems yet.</div>
          ) : data.recentPoems.map((p, i, arr) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < arr.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', flexShrink: 0 }} />
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: ink2, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ fontSize: 10, color: ink3, fontWeight: 300, flexShrink: 0 }}>
                {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent fan fics */}
        <motion.div variants={fadeUp} onClick={() => onNav('Fan Fiction')} style={{
          borderRadius: 20, border: `1.5px solid ${cardBd}`,
          background: cardBg, backdropFilter: 'blur(20px)',
          padding: '22px 24px', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>Recent Fan Fics</span>
            </div>
            <span style={{ fontSize: 10, color: '#f472b6' }}>View all →</span>
          </div>
          {data === null ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
          ) : data.recentFanfics.length === 0 ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>No fan fics yet.</div>
          ) : data.recentFanfics.map((f, i, arr) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < arr.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'linear-gradient(135deg,#f472b6,#c084fc)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</div>
                {f.fandom && <div style={{ fontSize: 10, color: ink3, fontWeight: 300, marginTop: 1 }}>{f.fandom} · {f.chapterCount} ch</div>}
              </div>
              <div style={{ fontSize: 10, color: ink3, fontWeight: 300, flexShrink: 0 }}>
                {new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Week activity chart */}
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
        style={{
          borderRadius: 22, border: `1.5px solid ${cardBd}`,
          background: cardBg, backdropFilter: 'blur(20px)',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ink3} strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>This Week</span>
          </div>
          <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>
            {weekTotal > 0 ? `${weekTotal} piece${weekTotal === 1 ? '' : 's'} written` : 'Nothing written yet this week'}
          </div>
        </div>
        {data === null ? (
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 88 }}>
            {weekActivity.map((d, i) => {
              const total = (d.poemCount ?? 0) + (d.fanficCount ?? 0);
              const h = total > 0 ? Math.max(24, Math.round((total / maxCount) * 72)) : 16;
              const isHovered = hoveredDay === i;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}
                  onMouseEnter={() => !d.future && setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {isHovered && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                      marginBottom: 10, zIndex: 10,
                      background: night ? 'rgba(30,15,50,.97)' : 'rgba(255,252,255,.99)',
                      border: `1px solid ${cardBd}`,
                      borderRadius: 12, padding: '8px 14px',
                      boxShadow: '0 8px 28px rgba(0,0,0,.14)',
                      whiteSpace: 'nowrap', pointerEvents: 'none',
                    }}>
                      <div style={{ fontSize: 11, color: '#c084fc', marginBottom: 2 }}>Poems: {d.poemCount ?? 0}</div>
                      <div style={{ fontSize: 11, color: '#f472b6' }}>Fanfics: {d.fanficCount ?? 0}</div>
                    </div>
                  )}
                  {total > 0 && <div style={{ fontSize: 9, color: ink3, fontWeight: 300 }}>{total}</div>}
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: h }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: [0.34, 1.2, 0.64, 1] }}
                    style={{
                      width: '100%', borderRadius: 6,
                      background: d.future
                        ? (night ? 'rgba(255,255,255,.04)' : 'rgba(208,191,240,.12)')
                        : total > 0
                          ? 'linear-gradient(180deg,#c084fc,#7c3aed)'
                          : (night ? 'rgba(255,255,255,.08)' : 'rgba(208,191,240,.28)'),
                      opacity: d.future ? 0.4 : 1,
                    }}
                  />
                  <span style={{ fontSize: 10, color: ink3, fontWeight: 300, opacity: d.future ? 0.4 : 1 }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

    </div>
  );
}
