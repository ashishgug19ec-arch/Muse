'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Nav } from '@/components/Nav';
import { Drawer } from '@/components/Drawer';
import { AppOverlay } from '@/components/AppOverlay';
import { MeshBackground } from '@/components/MeshBackground';
import { SakuraPetals } from '@/components/SakuraPetals';
import { Tilt } from '@/components/ui/Tilt';
import { useMuseStore } from '@/lib/store';

const poems = [
  { text: 'between two words / silence blooms like peonies— / you are the garden', author: 'Luna A.' },
  { text: 'she keeps the moon / in her left pocket for / emergencies, just in case', author: 'Yuki M.' },
  { text: 'the thing about heartbreak / is it always surprises you / even the third time', author: 'Celia R.' },
  { text: 'dawn tastes like copper / and unfinished sentences / I leave on purpose', author: 'Priya S.' },
  { text: 'soft things are the / bravest things — a peony / opens anyway', author: 'Mei L.' },
];

const bentoItems = [
  {
    id: 'sanctuary',
    label: 'Writing Sanctuary',
    symbol: '✍',
    desc: 'A distraction-free space where your words bloom in silence.',
    span: '2',
    bg: 'linear-gradient(145deg,rgba(237,233,254,.92),rgba(252,228,240,.82))',
    bd: 'rgba(196,181,253,.48)',
    darkBg: 'linear-gradient(145deg,rgba(124,58,237,.18),rgba(208,100,136,.1))',
    darkBd: 'rgba(160,124,200,.3)',
    dark: false,
  },
  {
    id: 'collections',
    label: 'Collections',
    symbol: '◈',
    desc: 'Curate your poems into beautiful, themed gardens.',
    span: '1',
    bg: 'rgba(248,245,255,.82)',
    bd: 'rgba(196,181,253,.38)',
    darkBg: 'rgba(255,255,255,.04)',
    darkBd: 'rgba(160,124,200,.22)',
    dark: false,
  },
  {
    id: 'ikigai',
    label: 'Ikigai Journal',
    symbol: '✦',
    desc: 'Track your alignment with purpose across four pillars.',
    span: '1',
    bg: 'linear-gradient(145deg,rgba(237,233,254,.85),rgba(245,240,255,.9))',
    bd: 'rgba(196,181,253,.44)',
    darkBg: 'linear-gradient(145deg,rgba(200,160,80,.1),rgba(248,216,144,.06))',
    darkBd: 'rgba(200,160,80,.25)',
    dark: false,
  },
  {
    id: 'explore',
    label: 'Explore',
    symbol: '⊕',
    desc: 'Discover poetry from writers who feel what you feel.',
    span: '1',
    bg: 'rgba(248,245,255,.82)',
    bd: 'rgba(196,181,253,.38)',
    darkBg: 'rgba(255,255,255,.04)',
    darkBd: 'rgba(160,124,200,.22)',
    dark: false,
  },
  {
    id: 'fan-fiction',
    label: 'Fan Fiction',
    symbol: '◉',
    desc: 'Poetic reimaginings of the worlds and characters you love.',
    span: '2',
    bg: 'linear-gradient(145deg,#1a1130,#2c1060)',
    bd: 'rgba(167,139,250,.3)',
    darkBg: 'linear-gradient(145deg,#12081e,#200c18)',
    darkBd: 'rgba(160,124,200,.28)',
    dark: true,
  },
];

const stats = [
  { n: '47k', label: 'Poems published' },
  { n: '12k', label: 'Writers blooming' },
  { n: '4.2M', label: 'Words written' },
  { n: '98%', label: 'Would recommend' },
];

const testimonials = [
  { quote: "Muse gave me back my voice after years of silence. I didn't know I still had poems in me.", name: 'Yuki M.', role: 'Poet · 3 years on Muse' },
  { quote: "The Ikigai journal changed how I think about writing — and about myself.", name: 'Celia R.', role: 'Writer · 18 months on Muse' },
  { quote: "Every morning I open the sanctuary before I open anything else.", name: 'Priya S.', role: 'Poet · 2 years on Muse' },
];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.11 } },
};

