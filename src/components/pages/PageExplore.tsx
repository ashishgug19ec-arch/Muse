'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

type Tab = 'poems' | 'fanfics';

interface ExplorePoem {
  poem: {
    id: string; title: string; body: string; type: string | null; mood: string | null;
    readCount: number | null; likeCount: number | null; createdAt: string; coverImageUrl: string | null;
  };
  author: { displayName: string | null; username: string | null; avatarUrl: string | null };
}

interface ExploreFanfic {
  fanfic: {
    id: string; title: string; blurb: string | null; fandom: string | null; status: string;
    chapterCount: number | null; readCount: number | null; createdAt: string; coverImageUrl: string | null;
  };
  author: { displayName: string | null; username: string | null; avatarUrl: string | null };
}

const MOODS = [
  { label: 'All moods', icon: '✦' },
  { label: 'Reflective', icon: '🌙' },
  { label: 'Melancholic', icon: '💔' },
  { label: 'Peaceful', icon: '🌿' },
  { label: 'Hopeful', icon: '🌅' },
  { label: 'Yearning', icon: '🌸' },
  { label: 'Fierce', icon: '⚡' },
];

const FORMS = [
  { name: 'Haiku', desc: '5–7–5 syllables', icon: '🍃', color: '#90c8a8', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)' },
  { name: 'Free verse', desc: 'Unbound rhythm', icon: '〰️', color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
  { name: 'Sonnet', desc: '14 lines', icon: '🌹', color: '#f472b6', grad: 'linear-gradient(135deg,#f472b6,#d06888)' },
  { name: 'Tanka', desc: '5-7-5-7-7', icon: '🌊', color: '#90a8c0', grad: 'linear-gradient(135deg,#90a8c0,#5e7a9a)' },
  { name: 'Ghazal', desc: 'Couplets & radif', icon: '🌙', color: '#c8a050', grad: 'linear-gradient(135deg,#f8d890,#c8a050)' },
  { name: 'Ode', desc: 'Lyric praise', icon: '🌿', color: '#90c8a8', grad: 'linear-gradient(135deg,#a8d8b8,#5e9975)' },
];

const STATUS_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  ongoing:  { text: '#5e9975', bg: 'rgba(144,200,168,.15)', border: 'rgba(144,200,168,.35)' },
  complete: { text: '#c084fc', bg: 'rgba(192,132,252,.12)', border: 'rgba(192,132,252,.3)' },
  hiatus:   { text: '#c8a050', bg: 'rgba(200,160,80,.12)',  border: 'rgba(200,160,80,.3)' },
};

