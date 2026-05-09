'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMuseStore } from '@/lib/store';
import { Drawer } from '@/components/Drawer';
import { AppOverlay } from '@/components/AppOverlay';
import { SignInModal } from '@/components/SignInModal';

interface Feature {
  n: string; tag: string; title: string; it: string;
  body: string; points: string[]; art: string;
}

/* ══════════════════════════════════════════════════
   MESH ORBS BACKGROUND — animated canvas, position fixed
══════════════════════════════════════════════════ */
function MeshOrbsBg({ night }: { night: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let raf: number, t = 0;
    const orbs = night ? [
      { x: .18, y: .12, r: .55, c: '120,80,200',  s: .00018, a: .32 },
      { x: .78, y: .22, r: .5,  c: '90,40,150',   s: .00022, a: .36 },
      { x: .45, y: .52, r: .62, c: '50,30,120',   s: .00016, a: .28 },
      { x: .12, y: .78, r: .45, c: '140,100,220', s: .0002,  a: .3  },
      { x: .85, y: .72, r: .48, c: '200,80,140',  s: .00018, a: .26 },
    ] : [
      { x: .15, y: .08, r: .55, c: '232,154,184', s: .00027, a: .45 },
      { x: .82, y: .16, r: .48, c: '232,210,244', s: .00032, a: .5  },
      { x: .5,  y: .4,  r: .65, c: '212,184,232', s: .00023, a: .4  },
      { x: .08, y: .65, r: .42, c: '200,232,210', s: .00029, a: .38 },
      { x: .9,  y: .7,  r: .46, c: '248,224,200', s: .00025, a: .36 },
      { x: .42, y: .92, r: .5,  c: '232,200,224', s: .00028, a: .42 },
    ];
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      cv.width = window.innerWidth * dpr;
      cv.height = window.innerHeight * dpr;
      cv.style.width = window.innerWidth + 'px';
      cv.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      if (night) { ctx.fillStyle = '#06030f'; ctx.fillRect(0, 0, w, h); }
      orbs.forEach((o, i) => {
        const ox = o.x * w + Math.sin(t * o.s * 1000 + i * 1.42) * w * .06;
        const oy = o.y * h + Math.cos(t * o.s * 820  + i * 1.78) * h * .04;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r * w);
        g.addColorStop(0, `rgba(${o.c},${o.a})`);
        g.addColorStop(1, `rgba(${o.c},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      });
      t += 16; raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [night]);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: .78 }} />;
}

/* ══════════════════════════════════════════════════
   PARTICLE OVERLAY — soft drifting petals
══════════════════════════════════════════════════ */
function ParticlesBg({ night }: { night: boolean }) {
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="p1x">
          <stop offset="0" stopColor={night ? 'rgba(232,154,184,.9)' : 'rgba(248,200,224,1)'} />
          <stop offset="1" stopColor="rgba(248,200,224,0)" />
        </radialGradient>
      </defs>
      {[...Array(28)].map((_, i) => {
        const x = (i * 73) % 100, y = (i * 41) % 100, d = 12 + (i % 5) * 4;
        return (
          <circle key={i} cx={`${x}%`} cy={`${y}%`} r={(i % 4) * .6 + 1.1} fill="url(#p1x)" opacity={.35 + (i % 5) * .1}>
            <animate attributeName="cy" values={`${y}%;${y - 3}%;${y}%`} dur={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values={`${.25 + (i % 5) * .08};${.6 + (i % 5) * .04};${.25 + (i % 5) * .08}`} dur={`${d - 2}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   STICKY GLASS NAV — fixed pill, scroll-aware blur
══════════════════════════════════════════════════ */
function GlassNav({ scrolled }: { scrolled: boolean }) {
  const { night, toggleNight, setDrawerOpen, openPage, setSignInOpen } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const txt = night ? 'rgba(246,234,253,.9)' : '#0c0612';

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
      style={{
        position: 'fixed', top: 14, left: 14, right: 14, zIndex: 90,
        maxWidth: 1320, marginLeft: 'auto', marginRight: 'auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 10px 18px', borderRadius: 80, gap: 18,
        background: scrolled
          ? (night ? 'rgba(8,4,15,.65)' : 'rgba(255,255,255,.55)')
          : (night ? 'rgba(8,4,15,.18)' : 'rgba(255,255,255,.18)'),
        backdropFilter: `blur(${scrolled ? 28 : 14}px) saturate(160%)`,
        WebkitBackdropFilter: `blur(${scrolled ? 28 : 14}px) saturate(160%)`,
        border: `1px solid ${night
          ? (scrolled ? 'rgba(184,154,216,.22)' : 'rgba(184,154,216,.12)')
          : (scrolled ? 'rgba(255,255,255,.65)' : 'rgba(255,255,255,.3)')}`,
        boxShadow: scrolled
          ? (night
            ? '0 12px 40px rgba(0,0,0,.4),inset 0 1px 0 rgba(184,154,216,.15)'
            : '0 12px 40px rgba(120,80,180,.1),inset 0 1px 0 rgba(255,255,255,.7)')
          : 'none',
        color: txt,
        transition: 'background .35s,border-color .35s,box-shadow .35s',
      }}>

      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button onClick={() => setDrawerOpen(true)} aria-label="Menu"
          style={{ width: 34, height: 34, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, background: 'transparent', padding: 0, border: 'none', cursor: 'pointer' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 16, height: 1.4, background: night ? 'rgba(220,200,255,.85)' : '#2a1a3a', borderRadius: 2 }} />
          ))}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="4.5" fill="#7a3a8a" />
            <g transform="translate(18,18)">
              {[0, 72, 144, 216, 288].map((a, i) => (
                <ellipse key={a} rx="5.5" ry="9.5"
                  fill={i < 2 ? 'rgba(248,200,224,.95)' : 'rgba(232,212,248,.92)'}
                  stroke={i < 2 ? 'rgba(208,100,136,.55)' : 'rgba(160,124,200,.55)'} strokeWidth=".7"
                  transform={`rotate(${a}) translate(0,-9)`} />
              ))}
            </g>
          </svg>
          <div style={{ lineHeight: 1.05 }}>
            <div className="serif" style={{ fontSize: 18, fontWeight: 400, letterSpacing: '-.02em', color: txt }}>Muse</div>
            <div style={{ fontSize: 8, letterSpacing: '.18em', color: night ? '#b89ad8' : '#7a6a8a', marginTop: 2, fontWeight: 400, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>garden of poetry</div>
          </div>
        </div>
      </div>

      {/* Center: links */}
      <div style={{ display: 'flex', gap: 24, flex: 1, justifyContent: 'center' }}>
        {['Discover', 'Sanctuary', 'Fan Fiction'].map(l => (
          <button key={l} onClick={() => isSignedIn ? openPage(l.toLowerCase()) : setSignInOpen(true)}
            style={{ fontSize: 12.5, fontWeight: 400, letterSpacing: '.01em', opacity: .82, background: 'none', border: 'none', cursor: 'pointer', color: txt, whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", transition: 'opacity .25s,color .25s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = night ? '#e89aae' : '#7a3a8a'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '.82'; e.currentTarget.style.color = 'inherit'; }}
          >{l}</button>
        ))}
      </div>

      {/* Right: night toggle + auth */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <button onClick={toggleNight} title="Toggle theme"
          style={{ width: 34, height: 34, borderRadius: '50%', background: night ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.5)', border: `1px solid ${night ? 'rgba(184,154,216,.25)' : 'rgba(122,58,138,.18)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer' }}>
          {night ? '☾' : '☉'}
        </button>
        {isLoaded && isSignedIn ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
            onClick={() => openPage('write')}
            style={{ padding: '9px 18px', borderRadius: 50, fontSize: 12, fontWeight: 500, letterSpacing: '.02em', background: '#0c0612', color: '#f7f3ff', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', boxShadow: '0 6px 20px rgba(12,6,18,.25)', fontFamily: "'DM Sans', sans-serif" }}>
            Begin writing
          </motion.button>
        ) : isLoaded ? (
          <>
            <button onClick={() => setSignInOpen(true)}
              style={{ padding: '8px 18px', borderRadius: 50, fontSize: 12, fontWeight: 400, background: 'transparent', color: txt, border: `1px solid ${night ? 'rgba(184,154,216,.25)' : 'rgba(122,58,138,.18)'}`, whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Sign in
            </button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
              onClick={() => setSignInOpen(true)}
              style={{ padding: '9px 18px', borderRadius: 50, fontSize: 12, fontWeight: 500, letterSpacing: '.02em', background: '#0c0612', color: '#f7f3ff', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', boxShadow: '0 6px 20px rgba(12,6,18,.25)', fontFamily: "'DM Sans', sans-serif" }}>
              Begin writing
            </motion.button>
          </>
        ) : null}
      </div>
    </motion.nav>
  );
}

/* ══════════════════════════════════════════════════
   FUTURISTIC GLASS SCENE — orbital ring + 3D moon + floating cards
══════════════════════════════════════════════════ */
function FuturisticGlassScene({ night }: { night: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 480 }}>
      {/* Backdrop glow */}
      <div style={{ position: 'absolute', inset: '10%', borderRadius: '50%', background: night ? 'radial-gradient(circle,rgba(232,154,184,.25),transparent 65%)' : 'radial-gradient(circle,rgba(248,200,224,.5),transparent 65%)', filter: 'blur(40px)' }} />

      {/* Orbital ring — spinning via framer motion */}
      <motion.svg viewBox="-200 -200 400 400"
        animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="orb-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"   stopColor={night ? 'rgba(232,154,184,.7)' : 'rgba(122,58,138,.7)'} />
            <stop offset=".5"  stopColor="rgba(184,154,216,.2)" />
            <stop offset="1"   stopColor={night ? 'rgba(184,154,216,.7)' : 'rgba(232,154,184,.7)'} />
          </linearGradient>
        </defs>
        <ellipse cx="0" cy="0" rx="180" ry="60" fill="none" stroke="url(#orb-ring)" strokeWidth="1" strokeDasharray="2 6" opacity=".55" />
        <ellipse cx="0" cy="0" rx="160" ry="160" fill="none" stroke={night ? 'rgba(184,154,216,.18)' : 'rgba(122,58,138,.18)'} strokeWidth=".6" strokeDasharray="1 4" />
      </motion.svg>

      {/* 3D moon sphere — center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '48%', aspectRatio: '1', zIndex: 3 }}>
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 24px 60px rgba(120,80,200,.35))' }}>
          <defs>
            <radialGradient id="moon3d" cx=".34" cy=".28" r=".66">
              <stop offset="0"   stopColor="#fffaf4" />
              <stop offset=".22" stopColor="#f4ecdc" />
              <stop offset=".55" stopColor="#c8b8a4" />
              <stop offset=".82" stopColor="#5a4838" />
              <stop offset="1"   stopColor="#2c2018" />
            </radialGradient>
            <radialGradient id="moonGl" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="rgba(255,235,200,.5)" />
              <stop offset="1" stopColor="rgba(255,235,200,0)" />
            </radialGradient>
            <clipPath id="mclip"><circle cx="100" cy="100" r="80" /></clipPath>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#moonGl)" />
          <circle cx="100" cy="100" r="80"  fill="url(#moon3d)" />
          <g clipPath="url(#mclip)" opacity=".55">
            <ellipse cx="112" cy="86" rx="20" ry="13" fill="rgba(80,60,40,.35)" transform="rotate(-18 112 86)" />
            <ellipse cx="78"  cy="112" rx="13" ry="9"  fill="rgba(80,60,40,.3)"  transform="rotate(15 78 112)" />
            <circle  cx="64"  cy="78"  r="9"  fill="none" stroke="rgba(120,90,60,.4)"  strokeWidth="1.2" />
            <circle  cx="128" cy="124" r="5"  fill="none" stroke="rgba(120,90,60,.35)" strokeWidth=".9" />
          </g>
          <ellipse cx="140" cy="100" rx="34" ry="80" fill="rgba(8,4,15,.42)" clipPath="url(#mclip)" />
          <ellipse cx="76"  cy="64"  rx="14" ry="9"  fill="rgba(255,255,255,.55)" transform="rotate(-30 76 64)" />
        </svg>
      </div>

      {/* Floating poem card — top right */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className={night ? 'night-glass' : 'glass'}
        style={{ position: 'absolute', top: '4%', right: '-6%', padding: '14px 16px', borderRadius: 14, zIndex: 5, minWidth: 170, boxShadow: '0 18px 50px rgba(120,80,200,.18)' }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: '.2em', opacity: .65, marginBottom: 6, color: night ? '#b89ad8' : '#7a3a8a' }}>04:32 AM · DRAFT</div>
        <div className="serif" style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.45, fontWeight: 300, color: night ? '#f6eafd' : '#0c0612' }}>
          Between two words<br />silence blooms—<br />you are the garden
        </div>
      </motion.div>

      {/* 14 women writing now — left mid */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className={night ? 'night-glass' : 'glass'}
        style={{ position: 'absolute', top: '42%', left: '-4%', padding: '9px 16px', borderRadius: 50, zIndex: 5, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 14px 40px rgba(120,80,200,.18)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e89aae', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        <span className="mono" style={{ fontSize: 10, letterSpacing: '.16em', color: night ? '#f6eafd' : '#0c0612' }}>14 women writing now</span>
      </motion.div>

      {/* Social proof card — bottom */}
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: .5 }}
        className={night ? 'night-glass' : 'glass'}
        style={{ position: 'absolute', bottom: '-2%', left: '18%', right: '18%', padding: '12px 18px', borderRadius: 14, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 18px 50px rgba(120,80,200,.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {['#e89aae', '#b89ad8', '#9ec5a8'].map((c, i) => (
              <div key={c} style={{ width: 22, height: 22, borderRadius: '50%', background: c, marginLeft: i ? -8 : 0, border: `1.5px solid ${night ? '#1a0a30' : '#fff'}` }} />
            ))}
          </div>
          <div>
            <div className="serif" style={{ fontSize: 12, fontStyle: 'italic', color: night ? '#f6eafd' : '#0c0612' }}>Aiko, Mira, Sora &amp; 142 more</div>
            <div className="mono" style={{ fontSize: 8.5, letterSpacing: '.18em', opacity: .55, marginTop: 2, color: night ? '#b89ad8' : '#7a3a8a' }}>WROTE THIS WEEK</div>
          </div>
        </div>
        <span style={{ fontSize: 14, opacity: .55, color: night ? '#f6eafd' : '#0c0612' }}>→</span>
      </motion.div>

      {/* Floating petals */}
      {[...Array(10)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], x: [0, 8, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 10 + i, repeat: Infinity, ease: 'easeInOut', delay: i * .7 }}
          style={{
            position: 'absolute',
            left: `${(i * 23) % 90 + 5}%`, top: `${(i * 37) % 80 + 10}%`,
            width: 8 + (i % 4) * 2, height: 6 + (i % 4) * 1.5,
            borderRadius: '50% 0 50% 0',
            background: i % 2 ? 'rgba(248,200,224,.6)' : 'rgba(232,212,248,.55)',
            zIndex: 2, pointerEvents: 'none',
          }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HERO — 12-col grid, stats strip inside left column
══════════════════════════════════════════════════ */
function Hero({ night, onBeginWriting }: { night: boolean; onBeginWriting: () => void }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);
  const ink = night ? '#f6eafd' : '#0c0612';
  const muted = night ? '#c8b4dc' : '#3a2a4a';
  const mono = night ? '#b89ad8' : '#7a3a8a';

  return (
    <section style={{ position: 'relative', minHeight: '100vh', padding: '140px 24px 0', display: 'flex', alignItems: 'flex-start', zIndex: 5 }}>
      <motion.div style={{ maxWidth: 1320, margin: '0 auto', width: '100%', y: heroY, opacity: heroOpacity, position: 'relative' }}>

        {/* Meta strip */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .2, duration: .8 }}
          className="mono"
          style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 10.5, letterSpacing: '.24em', opacity: .7, marginBottom: 60, color: muted }}>
          <span style={{ width: 24, height: 1, background: mono, flexShrink: 0 }} />
          <span>EST. 2025 · KYOTO ↔ MUMBAI · WHERE WORDS FIND THEIR FORM</span>
        </motion.div>

        {/* Rule-of-thirds grid: text 7 cols, scene 5 cols */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 28, alignItems: 'center', minHeight: 'calc(100vh - 280px)' }}>

          {/* LEFT — text + stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .4, duration: 1.2, ease: [.16, 1, .3, 1] }}
            style={{ gridColumn: 'span 7' }}>

            <div className="mono" style={{ fontSize: 11, letterSpacing: '.24em', opacity: .7, marginBottom: 24, color: mono, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: mono, animation: 'pulse 2.5s ease-in-out infinite', flexShrink: 0 }} />
              A SANCTUARY FOR WOMEN WHO WRITE
            </div>

            <h1 className="serif" style={{ fontSize: 'clamp(56px, 8.6vw, 144px)', fontWeight: 300, lineHeight: .94, letterSpacing: '-.045em', color: ink, margin: 0 }}>
              <span style={{ display: 'block' }}>Garden</span>
              <span style={{ display: 'block' }}>
                <span className="serif" style={{
                  fontStyle: 'italic', paddingRight: '.05em',
                  background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)',
                  backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text',
                  color: 'transparent', animation: 'shimmer 8s linear infinite',
                }}>of poetry</span>
              </span>
            </h1>

            <p className="serif" style={{ marginTop: 32, maxWidth: 560, fontSize: 18, lineHeight: 1.65, opacity: .86, color: muted, fontWeight: 300, fontStyle: 'italic' }}>
              Inspired by <span style={{ color: mono, fontWeight: 400 }}>ma</span> — the sacred Japanese pause between words, where all meaning lives.
            </p>
            <p style={{ marginTop: 14, maxWidth: 520, fontSize: 14, lineHeight: 1.8, opacity: .74, color: muted, fontWeight: 300, fontFamily: "'DM Sans', sans-serif" }}>
              A space for poetry, fan fiction, and morning pages. Built for the still heart that creates at 4am — when the world is quiet and the words are honest.
            </p>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 38, flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }} onClick={onBeginWriting}
                style={{ padding: '15px 30px', borderRadius: 60, background: night ? '#f6eafd' : '#0c0612', color: night ? '#0c0612' : '#f7f3ff', fontSize: 13.5, fontWeight: 500, letterSpacing: '.04em', display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: 'none', boxShadow: '0 12px 40px rgba(12,6,18,.25)', fontFamily: "'DM Sans', sans-serif" }}>
                <span>Begin your garden</span>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: night ? '#0c0612' : '#f7f3ff', color: night ? '#f6eafd' : '#0c0612', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>→</span>
              </motion.button>
              <button className="serif" style={{ padding: '15px 18px', fontSize: 13.5, fontStyle: 'italic', opacity: .78, color: ink, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Watch the film ⏵
              </button>
            </div>

            {/* Stats inside hero */}
            <div style={{ display: 'flex', gap: 32, marginTop: 44, paddingTop: 28, borderTop: `1px solid ${night ? 'rgba(184,154,216,.18)' : 'rgba(122,58,138,.12)'}`, flexWrap: 'wrap' }}>
              {[['12.4k', 'women writing'], ['47k', 'poems planted'], ['2.8k', 'fan fictions'], ['198k', 'quiet hours']].map(([n, l]) => (
                <div key={l}>
                  <div className="serif" style={{ fontSize: 24, fontWeight: 300, letterSpacing: '-.02em', color: ink }}>{n}</div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '.22em', opacity: .55, marginTop: 3, color: mono, textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — futuristic glass scene */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: .7, duration: 1.4, ease: [.16, 1, .3, 1] }}
            style={{ gridColumn: 'span 5', position: 'relative', aspectRatio: '1 / 1.05', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FuturisticGlassScene night={night} />
          </motion.div>

        </div>
      </motion.div>

      {/* Bottom blend into next section */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 160, background: `linear-gradient(180deg,transparent,${night ? '#0a0518' : '#f7f3ff'})`, zIndex: 2, pointerEvents: 'none' }} />
    </section>
  );
}

/* ══════════════════════════════════════════════════
   EDITORIAL INTRO
══════════════════════════════════════════════════ */
function Editorial({ night }: { night: boolean }) {
  const ink = night ? '#f6eafd' : '#0c0612';
  const muted = night ? '#c8b4dc' : '#3a2a4a';
  const accent = night ? '#e89aae' : '#7a3a8a';
  return (
    <section style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 5 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 60, alignItems: 'flex-start' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .9, ease: [.16, 1, .3, 1] }} viewport={{ once: true }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.24em', opacity: .6, marginBottom: 24, color: night ? '#b89ad8' : '#7a3a8a' }}>(01) — INTRODUCTION</div>
            <div className="serif" style={{ fontSize: 18, fontStyle: 'italic', opacity: .5, fontWeight: 300, marginBottom: 14, color: ink }}>About Muse</div>
            <h2 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-.035em', margin: 0, color: ink }}>
              Where words<br />find their<br /><em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>form.</em>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .9, delay: .15, ease: [.16, 1, .3, 1] }} viewport={{ once: true }}
            style={{ paddingTop: 40 }}>
            <p className="serif" style={{ fontSize: 22, lineHeight: 1.55, fontWeight: 300, marginBottom: 32, color: night ? '#e8d4f0' : '#3a2a4a' }}>
              A poet&apos;s notebook. A fan fiction shelf. A morning journal. A community of women who write at 4am — when the world is quiet and the heart finally speaks.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, opacity: .78, maxWidth: 560, fontWeight: 300, color: muted, fontFamily: "'DM Sans', sans-serif" }}>
              Muse is built around a single belief: that creating beautiful things — and sharing them — should feel like coming home, not performing for an algorithm. Every detail, from the soft lavender gradients to the slowness of the cursor, exists to honor the still, sacred space inside you.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <button className={`serif ${night ? 'night-glass' : 'glass'}`} style={{ padding: '13px 24px', borderRadius: 50, fontSize: 13, fontStyle: 'italic', cursor: 'pointer', color: ink }}>
                Read the manifesto →
              </button>
              <button style={{ padding: '13px 24px', borderRadius: 50, fontSize: 13, fontWeight: 400, border: `1px solid ${night ? 'rgba(184,154,216,.3)' : 'rgba(122,58,138,.25)'}`, color: ink, background: 'transparent', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Take a tour</button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   FEATURE ARTS
══════════════════════════════════════════════════ */
function IkigaiOrb({ night }: { night: boolean }) {
  return (
    <div className={night ? 'night-glass' : 'glass'} style={{ borderRadius: 32, aspectRatio: '4/5', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: night
        ? 'radial-gradient(ellipse at 30% 20%,rgba(232,154,184,.3),transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(184,154,216,.3),transparent 50%),linear-gradient(135deg,#180a28,#3a1a52)'
        : 'radial-gradient(ellipse at 30% 20%,rgba(248,224,236,.7),transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(212,184,232,.7),transparent 50%),linear-gradient(135deg,#fff8ec,#e4f4ec)' }} />
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 5 }}>
        <div className="mono" style={{ fontSize: 9.5, letterSpacing: '.28em', opacity: .7, color: night ? '#b89ad8' : '#7a3a8a' }}>IKIGAI · 生き甲斐</div>
        <div className="serif" style={{ fontSize: 30, fontStyle: 'italic', fontWeight: 300, marginTop: 6, color: night ? '#f6eafd' : '#0c0612' }}>Reason for being.</div>
      </div>
      <div style={{ position: 'absolute', top: '52%', left: '50%', transform: 'translate(-50%,-50%)', width: '78%', aspectRatio: '1' }}>
        <svg viewBox="-150 -150 300 300" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 20px 40px rgba(120,80,200,.25))' }}>
          <defs>
            <radialGradient id="ig-rose" cx=".4" cy=".4">
              <stop offset="0" stopColor={night ? 'rgba(248,200,224,.65)' : 'rgba(248,200,224,.85)'} />
              <stop offset=".7" stopColor={night ? 'rgba(232,154,184,.4)' : 'rgba(232,154,184,.45)'} />
              <stop offset="1" stopColor="rgba(232,154,184,0)" />
            </radialGradient>
            <radialGradient id="ig-lav" cx=".4" cy=".4">
              <stop offset="0" stopColor={night ? 'rgba(212,184,232,.6)' : 'rgba(212,184,232,.85)'} />
              <stop offset=".7" stopColor={night ? 'rgba(184,154,216,.4)' : 'rgba(184,154,216,.45)'} />
              <stop offset="1" stopColor="rgba(184,154,216,0)" />
            </radialGradient>
            <radialGradient id="ig-sage" cx=".4" cy=".4">
              <stop offset="0" stopColor={night ? 'rgba(200,232,212,.6)' : 'rgba(200,232,212,.85)'} />
              <stop offset=".7" stopColor={night ? 'rgba(158,197,168,.4)' : 'rgba(158,197,168,.45)'} />
              <stop offset="1" stopColor="rgba(158,197,168,0)" />
            </radialGradient>
            <radialGradient id="ig-core" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".4" stopColor={night ? '#f6eafd' : '#fff'} />
              <stop offset="1" stopColor={night ? 'rgba(232,154,184,.5)' : 'rgba(232,154,184,.7)'} />
            </radialGradient>
          </defs>
          {/* Outer dashed ring — slow spin */}
          <g style={{ transformOrigin: 'center', animation: 'spin 60s linear infinite' }}>
            <circle r="135" fill="none" stroke={night ? 'rgba(184,154,216,.18)' : 'rgba(122,58,138,.15)'} strokeWidth=".6" strokeDasharray="3 6" />
          </g>
          {/* Three intersecting circles — counter-clockwise */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="-360 0 0" dur="40s" repeatCount="indefinite" />
            <circle cx="-50" cy="-30" r="90" fill="url(#ig-rose)" stroke={night ? 'rgba(232,154,184,.7)' : 'rgba(232,154,184,.85)'} strokeWidth="1" />
            <circle cx="50"  cy="-30" r="90" fill="url(#ig-lav)"  stroke={night ? 'rgba(184,154,216,.7)' : 'rgba(184,154,216,.85)'} strokeWidth="1" />
            <circle cx="0"   cy="60"  r="90" fill="url(#ig-sage)" stroke={night ? 'rgba(158,197,168,.7)' : 'rgba(158,197,168,.85)'} strokeWidth="1" />
          </g>
          <g fontFamily="Fraunces, serif" fontStyle="italic">
            <text x="-118" y="-100" fontSize="14" fontWeight="400" fill={night ? '#f6eafd' : '#0c0612'}>love</text>
            <text x="86"   y="-100" fontSize="14" fontWeight="400" fill={night ? '#f6eafd' : '#0c0612'}>create</text>
            <text x="-30"  y="148"  fontSize="14" fontWeight="400" fill={night ? '#f6eafd' : '#0c0612'}>need</text>
          </g>
          {/* Center core with glow */}
          <circle r="24" fill="url(#ig-core)" filter="drop-shadow(0 0 20px rgba(255,255,255,.6))" />
          <text y="6" textAnchor="middle" fontFamily="Fraunces" fontSize="20" fill={night ? '#1a0a30' : '#0c0612'}>生</text>
          {/* Floating glass orbs */}
          <circle cx="-110" cy="60" r="8" fill={night ? 'rgba(232,154,184,.7)' : 'rgba(232,154,184,.7)'} opacity=".7">
            <animate attributeName="cy" values="60;50;60" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="80" r="6" fill={night ? 'rgba(184,154,216,.7)' : 'rgba(184,154,216,.7)'} opacity=".6">
            <animate attributeName="cy" values="80;70;80" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="-110" r="5" fill={night ? 'rgba(158,197,168,.7)' : 'rgba(158,197,168,.7)'} opacity=".6">
            <animate attributeName="cy" values="-110;-100;-110" dur="7s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <div className={night ? 'night-glass' : 'glass'} style={{ position: 'absolute', bottom: 18, left: 18, right: 18, padding: '10px 14px', borderRadius: 14, zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: '.2em', opacity: .7, color: night ? '#b89ad8' : '#7a3a8a' }}>03 PROMPTS · DAILY · PRIVATE</span>
        <span style={{ fontSize: 13, color: night ? '#f6eafd' : '#0c0612' }}>↗</span>
      </div>
    </div>
  );
}

function SanctuaryArt({ night }: { night: boolean }) {
  return (
    <div className={night ? 'night-glass' : 'glass'} style={{ borderRadius: 32, aspectRatio: '4/5', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: night
        ? 'radial-gradient(ellipse at 30% 20%,rgba(184,154,216,.3),transparent 50%),linear-gradient(135deg,#1a0a30,#3a1a52)'
        : 'radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.7),transparent 50%),linear-gradient(135deg,#f4e4ff,#fadbf0)' }} />
      <div style={{ position: 'absolute', top: 24, left: 24, right: 24, zIndex: 5 }}>
        <div className="mono" style={{ fontSize: 9.5, letterSpacing: '.28em', opacity: .7, color: night ? '#b89ad8' : '#7a3a8a' }}>SANCTUARY · 04:32 AM</div>
        <div className="serif" style={{ fontSize: 30, fontStyle: 'italic', fontWeight: 300, marginTop: 6, color: night ? '#f6eafd' : '#0c0612' }}>The page<br />that breathes.</div>
      </div>
      <div className={night ? 'night-glass' : 'glass'} style={{ position: 'absolute', top: '40%', left: '10%', right: '10%', padding: '24px 26px', borderRadius: 20, zIndex: 5, boxShadow: '0 24px 60px rgba(120,80,200,.2)', transform: 'rotate(-2deg)' }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: '.22em', opacity: .6, marginBottom: 12, color: night ? '#b89ad8' : '#7a3a8a' }}>POEM DRAFT · HAIKU</div>
        <div className="serif" style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.55, color: night ? '#f6eafd' : '#0c0612' }}>
          Between two words<br />silence blooms like peonies—<br />you are the garden
        </div>
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${night ? 'rgba(184,154,216,.18)' : 'rgba(122,58,138,.12)'}`, display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: .6 }}>
          <span className="mono" style={{ letterSpacing: '.18em' }}>14 WORDS · AUTO-SAVED</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: night ? '#e89aae' : '#7a3a8a', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
        </div>
      </div>
      {[[15, 82, 9], [88, 12, 7], [12, 18, 6], [85, 75, 8]].map(([x, y, r], i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, borderRadius: '50%', background: night ? 'rgba(232,154,184,.5)' : 'rgba(248,200,224,.7)', filter: 'blur(.5px)' }} />
      ))}
    </div>
  );
}

function FanficArt({ night }: { night: boolean }) {
  const books = [
    { x: 8,  y: 42, w: 32, h: 42, r: -5, t1: 'Beneath',   t2: 'Same Moon',  c: '#5a2868', meta: '42ch' },
    { x: 34, y: 32, w: 34, h: 48, r:  3, t1: 'A Thousand', t2: 'Lanterns',   c: '#e89aae', meta: '12ch' },
    { x: 62, y: 38, w: 32, h: 44, r: -4, t1: 'Petals',     t2: 'Remember',   c: '#b89ad8', meta: '8ch'  },
  ];
  return (
    <div className={night ? 'night-glass' : 'glass'} style={{ borderRadius: 32, aspectRatio: '4/5', position: 'relative', overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: night
        ? 'radial-gradient(ellipse at 70% 30%,rgba(232,154,184,.3),transparent 50%),linear-gradient(135deg,#180a28,#3a1a52)'
        : 'radial-gradient(ellipse at 70% 30%,rgba(255,255,255,.6),transparent 50%),linear-gradient(135deg,#fde4ec,#e4d4f8)' }} />
      <div style={{ position: 'absolute', top: 24, left: 24, right: 24, zIndex: 5 }}>
        <div className="mono" style={{ fontSize: 9.5, letterSpacing: '.28em', opacity: .7, color: night ? '#b89ad8' : '#7a3a8a' }}>FAN FICTION · 2,847 STORIES</div>
        <div className="serif" style={{ fontSize: 30, fontStyle: 'italic', fontWeight: 300, marginTop: 6, color: night ? '#f6eafd' : '#0c0612' }}>The shelf,<br />always open.</div>
      </div>
      <div style={{ position: 'absolute', inset: 0 }}>
        {books.map((b, i) => (
          <div key={i} className="glass" style={{
            position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`,
            background: b.c, transform: `rotate(${b.r}deg)`, borderRadius: 8,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '14px 12px',
            boxShadow: '0 18px 50px rgba(0,0,0,.18)', color: '#fff',
          }}>
            <div>
              <div className="serif" style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.15 }}>{b.t1}</div>
              <div className="serif" style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.15 }}>{b.t2}</div>
            </div>
            <div className="mono" style={{ fontSize: 8, letterSpacing: '.2em', opacity: .7 }}>{b.meta}</div>
          </div>
        ))}
      </div>
      <div className={night ? 'night-glass' : 'glass'} style={{ position: 'absolute', bottom: 18, left: 18, right: 18, padding: '10px 14px', borderRadius: 14, zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: '.2em', opacity: .7, color: night ? '#b89ad8' : '#7a3a8a' }}>ROMANCE · FANTASY · SLICE OF LIFE</span>
        <span style={{ fontSize: 13, color: night ? '#f6eafd' : '#0c0612' }}>↗</span>
      </div>
    </div>
  );
}

