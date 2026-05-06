'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

const featured = [
  {
    title: 'Autumn Rain',
    author: 'Yuki M.',
    form: 'Haiku',
    excerpt: 'Autumn rain taps soft\non the window where I wait\nfor your voice to come',
    likes: 284,
    color: '#c8a050',
    grad: 'linear-gradient(135deg,#f8d890,#c8a050)',
    bg: 'rgba(200,160,80,.12)',
    bd: 'rgba(200,160,80,.28)',
  },
  {
    title: 'Letters to No One',
    author: 'Celia R.',
    form: 'Free verse',
    excerpt: 'I have written you into existence\nwith borrowed metaphors and\nthe ache of 3am',
    likes: 512,
    color: '#c084fc',
    grad: 'linear-gradient(135deg,#c084fc,#7c3aed)',
    bg: 'rgba(192,132,252,.1)',
    bd: 'rgba(192,132,252,.28)',
  },
  {
    title: 'First Bloom',
    author: 'Priya S.',
    form: 'Tanka',
    excerpt: 'Cherry petals fall\ninto the space between us —\nspring is a question',
    likes: 197,
    color: '#f472b6',
    grad: 'linear-gradient(135deg,#f472b6,#d06888)',
    bg: 'rgba(244,114,182,.1)',
    bd: 'rgba(244,114,182,.28)',
  },
];