const CARD_GRADS = [
  { bg: 'rgba(200,160,80,.1)',    bd: 'rgba(200,160,80,.28)',    color: '#c8a050', grad: 'linear-gradient(135deg,#f8d890,#c8a050)' },
  { bg: 'rgba(192,132,252,.1)',   bd: 'rgba(192,132,252,.28)',   color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
  { bg: 'rgba(244,114,182,.1)',   bd: 'rgba(244,114,182,.28)',   color: '#f472b6', grad: 'linear-gradient(135deg,#f472b6,#d06888)' },
  { bg: 'rgba(144,200,168,.1)',   bd: 'rgba(144,200,168,.28)',   color: '#90c8a8', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)' },
  { bg: 'rgba(144,168,192,.1)',   bd: 'rgba(144,168,192,.28)',   color: '#90a8c0', grad: 'linear-gradient(135deg,#90a8c0,#5e7a9a)' },
];

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(str: string, n: number) {
  return str.length <= n ? str : str.slice(0, n) + '…';
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function Spinner({ color }: { color: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
      </motion.div>
    </div>
  );
}

export function PageExplore({ night }: Props) {
  const [tab, setTab] = useState<Tab>('poems');
  const [mood, setMood] = useState('All moods');
  const [search, setSearch] = useState('');
  const [poems, setPoems] = useState<ExplorePoem[]>([]);
  const [fanfics, setFanfics] = useState<ExploreFanfic[]>([]);
  const [loading, setLoading] = useState(true);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/explore/poems?limit=24').then(r => r.json()),
      fetch('/api/explore/fanfics?limit=20').then(r => r.json()),
    ]).then(([p, f]) => {
      setPoems(Array.isArray(p) ? p : []);
      setFanfics(Array.isArray(f) ? f : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredPoems = poems.filter(item => {
    const matchMood = mood === 'All moods' || item.poem.mood?.toLowerCase() === mood.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q ||
      item.poem.title.toLowerCase().includes(q) ||
      (item.author.displayName ?? item.author.username ?? '').toLowerCase().includes(q);
    return matchMood && matchSearch;
  });

  const filteredFanfics = fanfics.filter(item => {
    const q = search.toLowerCase();
    return !q ||
      item.fanfic.title.toLowerCase().includes(q) ||
      (item.fanfic.fandom ?? '').toLowerCase().includes(q) ||
      (item.author.displayName ?? item.author.username ?? '').toLowerCase().includes(q);
  });

  const featuredPoems = filteredPoems.slice(0, 3);
  const morePoems     = filteredPoems.slice(3, 9);

  return (
    <div style={{ padding: '0 0 60px' }}>

      {/* Hero */}
      <div style={{
        padding: '48px 44px 40px',
        background: night
          ? 'linear-gradient(135deg,rgba(124,58,237,.18) 0%,rgba(208,100,136,.1) 50%,rgba(144,200,168,.08) 100%)'
          : 'linear-gradient(135deg,rgba(245,230,255,.9) 0%,rgba(252,228,240,.8) 50%,rgba(232,242,236,.7) 100%)',
        borderBottom: `1px solid ${cardBd}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: 60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,.2),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 100, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,.15),transparent 70%)', pointerEvents: 'none' }} />

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
            Words written by women, for everyone. Find your next favourite voice.
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
            placeholder="Search poems, fanfics, authors…"
            style={{
              width: '100%', padding: '13px 20px 13px 46px', borderRadius: 50,
              border: `1.5px solid ${cardBd}`,
              background: night ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.88)',
              backdropFilter: 'blur(20px)',
              color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none',
              boxShadow: '0 4px 20px rgba(124,58,237,.08)', boxSizing: 'border-box',
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

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'inline-flex', background: night ? 'rgba(255,255,255,.04)' : 'rgba(245,240,255,.85)', borderRadius: 50, padding: 3, marginBottom: 28, border: `1px solid ${cardBd}` }}
        >
          {(['poems', 'fanfics'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 22px', borderRadius: 50, border: 'none', cursor: 'pointer',
              fontSize: 12, fontFamily: "'DM Sans',sans-serif",
              background: tab === t ? 'linear-gradient(135deg,#c084fc,#7c3aed)' : 'transparent',
              color: tab === t ? '#fff' : ink3,
              transition: 'all .2s',
            }}>{t === 'fanfics' ? 'Fan Fiction' : 'Poems'}</button>
          ))}
        </motion.div>

        {/* ── Poems tab ── */}
        {tab === 'poems' && (
          <>
            {/* Mood chips */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}
            >
              {MOODS.map(m => (
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
                ><span>{m.icon}</span>{m.label}</motion.button>
              ))}
            </motion.div>

            {loading ? <Spinner color="#c084fc" /> : filteredPoems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 14, opacity: .3 }}>🌸</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300 }}>No poems found</div>
                <p style={{ fontSize: 13, color: ink3, marginTop: 8 }}>{search ? 'Try a different search.' : 'No poems published yet — be the first!'}</p>
              </div>
            ) : (
              <motion.div initial="hidden" animate="show" variants={stagger}>

                {/* Featured */}
                {featuredPoems.length > 0 && (
                  <>
                    <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                      <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#c8a050,transparent)' }} />
                      <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c8a050' }}>Featured</span>
                      <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,transparent,#c8a050)' }} />
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                      {featuredPoems.map((item, i) => {
                        const g = CARD_GRADS[i % CARD_GRADS.length];
                        const author = item.author.displayName ?? item.author.username ?? 'Poet';
                        const excerpt = truncate(plainText(item.poem.body), 120);
                        return (
                          <motion.div key={item.poem.id} variants={fadeUp}>
                            <Tilt style={{
                              borderRadius: 22, border: `1.5px solid ${g.bd}`,
                              background: g.bg, backdropFilter: 'blur(20px)',
                              cursor: 'pointer', position: 'relative', overflow: 'hidden',
                            }}>
                              {item.poem.coverImageUrl && (
                                <div style={{ width: '100%', aspectRatio: '16/9', background: `url(${item.poem.coverImageUrl}) center/cover no-repeat` }} />
                              )}
                              <div style={{ padding: '24px', position: 'relative' }}>
                              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle,${g.color}25,transparent 70%)`, pointerEvents: 'none', borderRadius: '50%' }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                <span style={{ fontSize: 10, padding: '3px 12px', borderRadius: 50, background: g.bg, color: g.color, border: `1px solid ${g.bd}`, letterSpacing: '.08em' }}>
                                  {item.poem.type ?? item.poem.mood ?? 'Poem'}
                                </span>
                                <span style={{ fontSize: 11, color: ink3, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={ink3} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                  {item.poem.likeCount ?? 0}
                                </span>
                              </div>
                              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400, color: ink, marginBottom: 10, lineHeight: 1.3 }}>{item.poem.title}</h3>
                              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.9, marginBottom: 14 }}>{excerpt}</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: g.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 600 }}>{author[0].toUpperCase()}</div>
                                <span style={{ fontSize: 11, color: ink3 }}>by {author}</span>
                              </div>
                              </div>
                            </Tilt>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* More poems */}
                {morePoems.length > 0 && (
                  <>
                    <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                      <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
                      <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#f472b6' }}>More from the garden</span>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 40 }}>
                      {morePoems.map((item, i) => {
                        const g = CARD_GRADS[i % CARD_GRADS.length];
                        const author = item.author.displayName ?? item.author.username ?? 'Poet';
                        return (
                          <motion.div key={item.poem.id} variants={fadeUp}
                            whileHover={{ y: -3 }}
                            style={{ borderRadius: 16, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                          >
                            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: g.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 600 }}>{i + 4}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 400, color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.poem.title}</div>
                              <div style={{ fontSize: 11, color: ink3, marginTop: 2 }}>by {author}{item.poem.type ? ` · ${item.poem.type}` : ''}</div>
                            </div>
                            <span style={{ fontSize: 11, color: ink3, display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill={g.color} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                              {item.poem.likeCount ?? 0}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Browse by Form */}
                <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#90c8a8,transparent)' }} />
                  <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#5e9975' }}>Browse by Form</span>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {FORMS.map(f => (
                    <motion.div key={f.name} variants={fadeUp}>
                      <Tilt style={{ borderRadius: 18, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
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
            )}
          </>
        )}

        {/* ── Fan Fiction tab ── */}
        {tab === 'fanfics' && (
          <motion.div initial="hidden" animate="show" variants={stagger}>
            {loading ? <Spinner color="#f472b6" /> : filteredFanfics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 14, opacity: .3 }}>📖</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300 }}>No stories found</div>
                <p style={{ fontSize: 13, color: ink3, marginTop: 8 }}>{search ? 'Try a different search.' : 'No fan fiction published yet — be the first!'}</p>
              </div>
            ) : (
              <>
                <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
                  <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#f472b6' }}>Stories from the community</span>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
                  {filteredFanfics.map((item, i) => {
                    const g = CARD_GRADS[i % CARD_GRADS.length];
                    const author = item.author.displayName ?? item.author.username ?? 'Writer';
                    const sc = STATUS_COLORS[item.fanfic.status] ?? STATUS_COLORS.ongoing;
                    return (
                      <motion.div key={item.fanfic.id} variants={fadeUp}
                        whileHover={{ y: -4, scale: 1.008 }}
                        style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: night ? cardBg : g.bg, backdropFilter: 'blur(20px)', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex' }}
                      >
                        {item.fanfic.coverImageUrl && (
                          <div style={{ width: 90, flexShrink: 0, background: `url(${item.fanfic.coverImageUrl}) center/cover no-repeat`, borderRadius: '22px 0 0 22px' }} />
                        )}
                        <div style={{ flex: 1, padding: '24px 26px', position: 'relative', minWidth: 0 }}>
                        <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, background: `radial-gradient(circle,${g.color}20,transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
                        <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 12 }}>
                          {item.fanfic.fandom && (
                            <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: 'rgba(192,132,252,.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,.3)' }}>{item.fanfic.fandom}</span>
                          )}
                          <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, textTransform: 'capitalize' }}>{item.fanfic.status}</span>
                          <span style={{ fontSize: 10, color: ink3, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                            {item.fanfic.chapterCount ?? 0} ch
                          </span>
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 400, color: ink, marginBottom: 10, lineHeight: 1.3 }}>{item.fanfic.title}</h3>
                        {item.fanfic.blurb && (
                          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 14 }}>
                            "{truncate(item.fanfic.blurb, 110)}"
                          </p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: g.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 600 }}>{author[0].toUpperCase()}</div>
                            <span style={{ fontSize: 11, color: ink3 }}>{author}</span>
                          </div>
                          <span style={{ fontSize: 10, color: ink3, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            {(item.fanfic.readCount ?? 0).toLocaleString()} reads
                          </span>
                        </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
