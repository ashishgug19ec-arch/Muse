'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

interface DashData {
  stats: { totalPoems: number; totalReaders: number; currentStreak: number } | null;
  recentPoems: { id: string; title: string; createdAt: string; mood?: string | null }[];
}

interface Profile {
  username: string | null;
  bio: string | null;
  pronouns: string | null;
  location: string | null;
  whyYouWrite: string | null;
}

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

const moodColors: Record<string, string> = {
  Reflective: '#c084fc', Melancholic: '#90a8c0', Peaceful: '#5e9975',
  Hopeful: '#c8a050', Yearning: '#d06888', Fierce: '#f472b6',
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function PageAuthorProfile({ night }: Props) {
  const { user } = useUser();
  const { openPage } = useMuseStore();
  const [data, setData]       = useState<DashData | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then(r => r.json()),
      fetch('/api/profile/me').then(r => r.ok ? r.json() : null),
    ]).then(([d, p]) => {
      setData(d);
      setProfile(p);
    }).catch(() => {});
  }, []);

  const s = data?.stats;
  const statItems = [
    { label: 'Poems',   value: s ? fmt(s.totalPoems)   : '—', color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
    { label: 'Readers', value: s ? fmt(s.totalReaders) : '—', color: '#90c8a8', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)' },
    { label: 'Streak',  value: s ? `${s.currentStreak}d` : '—', color: '#f472b6', grad: 'linear-gradient(135deg,#f472b6,#d06888)' },
  ];

  const initials = user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '🌸';
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'Poet';

  return (
    <div style={{ padding: '36px 44px', maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>My Profile</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>
          Author{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</em>
        </h1>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Profile hero */}
        <motion.div variants={fadeUp} style={{ borderRadius: 24, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
          {/* Cover */}
          <div style={{ height: 80, background: n ? 'linear-gradient(135deg,rgba(124,58,237,.25),rgba(208,100,136,.15))' : 'linear-gradient(135deg,rgba(238,230,255,.9),rgba(252,228,240,.85))', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, right: 40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,.2),transparent 70%)', pointerEvents: 'none' }} />
          </div>

          {/* Identity */}
          <div style={{ padding: '0 24px 24px', marginTop: -36, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', fontWeight: 600, flexShrink: 0, boxShadow: '0 4px 20px rgba(124,58,237,.35)', border: `3px solid ${n ? '#0f0620' : '#fff'}` }}>
                {initials}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, color: ink, lineHeight: 1.2 }}>{displayName}</div>
                {profile?.username && (
                  <div style={{ fontSize: 12, color: '#c084fc', marginTop: 3, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, letterSpacing: '.01em' }}>@{profile.username}</div>
                )}
                {profile?.pronouns && <div style={{ fontSize: 11, color: ink3, marginTop: 2 }}>{profile.pronouns}</div>}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} onClick={() => openPage('Settings')} style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                Edit profile
              </motion.button>
            </div>

            {profile?.bio && (
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 14, padding: '12px 0', borderTop: `1px solid ${cardBd}` }}>{profile.bio}</div>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {profile?.location && (
                <span style={{ fontSize: 11, color: ink3, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {profile.location}
                </span>
              )}
              {user?.emailAddresses?.[0]?.emailAddress && (
                <span style={{ fontSize: 11, color: ink3, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {user.emailAddresses[0].emailAddress}
                </span>
              )}
            </div>

            {profile?.whyYouWrite && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12, background: n ? 'rgba(192,132,252,.06)' : 'rgba(192,132,252,.06)', border: `1px solid rgba(192,132,252,.2)`, fontSize: 12, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>
                ✦ {profile.whyYouWrite}
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {statItems.map(st => (
            <div key={st.label} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: -12, right: -12, width: 56, height: 56, borderRadius: '50%', background: st.grad, opacity: .08, filter: 'blur(12px)' }} />
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 300, color: st.color, lineHeight: 1 }}>{st.value}</div>
              <div style={{ fontSize: 10, color: ink3, marginTop: 4, letterSpacing: '.06em' }}>{st.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Recent poems */}
        <motion.div variants={fadeUp} style={{ borderRadius: 24, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 16, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3 }}>Recent Poems</span>
          </div>
          {!data ? (
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
          ) : data.recentPoems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontStyle: 'italic', color: ink3 }}>No poems yet.</div>
            </div>
          ) : (
            <div>
              {data.recentPoems.map((p, i) => {
                const mc = p.mood ? (moodColors[p.mood] ?? '#c084fc') : '#c084fc';
                return (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < data.recentPoems.length - 1 ? `1px solid ${cardBd}` : 'none', cursor: 'pointer' }}
                    whileHover={{ x: 2 }}
                  >
                    <div style={{ width: 4, height: 28, borderRadius: 3, background: mc, opacity: .6, flexShrink: 0 }} />
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: ink2, flex: 1 }}>{p.title}</div>
                    {p.mood && <span style={{ fontSize: 9, padding: '2px 9px', borderRadius: 50, background: `${mc}18`, color: mc, border: `1px solid ${mc}35` }}>{p.mood}</span>}
                    <div style={{ fontSize: 10, color: ink3, flexShrink: 0 }}>
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
