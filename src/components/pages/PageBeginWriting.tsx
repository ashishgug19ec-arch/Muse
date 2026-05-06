'use client';
import { motion } from 'framer-motion';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const options = [
  {
    icon: '✍️',
    title: 'Poem',
    desc: 'A distraction-free sanctuary where your words bloom in silence.',
    page: 'Sanctuary' as const,
    cta: 'Write a poem',
    light: {
      bg: 'linear-gradient(160deg,rgba(238,230,255,.95),rgba(252,228,240,.85))',
      border: 'rgba(208,191,240,.6)',
      ctaBg: 'linear-gradient(135deg,#c084fc,#7c3aed)',
      ctaColor: '#fff',
      orb: 'rgba(192,132,252,.2)',
      glow: 'rgba(124,58,237,.12)',
    },
    dark: {
      bg: 'linear-gradient(160deg,rgba(124,58,237,.15),rgba(208,100,136,.08))',
      border: 'rgba(160,124,200,.3)',
      ctaBg: 'linear-gradient(135deg,#c084fc,#7c3aed)',
      ctaColor: '#fff',
      orb: 'rgba(192,132,252,.15)',
      glow: 'rgba(124,58,237,.2)',
    },
  },
  {
    icon: '🌙',
    title: 'Fan Fiction',
    desc: 'Poetic reimaginings of the worlds and characters you love.',
    page: 'FanFiction' as const,
    cta: 'Write fan fiction',
    light: {
      bg: 'linear-gradient(160deg,#1e1030,#2a1428)',
      border: 'rgba(160,124,200,.3)',
      ctaBg: 'rgba(192,132,252,.2)',
      ctaColor: '#c084fc',
      orb: 'rgba(244,114,182,.15)',
      glow: 'rgba(124,58,237,.25)',
    },
    dark: {
      bg: 'linear-gradient(160deg,#12081e,#200c18)',
      border: 'rgba(160,124,200,.25)',
      ctaBg: 'rgba(192,132,252,.18)',
      ctaColor: '#c084fc',
      orb: 'rgba(244,114,182,.12)',
      glow: 'rgba(124,58,237,.2)',
    },
  },
  {
    icon: '🌿',
    title: 'Quick scrap',
    desc: 'Capture a fragment before it slips — a line, a phrase, a fleeting image.',
    page: 'Scraps' as const,
    cta: 'Save a scrap',
    light: {
      bg: 'linear-gradient(160deg,rgba(228,248,234,.95),rgba(232,252,240,.88))',
      border: 'rgba(144,200,168,.5)',
      ctaBg: 'linear-gradient(135deg,#90c8a8,#5e9975)',
      ctaColor: '#fff',
      orb: 'rgba(144,200,168,.2)',
      glow: 'rgba(94,153,117,.1)',
    },
    dark: {
      bg: 'linear-gradient(160deg,rgba(94,153,117,.12),rgba(94,153,117,.06))',
      border: 'rgba(144,200,168,.28)',
      ctaBg: 'linear-gradient(135deg,#90c8a8,#5e9975)',
      ctaColor: '#fff',
      orb: 'rgba(144,200,168,.15)',
      glow: 'rgba(94,153,117,.15)',
    },
  },
];

export function PageBeginWriting({ night }: Props) {
  const { openPage } = useMuseStore();
  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 44px',
      minHeight: '100%',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,.12),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,.1),transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', right: '20%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(144,200,168,.1),transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ textAlign: 'center', marginBottom: 52 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,transparent,#c084fc)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>Begin writing</span>
          <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 12 }}>
          What would you like<br />to write today?
        </h1>
        <p style={{ fontSize: 14, color: ink3, fontWeight: 300, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>
          Choose your sanctuary.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        initial="hidden" animate="show" variants={stagger}
        style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 860 }}
      >
        {options.map(opt => {
          const theme = n ? opt.dark : opt.light;
          return (
            <motion.button
              key={opt.title}
              variants={fadeUp}
              onClick={() => openPage(opt.page)}
              whileHover={{ y: -6, scale: 1.012 }}
              whileTap={{ scale: .98 }}
              style={{
                flex: 1, minWidth: 240, maxWidth: 280,
                padding: '44px 32px', borderRadius: 28, cursor: 'pointer',
                border: `1.5px solid ${theme.border}`,
                background: theme.bg,
                backdropFilter: 'blur(20px)',
                textAlign: 'left',
                position: 'relative', overflow: 'hidden',
                boxShadow: `0 8px 32px ${theme.glow}`,
                transition: 'box-shadow .3s',
              }}
            >
              {/* Glow orb */}
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle,${theme.orb},transparent 70%)`, pointerEvents: 'none' }} />

              <div style={{ fontSize: 44, marginBottom: 22, lineHeight: 1 }}>{opt.icon}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 400, color: ink, marginBottom: 12, lineHeight: 1.2 }}>{opt.title}</div>
              <div style={{ fontSize: 13, color: n ? 'rgba(200,170,255,.65)' : '#6b5888', fontWeight: 300, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 32, fontFamily: "'Playfair Display',serif" }}>
                {opt.desc}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 22px', borderRadius: 50,
                background: theme.ctaBg,
                color: theme.ctaColor,
                fontSize: 12, fontFamily: "'DM Sans',sans-serif",
                border: theme.ctaBg.startsWith('rgba') ? `1px solid ${theme.ctaColor}35` : 'none',
                boxShadow: theme.ctaBg.startsWith('rgba') ? 'none' : `0 4px 14px ${theme.orb}`,
              }}>
                {opt.cta} →
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Footnote */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ fontSize: 11, color: ink3, marginTop: 48, fontStyle: 'italic', fontFamily: "'Playfair Display',serif", textAlign: 'center' }}
      >
        Every great poem begins with a single honest line.
      </motion.p>
    </div>
  );
}