const trending = [
  { title: 'Moss Cathedral', author: 'Riya B.', form: 'Ode', likes: 88, color: '#90c8a8', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)' },
  { title: 'Midnight Jasmine', author: 'Sana K.', form: 'Ghazal', likes: 143, color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
  { title: 'Salt & Sea Glass', author: 'Mia T.', form: 'Elegy', likes: 67, color: '#90a8c0', grad: 'linear-gradient(135deg,#90a8c0,#5e7a9a)' },
  { title: 'Paper Lanterns', author: 'Jun L.', form: 'Haiku', likes: 201, color: '#f8d890', grad: 'linear-gradient(135deg,#f8d890,#c8a050)' },
  { title: 'Unspoken', author: 'Aisha O.', form: 'Sonnet', likes: 389, color: '#f0a8c0', grad: 'linear-gradient(135deg,#f0a8c0,#d06888)' },
  { title: 'The River Remembers', author: 'Leila P.', form: 'Free verse', likes: 256, color: '#c084fc', grad: 'linear-gradient(135deg,#9b72cf,#7c3aed)' },
];

const moods = [
  { label: 'All moods', icon: '✦' },
  { label: 'Night', icon: '🌙' },
  { label: 'Spring', icon: '🌸' },
  { label: 'Loss', icon: '💔' },
  { label: 'Nature', icon: '🌿' },
  { label: 'Dawn', icon: '🌅' },
  { label: 'Hope', icon: '✨' },
];

const forms = [
  { name: 'Haiku', desc: '5–7–5 syllables', icon: '🍃', color: '#90c8a8', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)' },
  { name: 'Free verse', desc: 'Unbound rhythm', icon: '〰️', color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
  { name: 'Sonnet', desc: '14 lines', icon: '🌹', color: '#f472b6', grad: 'linear-gradient(135deg,#f472b6,#d06888)' },
  { name: 'Tanka', desc: '5-7-5-7-7', icon: '🌊', color: '#90a8c0', grad: 'linear-gradient(135deg,#90a8c0,#5e7a9a)' },
  { name: 'Ghazal', desc: 'Couplets & radif', icon: '🌙', color: '#c8a050', grad: 'linear-gradient(135deg,#f8d890,#c8a050)' },
  { name: 'Ode', desc: 'Lyric praise', icon: '🌿', color: '#90c8a8', grad: 'linear-gradient(135deg,#a8d8b8,#5e9975)' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function PageExplore({ night }: Props) {
  const [mood, setMood] = useState('All moods');
  const [search, setSearch] = useState('');

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '0 0 60px' }}>

      {/* Hero banner */}
      <div style={{
        padding: '48px 44px 40px',
        background: night
          ? 'linear-gradient(135deg,rgba(124,58,237,.18) 0%,rgba(208,100,136,.1) 50%,rgba(144,200,168,.08) 100%)'
          : 'linear-gradient(135deg,rgba(245,230,255,.9) 0%,rgba(252,228,240,.8) 50%,rgba(232,242,236,.7) 100%)',
        borderBottom: `1px solid ${cardBd}`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -40, right: 60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,.2),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 100, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,.15),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 20, left: 300, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(144,200,168,.15),transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>Discover</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 300, letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: 8 }}>
            <span style={{ background: 'linear-gradient(135deg,#c084fc,#9b72cf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Explore</span>{' '}
            <span style={{ color: ink }}>the garden</span>
          </h1>
          <p style={{ fontSize: 14, color: ink3, fontWeight: 300, maxWidth: 420, lineHeight: 1.6 }}>
            Poems written by women, for everyone. Find your next favourite voice.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          style={{ position: 'relative', marginTop: 24, maxWidth: 500 }}
        >
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search poems, forms, moods, authors…"
            style={{
              width: '100%', padding: '13px 20px 13px 46px', borderRadius: 50,
              border: `1.5px solid ${cardBd}`,
              background: night ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.88)',
              backdropFilter: 'blur(20px)',
              color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none',
              boxShadow: '0 4px 20px rgba(124,58,237,.08)',
            }}
          />
          <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: ink3 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: ink3, fontSize: 18 }}>×</button>
          )}
        </motion.div>
      </div>

      <div style={{ padding: '28px 44px 0' }}>

        {/* Mood filters */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}
        >
          {moods.map(m => (
            <motion.button
              key={m.label}
              onClick={() => setMood(m.label)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
              style={{
                padding: '7px 16px', borderRadius: 50, fontSize: 12, cursor: 'pointer',
                background: mood === m.label ? 'linear-gradient(135deg,rgba(192,132,252,.25),rgba(124,58,237,.18))' : (night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.65)'),
                border: `1px solid ${mood === m.label ? 'rgba(192,132,252,.5)' : cardBd}`,
                color: mood === m.label ? '#c084fc' : ink3,
                fontFamily: "'DM Sans',sans-serif",
                display: 'flex', alignItems: 'center', gap: 5,
                backdropFilter: 'blur(12px)', transition: 'all .2s',
              }}
            >
              <span>{m.icon}</span> {m.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Today */}
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#c8a050,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c8a050' }}>Featured Today</span>
            <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,transparent,#c8a050)' }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
            {featured.map(p => (
              <motion.div key={p.title} variants={fadeUp}>
                <Tilt style={{
                  borderRadius: 22,
                  border: `1.5px solid ${p.bd}`,
                  background: night ? `${p.bg} ` : `${p.bg}`,
                  backdropFilter: 'blur(20px)',
                  padding: '24px 24px',
                  cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Glow orb */}
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle,${p.color}25,transparent 70%)`, pointerEvents: 'none', borderRadius: '50%' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <span style={{ fontSize: 10, padding: '3px 12px', borderRadius: 50, background: p.bg, color: p.color, border: `1px solid ${p.bd}`, letterSpacing: '.08em' }}>{p.form}</span>
                    <span style={{ fontSize: 11, color: ink3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ink3} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {p.likes}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400, color: ink, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h3>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.9, marginBottom: 14, whiteSpace: 'pre-line' }}>{p.excerpt}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 600 }}>{p.author[0]}</div>
                    <span style={{ fontSize: 11, color: ink3 }}>by {p.author}</span>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>

          {/* Trending */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#f472b6' }}>Trending This Week</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 40 }}>
            {trending.map((p, i) => (
              <motion.div key={p.title} variants={fadeUp}
                whileHover={{ y: -3 }}
                style={{
                  borderRadius: 16,
                  border: `1.5px solid ${cardBd}`,
                  background: cardBg, backdropFilter: 'blur(18px)',
                  padding: '16px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'box-shadow .25s',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: '#fff', fontWeight: 600,
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 400, color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: ink3, marginTop: 2 }}>by {p.author} · {p.form}</div>
                </div>
                <span style={{ fontSize: 11, color: ink3, display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={p.color} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  {p.likes}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Browse by Form */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#90c8a8,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#5e9975' }}>Browse by Form</span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {forms.map(f => (
              <motion.div key={f.name} variants={fadeUp}>
                <Tilt style={{
                  borderRadius: 18, border: `1.5px solid ${cardBd}`,
                  background: cardBg, backdropFilter: 'blur(18px)',
                  padding: '18px 20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: f.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 400, color: ink, lineHeight: 1.2 }}>{f.name}</div>
                    <div style={{ fontSize: 11, color: ink3, marginTop: 3 }}>{f.desc}</div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