export default function HomeLanding() {
  const { openPage, night } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get('page');
    if (page && isLoaded && isSignedIn) {
      openPage(page);
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, searchParams]);

  function handleBeginWriting() {
    if (!isLoaded) return;
    if (isSignedIn) openPage('write');
    else router.push('/sign-up');
  }

  const ink    = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2   = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3   = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(167,139,250,.2)'  : 'rgba(196,181,253,.42)';
  const cardBg = night ? 'rgba(255,255,255,.04)' : 'rgba(245,240,255,.78)';
  const purpleAccent = '#a78bfa';

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <MeshBackground night={night} />
      <SakuraPetals night={night} />
      <Nav />
      <Drawer />
      <AppOverlay />

      {/* ══ HERO ══ */}
      <section style={{
        minHeight: '92vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 24px 80px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Eyebrow pill */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: .7, ease: [.34,1.2,.64,1] }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              padding: '6px 18px 6px 14px', borderRadius: 50,
              background: 'rgba(196,181,253,.18)',
              border: '1px solid rgba(196,181,253,.45)',
              backdropFilter: 'blur(14px)',
              marginBottom: 32,
            }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: '#a78bfa',
              boxShadow: '0 0 10px rgba(167,139,250,.9)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase',
              color: '#a78bfa', fontWeight: 400,
            }}>
              A sanctuary for women who write
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: .95, ease: [.34,1.2,.64,1] }}
            style={{
              fontFamily: "'Playfair Display',serif", fontWeight: 300,
              fontSize: 'clamp(44px,7.5vw,96px)', lineHeight: 1.08,
              letterSpacing: '-.045em',
              background: night
                ? 'linear-gradient(135deg,rgba(230,220,255,.96),rgba(196,181,253,.9),rgba(232,121,249,.8))'
                : 'linear-gradient(135deg,#2d1b4e,#5b21b6,#7c3aed,#a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 24, maxWidth: 820,
            }}
          >
            Your words have<br />always been a garden.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: .7 }}
            style={{
              fontSize: 18, color: ink2, fontWeight: 300, lineHeight: 1.9,
              maxWidth: 480, marginBottom: 44,
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
            }}
          >
            Muse is a writing sanctuary for women — a place to bloom, grow, and share the poems only you can write.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: .7 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}
          >
            <button
              onClick={handleBeginWriting}
              style={{
                padding: '15px 40px', borderRadius: 50, border: 'none',
                background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)',
                color: '#fff', fontSize: 14, cursor: 'pointer',
                fontFamily: "'Playfair Display',serif", fontStyle: 'italic', letterSpacing: '.04em',
                boxShadow: '0 8px 32px rgba(124,58,237,.42)',
                transition: 'all .3s cubic-bezier(.34,1.4,.64,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
                e.currentTarget.style.boxShadow = '0 18px 52px rgba(124,58,237,.58), 0 0 64px rgba(167,139,250,.18)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,.42)';
              }}
            >Begin writing →</button>

            <button
              onClick={() => openPage('explore')}
              style={{
                padding: '15px 40px', borderRadius: 50,
                border: `1px solid ${cardBd}`,
                background: 'rgba(245,240,255,.72)', backdropFilter: 'blur(16px)',
                color: '#9b72cf', fontSize: 14, cursor: 'pointer',
                fontFamily: "'Playfair Display',serif", fontStyle: 'italic', letterSpacing: '.04em',
                transition: 'all .25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(237,233,254,.92)';
                e.currentTarget.style.borderColor = 'rgba(167,139,250,.65)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,.14)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(245,240,255,.72)';
                e.currentTarget.style.borderColor = cardBd;
                e.currentTarget.style.boxShadow = '';
              }}
            >Explore poetry</button>
          </motion.div>

          {/* 3D Floating poem cards cluster */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: .85 }}
            style={{
              position: 'relative', width: '100%',
              maxWidth: 600, height: 280,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Left accent card */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-3, -2.4, -3] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', left: 0, top: 30, zIndex: 1,
                width: 200, padding: '18px 22px', borderRadius: 20,
                background: night ? 'rgba(30,15,50,.85)' : 'rgba(245,240,255,.78)', backdropFilter: 'blur(24px)',
                border: `1px solid ${cardBd}`,
                boxShadow: night ? '0 10px 36px rgba(0,0,0,.3)' : '0 10px 36px rgba(124,58,237,.1), inset 0 1px 0 rgba(255,255,255,.8)',
              }}
            >
              <div style={{
                fontFamily: "'Playfair Display',serif", fontSize: 12,
                fontStyle: 'italic', color: ink2, lineHeight: 1.95, marginBottom: 10,
              }}>
                "soft things are the<br />bravest things"
              </div>
              <div style={{ fontSize: 9, color: purpleAccent, letterSpacing: '.04em' }}>— Mei L.</div>
            </motion.div>

            {/* Main center card */}
            <Tilt style={{
              width: 320, padding: '30px 32px', borderRadius: 26, zIndex: 2, position: 'relative',
              background: 'rgba(245,240,255,.84)', backdropFilter: 'blur(32px)',
              border: '1px solid rgba(196,181,253,.52)',
              boxShadow: '0 24px 60px rgba(124,58,237,.16), inset 0 1px 0 rgba(255,255,255,.88)',
            }}>
              {/* Inner highlight line */}
              <div style={{
                position: 'absolute', top: 0, left: 20, right: 20, height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent)',
                pointerEvents: 'none',
              }} />
              <div style={{
                fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: 'italic',
                fontWeight: 300, color: ink2, lineHeight: 2, marginBottom: 20,
              }}>
                "Between two words<br />silence blooms like peonies—<br />you are the garden"
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff',
                }}>✦</div>
                <div>
                  <div style={{ fontSize: 11, color: ink, fontWeight: 400 }}>Luna A.</div>
                  <div style={{ fontSize: 10, color: ink3 }}>Haiku · Apr 12</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: purpleAccent }}>♡ 284</div>
              </div>
            </Tilt>

            {/* Right accent card */}
            <motion.div
              animate={{ y: [0, -16, 0], rotate: [3, 2.2, 3] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              style={{
                position: 'absolute', right: 0, bottom: 10, zIndex: 1,
                width: 195, padding: '16px 20px', borderRadius: 18,
                background: night ? 'rgba(25,12,42,.85)' : 'rgba(237,233,254,.78)', backdropFilter: 'blur(22px)',
                border: `1px solid ${cardBd}`,
                boxShadow: night ? '0 8px 28px rgba(0,0,0,.25)' : '0 8px 28px rgba(124,58,237,.09), inset 0 1px 0 rgba(255,255,255,.8)',
              }}
            >
              <div style={{
                fontFamily: "'Playfair Display',serif", fontSize: 12,
                fontStyle: 'italic', color: ink2, lineHeight: 1.95, marginBottom: 10,
              }}>
                "dawn tastes like copper<br />and unfinished sentences"
              </div>
              <div style={{ fontSize: 9, color: purpleAccent, letterSpacing: '.04em' }}>— Priya S.</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ padding: '60px 60px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: .65, delay: i * .1, ease: [.34,1.2,.64,1] }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 300,
                letterSpacing: '-.04em',
                background: 'linear-gradient(135deg,#5b21b6,#7c3aed,#a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.n}</div>
              <div style={{ fontSize: 11, color: ink3, marginTop: 6, fontWeight: 300, letterSpacing: '.04em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ textAlign: 'center', padding: '0 0 64px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 88, height: 1, background: `linear-gradient(90deg,transparent,${cardBd})` }} />
          <div style={{
            fontFamily: "'Playfair Display',serif", fontSize: 13,
            fontStyle: 'italic', color: ink3, letterSpacing: '.08em',
          }}>— all yours to tend —</div>
          <div style={{ width: 88, height: 1, background: `linear-gradient(90deg,${cardBd},transparent)` }} />
        </div>
      </div>

      {/* ══ BENTO GRID ══ */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: .7 }}
          style={{ textAlign: 'center', marginBottom: 44 }}
        >
          <div style={{
            fontSize: 10, letterSpacing: '.17em', textTransform: 'uppercase',
            color: purpleAccent, marginBottom: 12, fontWeight: 400,
          }}>Features</div>
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: 38,
            fontWeight: 300, color: ink, letterSpacing: '-.03em',
          }}>Everything your garden needs</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {bentoItems.map((item, i) => {
            const itemBg = night ? item.darkBg : item.bg;
            const itemBd = night ? item.darkBd : item.bd;
            const isDark = item.dark || night;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28, scale: .97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: .6, delay: i * .1, ease: [.34,1.2,.64,1] }}
                style={{ gridColumn: item.span === '2' ? 'span 2' : 'span 1' }}
              >
                <Tilt
                  onClick={() => openPage(item.id)}
                  style={{
                    borderRadius: 22, border: `1px solid ${itemBd}`,
                    background: itemBg, backdropFilter: 'blur(24px)',
                    padding: '38px 34px', cursor: 'pointer', minHeight: 200,
                    boxShadow: night ? '0 4px 24px rgba(0,0,0,.3)' : '0 4px 24px rgba(124,58,237,.07), inset 0 1px 0 rgba(255,255,255,.75)',
                  }}
                >
                  <div style={{
                    fontSize: 11, fontWeight: 400,
                    color: isDark ? 'rgba(196,181,253,.6)' : purpleAccent,
                    letterSpacing: '.1em', marginBottom: 16, textTransform: 'uppercase',
                  }}>{item.symbol}</div>
                  <div style={{
                    fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400,
                    color: isDark ? 'rgba(230,220,255,.92)' : ink, marginBottom: 10,
                    letterSpacing: '-.02em',
                  }}>{item.label}</div>
                  <div style={{
                    fontSize: 13, color: isDark ? 'rgba(196,181,253,.55)' : ink3,
                    fontWeight: 300, lineHeight: 1.8,
                  }}>{item.desc}</div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ POEM MARQUEE ══ */}
      <section style={{
        padding: '56px 0', overflow: 'hidden',
        borderTop: `1px solid ${cardBd}`, borderBottom: `1px solid ${cardBd}`,
        background: night ? 'rgba(0,0,0,.18)' : 'rgba(237,233,254,.35)',
        backdropFilter: 'blur(10px)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', gap: 22, animation: 'slide 34s linear infinite', width: 'max-content' }}>
          {[...poems, ...poems].map((p, i) => (
            <div key={i} style={{
              width: 295, flexShrink: 0, padding: '24px 28px', borderRadius: 20,
              border: `1px solid ${cardBd}`,
              background: cardBg, backdropFilter: 'blur(22px)',
              boxShadow: '0 4px 20px rgba(124,58,237,.06), inset 0 1px 0 rgba(255,255,255,.8)',
            }}>
              <div style={{
                fontFamily: "'Playfair Display',serif", fontSize: 13,
                fontStyle: 'italic', color: ink2, lineHeight: 2, marginBottom: 12,
              }}>"{p.text}"</div>
              <div style={{ fontSize: 10, color: purpleAccent, letterSpacing: '.04em' }}>— {p.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding: '90px 40px', maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: .7 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <div style={{
            fontSize: 10, letterSpacing: '.17em', textTransform: 'uppercase',
            color: purpleAccent, marginBottom: 12, fontWeight: 400,
          }}>From the garden</div>
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: 36,
            fontWeight: 300, color: ink, letterSpacing: '-.03em',
          }}>Writers who found their voice</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28, scale: .97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: .65, delay: i * .12, ease: [.34,1.2,.64,1] }}
            >
              <Tilt style={{
                borderRadius: 22, border: `1px solid ${cardBd}`,
                background: cardBg, backdropFilter: 'blur(26px)',
                padding: '30px 28px', height: '100%',
                boxShadow: '0 4px 24px rgba(124,58,237,.08), inset 0 1px 0 rgba(255,255,255,.82)',
              }}>
                <div style={{
                  fontFamily: "'Playfair Display',serif", fontSize: 44,
                  color: 'rgba(167,139,250,.25)', lineHeight: .9, marginBottom: 10,
                }}>"</div>
                <div style={{
                  fontFamily: "'Playfair Display',serif", fontSize: 15,
                  fontStyle: 'italic', color: ink2, lineHeight: 1.85, marginBottom: 22,
                }}>{t.quote}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: '#fff',
                  }}>✦</div>
                  <div>
                    <div style={{ fontSize: 12, color: ink, fontWeight: 400 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: ink3, fontWeight: 300, marginTop: 1 }}>{t.role}</div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: .85 }}
        style={{
          position: 'relative', margin: '0 40px 70px', borderRadius: 32, overflow: 'hidden',
          background: night
            ? 'linear-gradient(145deg,#1a1130,#2c1060,#1e0f2e)'
            : 'linear-gradient(145deg,#ede9fe,#f5f3ff,#faf5ff)',
          border: `1px solid ${cardBd}`,
          padding: '96px 60px', textAlign: 'center',
          boxShadow: '0 28px 88px rgba(124,58,237,.14)',
          zIndex: 1,
        }}
      >
        {/* Ambient glow orbs */}
        <div style={{
          position: 'absolute', top: -70, right: -30, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(167,139,250,.18)',
          filter: 'blur(70px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -50, left: -20, width: 220, height: 220,
          borderRadius: '50%', background: 'rgba(232,121,249,.12)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase',
            color: purpleAccent, marginBottom: 18, fontWeight: 400,
          }}>Begin today</div>
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: 46, fontWeight: 300,
            color: ink, letterSpacing: '-.045em', lineHeight: 1.18,
            marginBottom: 20, maxWidth: 540, marginInline: 'auto',
          }}>
            Your garden is waiting<br />to bloom.
          </h2>
          <p style={{
            fontSize: 15, color: ink2, fontWeight: 300, marginBottom: 38,
            fontFamily: "'Playfair Display',serif", fontStyle: 'italic', lineHeight: 1.8,
          }}>
            Free forever. No pressure. Just your words and a quiet place to write them.
          </p>
          <button
            onClick={handleBeginWriting}
            style={{
              padding: '17px 50px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)',
              color: '#fff', fontSize: 15, cursor: 'pointer',
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic', letterSpacing: '.04em',
              boxShadow: '0 12px 42px rgba(124,58,237,.48)',
              transition: 'all .32s cubic-bezier(.34,1.4,.64,1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 22px 64px rgba(124,58,237,.62), 0 0 90px rgba(167,139,250,.22)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 12px 42px rgba(124,58,237,.48)';
            }}
          >Begin writing — it&apos;s free</button>
        </div>
      </motion.section>

      {/* ══ FOOTER ══ */}
      <footer style={{
        position: 'relative', zIndex: 1,
        background: night ? 'rgba(12,8,24,.95)' : 'rgba(237,233,254,.55)',
        backdropFilter: 'blur(22px)',
        borderTop: `1px solid ${cardBd}`,
        padding: '36px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{
            fontFamily: "'Playfair Display',serif", fontSize: 18,
            color: ink, fontWeight: 400, marginBottom: 3, letterSpacing: '-.02em',
          }}>Muse</div>
          <div style={{ fontSize: 11, color: ink3, fontWeight: 300, letterSpacing: '.04em' }}>
            A garden of poetry — tended with love.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Poems', page: 'poems' },
            { label: 'Fan Fiction', page: 'fan fiction' },
            { label: 'Collections', page: 'collections' },
            { label: 'Settings', page: 'settings' },
          ].map(l => (
            <button
              key={l.label}
              onClick={() => openPage(l.page)}
              style={{
                fontSize: 12, color: ink3, background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 300,
                transition: 'color .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = purpleAccent)}
              onMouseLeave={e => (e.currentTarget.style.color = ink3)}
            >{l.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>
          © {new Date().getFullYear()} Muse
        </div>
      </footer>
    </div>
  );
}