function FeatureArt({ kind, night }: { kind: string; night: boolean }) {
  if (kind === 'sanctuary') return <SanctuaryArt night={night} />;
  if (kind === 'fanfic')    return <FanficArt night={night} />;
  return <IkigaiOrb night={night} />;
}

/* ══════════════════════════════════════════════════
   FEATURE ROW — alternating
══════════════════════════════════════════════════ */
function FeatureRow({ f, flip, night }: { f: Feature; flip: boolean; night: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3]);
  const ink = night ? '#f6eafd' : '#0c0612';
  const muted = night ? '#c8b4dc' : '#3a2a4a';

  return (
    <div ref={ref} style={{ padding: '48px 0', maxWidth: 1320, margin: '0 auto' }}>
      <motion.div style={{ opacity }}>
        <div style={{ display: 'grid', gridTemplateColumns: flip ? '5fr 7fr' : '7fr 5fr', gap: 60, alignItems: 'center' }}>
          <motion.div
            style={{ order: flip ? 2 : 1 }}
            initial={{ opacity: 0, x: flip ? 100 : -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [.16, 1, .3, 1], delay: .1 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="serif" style={{ fontSize: 140, fontWeight: 300, lineHeight: .85, letterSpacing: '-.05em', color: 'transparent', WebkitTextStroke: `1.4px ${night ? 'rgba(184,154,216,.35)' : 'rgba(122,58,138,.28)'}`, marginBottom: -12, marginLeft: -6 }}>{f.n}</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.28em', opacity: .65, marginBottom: 16, color: night ? '#b89ad8' : '#7a3a8a' }}>{f.tag}</div>
            <h3 className="serif" style={{ fontSize: 54, fontWeight: 300, lineHeight: 1.02, letterSpacing: '-.035em', margin: '0 0 6px', color: ink }}>{f.title}</h3>
            <div className="serif" style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 300, opacity: .6, marginBottom: 24, color: muted }}>— {f.it}</div>
            <p style={{ fontSize: 15.5, lineHeight: 1.8, opacity: .82, maxWidth: 480, fontWeight: 300, marginBottom: 24, color: muted, fontFamily: "'DM Sans', sans-serif" }}>{f.body}</p>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 22px', marginBottom: 28, padding: 0 }}>
              {f.points.map(p => (
                <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, opacity: .78, color: muted, fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: night ? '#e89aae' : '#7a3a8a', flexShrink: 0 }} />
                  {p}
                </li>
              ))}
            </ul>
            <button className={`serif ${night ? 'night-glass' : 'glass'}`} style={{ padding: '13px 24px', borderRadius: 50, fontSize: 13, fontStyle: 'italic', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, color: ink }}>
              Explore {f.title} →
            </button>
          </motion.div>
          <motion.div
            style={{ y, order: flip ? 1 : 2 }}
            initial={{ opacity: 0, x: flip ? -160 : 160 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <FeatureArt kind={f.art} night={night} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   THREE GARDENS
══════════════════════════════════════════════════ */
function NumberedFeatures({ night }: { night: boolean }) {
  const features: Feature[] = [
    { n: '01', tag: 'WRITING SPACE', title: 'The Sanctuary', it: "a room of one's own",
      body: 'A full-screen, distraction-free editor with shifting lavender gradients. The cursor breathes. The page feels like paper at 4am.',
      points: ['Auto-save every keystroke', 'Soft typewriter feedback', 'Word-count whisper', 'Daily prompt at sunrise'],
      art: 'sanctuary' },
    { n: '02', tag: 'COMMUNITY', title: 'Fan Fiction', it: 'stories worth retelling',
      body: 'Shelves of romance, fantasy, slice-of-life — written by women who grew up in the spaces between fandoms. Read, write, and follow your favorite voices.',
      points: ['Chapter-by-chapter publishing', 'Reader bookmarks & comments', 'Fandom-aware tagging', 'Cover art generator'],
      art: 'fanfic' },
    { n: '03', tag: 'JOURNAL', title: 'Ikigai Pages', it: 'what you love, what you create',
      body: 'Three intersecting circles: what you love, what you make, what the world needs. A daily morning journal that maps your inner garden.',
      points: ['Three-prompt morning ritual', 'Mood archive & seasons', 'Private by default', 'Export as PDF zine'],
      art: 'ikigai' },
  ];
  const ink = night ? '#f6eafd' : '#0c0612';
  const accent = night ? '#e89aae' : '#7a3a8a';

  return (
    <section style={{ padding: '40px 24px 100px', position: 'relative', zIndex: 5 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto 72px' }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '.24em', opacity: .6, marginBottom: 18, color: night ? '#b89ad8' : '#7a3a8a' }}>(02) — THE THREE GARDENS</div>
        <h2 className="serif" style={{ fontSize: 'clamp(40px, 5.4vw, 76px)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-.035em', maxWidth: 880, margin: 0, color: ink }}>
          Three quiet rooms,<br /><em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>one garden.</em>
        </h2>
      </div>
      {features.map((f, i) => <FeatureRow key={f.n} f={f} flip={i % 2 === 1} night={night} />)}
    </section>
  );
}

/* ══════════════════════════════════════════════════
   CINEMATIC MANIFESTO — dark parallax section
══════════════════════════════════════════════════ */
function CinematicSection({ night }: { night: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={ref} style={{ position: 'relative', padding: '120px 24px 140px', color: '#f6eafd', overflow: 'hidden', zIndex: 5, background: 'linear-gradient(180deg,#0a0518 0%,#1a0a30 30%,#2a1a48 70%,#1a0a30 100%)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: `linear-gradient(180deg,${night ? '#0a0518' : '#f7f3ff'},transparent)`, zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(0deg,${night ? '#0a0518' : '#f7f3ff'},transparent)`, zIndex: 2, pointerEvents: 'none' }} />

      {/* Star field + moon */}
      <motion.div style={{ position: 'absolute', inset: '-10% 0', y, zIndex: 1, opacity: .85 }}>
        <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
          {[...Array(120)].map((_, i) => {
            const sx = (i * 173) % 1440, sy = (i * 97) % 1000;
            return <circle key={i} cx={sx} cy={sy} r={(i % 5) * .4 + .5} fill="#fff" opacity={.3 + (i % 5) * .15} />;
          })}
          <defs>
            <radialGradient id="cm-moon" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#fff8e8" />
              <stop offset=".4" stopColor="#e8d4b8" />
              <stop offset=".7" stopColor="#7a5838" />
              <stop offset="1" stopColor="#1a0a08" />
            </radialGradient>
          </defs>
          <circle cx="720" cy="320" r="160" fill="rgba(255,235,200,.05)" />
          <circle cx="720" cy="320" r="80" fill="url(#cm-moon)" />
          <ellipse cx="748" cy="320" rx="32" ry="80" fill="rgba(8,4,15,.4)" />
        </svg>
      </motion.div>

      <div style={{ position: 'relative', zIndex: 5, maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [.16, 1, .3, 1] }} viewport={{ once: true }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '.32em', opacity: .6, marginBottom: 32, color: '#b89ad8' }}>(03) — THE QUIET MANIFESTO</div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: .1, ease: [.16, 1, .3, 1] }} viewport={{ once: true }}
          className="serif"
          style={{ fontSize: 'clamp(56px, 8.4vw, 132px)', fontWeight: 300, lineHeight: .95, letterSpacing: '-.045em', margin: 0 }}>
          <span style={{ display: 'block' }}>Write from the</span>
          <span style={{ display: 'block', fontStyle: 'italic', background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>still heart</span>
          <span style={{ display: 'block' }}>of you.</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: .85 }}
          transition={{ duration: 1, delay: .4 }} viewport={{ once: true }}
          className="serif" style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 300, marginTop: 40, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, color: '#c8b4dc' }}>
          Not the loud heart that posts. Not the anxious heart that performs. The still heart — the one that knows what it knows, even when no one is watching.
        </motion.p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   FEATURED STORIES GRID
══════════════════════════════════════════════════ */
type StoryBg = 'spring' | 'fan' | 'autumn' | 'moon';
interface Story { tag: string; title: string; author: string; meta: string; bg: StoryBg; }

function StoryCard({ s, night, delay }: { s: Story; night: boolean; delay: number }) {
  const arts: Record<StoryBg, { bg: string; emoji: string }> = {
    spring: { bg: `linear-gradient(160deg,${night ? '#5a2868' : '#fadbf0'},${night ? '#3a1a52' : '#f4e4ff'})`, emoji: '🌸' },
    fan:    { bg: `linear-gradient(160deg,${night ? '#3a1a52' : '#e4d4f8'},${night ? '#180a28' : '#fde4ec'})`, emoji: '📜' },
    autumn: { bg: `linear-gradient(160deg,${night ? '#5a3828' : '#ffe4d4'},${night ? '#3a1a18' : '#fadbc8'})`, emoji: '🍁' },
    moon:   { bg: `linear-gradient(160deg,${night ? '#0a0518'  : '#1a0a30'},${night ? '#1a0a30'  : '#3a1a52'})`, emoji: '🌕' },
  };
  const a = arts[s.bg];
  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: .6, delay, ease: [.16, 1, .3, 1] }} viewport={{ once: true }}
      whileHover={{ y: -6 }} style={{ cursor: 'pointer' }}>
      <div style={{ aspectRatio: '3/4', borderRadius: 18, background: a.bg, position: 'relative', overflow: 'hidden', border: `1px solid ${night ? 'rgba(184,154,216,.18)' : 'rgba(122,58,138,.1)'}` }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 78, opacity: .55 }}>{a.emoji}</div>
        {s.bg === 'moon' && [...Array(18)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`, width: 2, height: 2, borderRadius: '50%', background: '#fff', opacity: .4 + (i % 4) * .15 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(0,0,0,.45))' }} />
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '.18em', padding: '5px 10px', background: 'rgba(255,255,255,.85)', color: '#0c0612', borderRadius: 50 }}>{s.tag}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, color: '#fff' }}>
          <div className="serif" style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.2, letterSpacing: '-.015em', marginBottom: 8 }}>{s.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: .85, fontFamily: "'DM Sans', sans-serif" }}>
            <span>— {s.author}</span><span>{s.meta}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedStories({ night }: { night: boolean }) {
  const stories: Story[] = [
    { tag: 'POEM · TANKA',     title: 'Instructions for forgetting',   author: 'Aiko Y.',      meta: '2.4k ♡',    bg: 'spring' },
    { tag: 'FAN FIC · ROMANCE',title: 'A Thousand Lanterns, ch. 03',   author: 'lunarblooms',  meta: '12 chapters',bg: 'fan'    },
    { tag: 'POEM · HAIKU',     title: 'Petals remember',               author: 'Mira K.',      meta: '847 ♡',     bg: 'autumn' },
    { tag: 'FAN FIC · FANTASY', title: 'Beneath the Same Moon',        author: 'sora.tales',   meta: '42 chapters',bg: 'moon'   },
  ];
  const ink = night ? '#f6eafd' : '#0c0612';
  const accent = night ? '#e89aae' : '#7a3a8a';
  return (
    <section style={{ padding: '80px 24px 120px', position: 'relative', zIndex: 5 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.24em', opacity: .6, marginBottom: 18, color: night ? '#b89ad8' : '#7a3a8a' }}>(04) — VOICES THIS WEEK</div>
            <h2 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-.035em', margin: 0, color: ink }}>
              Reading from<br />the <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>garden.</em>
            </h2>
          </div>
          <button className={`serif ${night ? 'night-glass' : 'glass'}`} style={{ padding: '13px 24px', borderRadius: 50, fontSize: 13, fontStyle: 'italic', cursor: 'pointer', color: ink }}>
            Browse all →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {stories.map((s, i) => <StoryCard key={i} s={s} night={night} delay={i * .1} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   CTA
══════════════════════════════════════════════════ */
function CTA({ night, onBeginWriting }: { night: boolean; onBeginWriting: () => void }) {
  const ink = night ? '#f6eafd' : '#0c0612';
  const accent = night ? '#e89aae' : '#7a3a8a';
  return (
    <section style={{ padding: '80px 24px', position: 'relative', zIndex: 5 }}>
      <div className={night ? 'night-glass' : 'glass'} style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 40, padding: '80px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden', color: ink }}>
        <div style={{ position: 'absolute', inset: 0, background: night
          ? 'radial-gradient(ellipse at 50% 50%,rgba(232,154,184,.18),transparent 70%)'
          : 'radial-gradient(ellipse at 50% 50%,rgba(248,200,224,.45),transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '.24em', opacity: .65, marginBottom: 24, color: night ? '#b89ad8' : '#7a3a8a' }}>BEGIN TODAY</div>
          <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 300, lineHeight: 1, letterSpacing: '-.04em', marginBottom: 0, color: ink }}>
            Plant your <em style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>first poem.</em>
          </h2>
          <p className="serif" style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 300, opacity: .78, maxWidth: 520, margin: '24px auto 36px', lineHeight: 1.55, color: ink }}>
            Free for your first 50 poems. Always. No credit card. No algorithm. Just words and the women who write them.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }} onClick={onBeginWriting}
              style={{ padding: '15px 30px', borderRadius: 60, background: night ? '#f6eafd' : '#0c0612', color: night ? '#0c0612' : '#f7f3ff', fontSize: 13.5, fontWeight: 500, letterSpacing: '.04em', display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: 'none', boxShadow: '0 12px 40px rgba(12,6,18,.3)', fontFamily: "'DM Sans', sans-serif" }}>
              Begin your garden
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: night ? '#0c0612' : '#f7f3ff', color: night ? '#f6eafd' : '#0c0612', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>→</span>
            </motion.button>
            <button className="serif" style={{ padding: '15px 18px', fontSize: 13.5, fontStyle: 'italic', opacity: .78, background: 'transparent', border: 'none', cursor: 'pointer', color: ink }}>
              Read a sample poem ⏵
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════ */
function LandingFooter({ night }: { night: boolean }) {
  const { openPage, setSignInOpen } = useMuseStore();
  const { isSignedIn } = useUser();
  const go = (action: () => void) => isSignedIn ? action() : setSignInOpen(true);
  const ink = night ? '#f6eafd' : '#0c0612';
  const muted = night ? 'rgba(184,154,216,.55)' : 'rgba(122,58,138,.55)';
  const bd = night ? 'rgba(184,154,216,.12)' : 'rgba(122,58,138,.08)';
  const lnk = night ? 'rgba(200,180,220,.78)' : 'rgba(58,42,74,.78)';
  const cols = [
    { h: 'Write',   l: [{ label: 'Sanctuary',     action: () => go(() => openPage('sanctuary'))      }, { label: 'New poem',    action: () => go(() => openPage('new poem'))     }, { label: 'Fan fiction',    action: () => go(() => openPage('fan fiction')) }, { label: 'Ikigai journal', action: () => go(() => openPage('ikigai journal')) }] },
    { h: 'Read',    l: [{ label: 'Discover',       action: () => go(() => openPage('explore'))        }, { label: 'Featured poets', action: () => go(() => openPage('explore'))  }, { label: 'Trending',       action: () => go(() => openPage('explore'))     }, { label: 'Collections',    action: () => go(() => openPage('collections'))   }] },
    { h: 'Account', l: [{ label: 'Sign in',        action: () => setSignInOpen(true)        }, { label: 'Settings',       action: () => go(() => openPage('settings'))    }, { label: 'Help',           action: () => {}                         }] },
    { h: 'Muse',    l: [{ label: 'About',          action: () => {}                         }, { label: 'Manifesto',   action: () => {}                       }, { label: 'Careers',        action: () => {}                      }, { label: 'Press',          action: () => {}                         }] },
  ];

  return (
    <footer style={{ padding: '48px 24px 36px', position: 'relative', zIndex: 5, borderTop: `1px solid ${bd}`, color: ink }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 48, alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="4.5" fill="#7a3a8a" />
              <g transform="translate(18,18)">
                {[0, 72, 144, 216, 288].map((a, i) => (
                  <ellipse key={a} rx="5.5" ry="9.5" fill={i < 2 ? 'rgba(248,200,224,.95)' : 'rgba(232,212,248,.92)'}
                    stroke="rgba(160,124,200,.55)" strokeWidth=".7" transform={`rotate(${a}) translate(0,-9)`} />
                ))}
              </g>
            </svg>
            <div style={{ lineHeight: 1.05 }}>
              <div className="serif" style={{ fontSize: 20, fontWeight: 400, letterSpacing: '-.02em', color: ink }}>Muse</div>
              <div style={{ fontSize: 9, letterSpacing: '.18em', opacity: .55, marginTop: 2, textTransform: 'uppercase', color: ink, fontFamily: "'DM Sans', sans-serif" }}>garden of poetry</div>
            </div>
          </div>
          <p className="serif" style={{ fontSize: 13.5, fontStyle: 'italic', opacity: .7, maxWidth: 280, lineHeight: 1.6, fontWeight: 300, color: ink, margin: 0 }}>
            Made slowly, with love, in Mumbai &amp; Kyoto. For every woman who writes at 4am.
          </p>
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.22em', opacity: .55, marginBottom: 14, color: ink }}>{c.h.toUpperCase()}</div>
            {c.l.map(item => (
              <button key={item.label} onClick={item.action} style={{ display: 'block', fontSize: 13, opacity: .78, padding: '5px 0', color: lnk, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'opacity .2s', width: '100%', textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '.78')}
              >{item.label}</button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1320, margin: '48px auto 0', paddingTop: 24, borderTop: `1px solid ${bd}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: .6, color: muted }}>
        <span className="mono">© 2026 MUSE · KYOTO ↔ MUMBAI</span>
        <span className="mono">SOFT POWER · QUIET REVOLUTION ✦</span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════ */
export default function HomeLanding() {
  const { night, openPage, setSignInOpen } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const page = searchParams.get('page');
    if (page && isLoaded && isSignedIn) { openPage(page); router.replace('/'); }
  }, [isLoaded, isSignedIn, searchParams, openPage, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleBeginWriting() {
    if (!isLoaded) return;
    if (isSignedIn) openPage('write');
    else setSignInOpen(true);
  }

  return (
    <div style={{ overflowX: 'hidden', position: 'relative', minHeight: '100vh' }}>
      <MeshOrbsBg night={night} />
      <ParticlesBg night={night} />
      <Drawer />
      <AppOverlay />
      <SignInModal />
      <GlassNav scrolled={scrolled} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hero night={night} onBeginWriting={handleBeginWriting} />
        <Editorial night={night} />
        <NumberedFeatures night={night} />
        <CinematicSection night={night} />
        <FeaturedStories night={night} />
        <CTA night={night} onBeginWriting={handleBeginWriting} />
        <LandingFooter night={night} />
      </div>
    </div>
  );
}
