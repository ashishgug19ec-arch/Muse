'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

const plans = [
  {
    name: 'Garden',
    price: 'Free',
    sub: 'forever',
    badge: null,
    color: '#90c8a8',
    grad: 'linear-gradient(135deg,#90c8a8,#5e9975)',
    features: ['Unlimited poems', '3 collections', 'Basic mood tags', 'Community access', 'Scraps & journal'],
    cta: 'Current plan',
    active: true,
  },
  {
    name: 'Sanctuary',
    price: '$6',
    sub: 'per month',
    badge: 'Most popular',
    color: '#c084fc',
    grad: 'linear-gradient(135deg,#c084fc,#7c3aed)',
    features: ['Everything in Garden', 'Unlimited collections', 'Ikigai journal', 'Fan fiction access', 'Advanced analytics', 'Priority support'],
    cta: 'Upgrade →',
    active: false,
  },
  {
    name: 'Bloom',
    price: '$12',
    sub: 'per month',
    badge: null,
    color: '#f472b6',
    grad: 'linear-gradient(135deg,#f472b6,#d06888)',
    features: ['Everything in Sanctuary', 'Early feature access', 'Featured poet opportunities', 'Custom profile themes', 'Export in PDF & EPUB'],
    cta: 'Go Bloom →',
    active: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export function PagePricing({ night }: Props) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '48px 44px 60px' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg,transparent,#c084fc)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>Pricing</span>
          <div style={{ width: 28, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: 10 }}>
          Choose your{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>garden</em>
        </h1>
        <p style={{ fontSize: 14, color: ink3, fontWeight: 300, fontStyle: 'italic', fontFamily: "'Playfair Display',serif", maxWidth: 420, margin: '0 auto 28px' }}>
          Every plan includes our full writing sanctuary. Upgrade for more space to grow.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: n ? 'rgba(255,255,255,.05)' : 'rgba(245,240,255,.85)', borderRadius: 50, border: `1px solid ${cardBd}`, padding: 3, gap: 2 }}>
          {(['monthly', 'annual'] as const).map(b => (
            <motion.button
              key={b}
              onClick={() => setBilling(b)}
              style={{ padding: '7px 20px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: 11, background: billing === b ? 'linear-gradient(135deg,#c084fc,#7c3aed)' : 'transparent', color: billing === b ? '#fff' : ink3, fontFamily: "'DM Sans',sans-serif", textTransform: 'capitalize', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              {b === 'annual' && billing === 'annual' && <span style={{ fontSize: 9, background: '#90c8a8', color: '#fff', borderRadius: 50, padding: '1px 6px' }}>−20%</span>}
              {b}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Plan cards */}
      <motion.div
        initial="hidden" animate="show" variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 940, margin: '0 auto 40px' }}
      >
        {plans.map(p => (
          <motion.div key={p.name} variants={fadeUp}>
            <Tilt style={{
              borderRadius: 26,
              border: `1.5px solid ${p.active ? 'rgba(192,132,252,.5)' : (p.badge ? 'rgba(192,132,252,.35)' : cardBd)}`,
              background: p.active
                ? (n ? 'rgba(144,200,168,.08)' : 'linear-gradient(148deg,rgba(228,248,235,.9),rgba(230,252,240,.8))')
                : (p.badge ? (n ? 'rgba(124,58,237,.1)' : 'linear-gradient(148deg,rgba(238,230,255,.95),rgba(252,228,240,.85))') : cardBg),
              backdropFilter: 'blur(20px)',
              padding: '28px 26px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Glow */}
              <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle,${p.color}25,transparent 70%)`, pointerEvents: 'none' }} />

              {/* Badge */}
              {p.badge && (
                <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 9, padding: '3px 10px', borderRadius: 50, background: p.grad, color: '#fff', letterSpacing: '.06em', fontFamily: "'DM Sans',sans-serif" }}>{p.badge}</div>
              )}

              {/* Plan name */}
              <div style={{ display: 'inline-flex', padding: '3px 12px', borderRadius: 50, background: `${p.color}18`, border: `1px solid ${p.color}35`, fontSize: 10, color: p.color, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>{p.name}</div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 300, color: ink, lineHeight: 1 }}>
                  {billing === 'annual' && p.price !== 'Free' ? `$${Math.floor(parseInt(p.price.slice(1)) * 0.8)}` : p.price}
                </div>
                <div style={{ fontSize: 11, color: ink3 }}>{p.sub}</div>
              </div>
              {billing === 'annual' && p.price !== 'Free' && (
                <div style={{ fontSize: 10, color: '#5e9975', marginBottom: 2 }}>billed annually</div>
              )}

              <div style={{ height: 1, background: n ? 'rgba(160,124,200,.18)' : 'rgba(208,191,240,.5)', margin: '18px 0' }} />

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: p.color, fontSize: 11, marginTop: 1, flexShrink: 0 }}>✦</span>
                    <span style={{ fontSize: 12, color: ink2, fontWeight: 300, lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={!p.active ? { scale: 1.03, y: -1 } : {}}
                whileTap={!p.active ? { scale: .97 } : {}}
                style={{ width: '100%', padding: '12px', borderRadius: 50, border: p.active ? `1px solid ${cardBd}` : 'none', background: p.active ? 'transparent' : p.grad, color: p.active ? ink3 : '#fff', fontSize: 12, cursor: p.active ? 'default' : 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: p.active ? 'none' : `0 6px 20px ${p.color}35` }}
              >{p.cta}</motion.button>
            </Tilt>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: ink3, fontWeight: 300 }}>All plans include a 14-day free trial · No credit card required · Cancel anytime</p>
      </motion.div>
    </div>
  );
}
