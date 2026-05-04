'use client';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

const plans = [
  {
    name: 'Garden',
    price: 'Free',
    sub: 'forever',
    color: 'sage' as const,
    features: ['Unlimited poems', '3 collections', 'Basic mood tags', 'Community access'],
    cta: 'Current plan',
    active: true,
  },
  {
    name: 'Sanctuary',
    price: '$6',
    sub: 'per month',
    color: 'purple' as const,
    features: ['Everything in Garden', 'Unlimited collections', 'Ikigai journal', 'Fan fiction access', 'Advanced analytics', 'Priority support'],
    cta: 'Upgrade →',
    active: false,
  },
  {
    name: 'Bloom',
    price: '$12',
    sub: 'per month',
    color: 'rose' as const,
    features: ['Everything in Sanctuary', 'Early access to new features', 'Featured poet opportunities', 'Custom profile themes', 'Export in PDF & EPUB'],
    cta: 'Go Bloom →',
    active: false,
  },
];

export function PagePricing({ night }: Props) {
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 8 }}>Account</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, marginBottom: 10 }}>Choose your garden</div>
        <div style={{ fontSize: 14, color: ink3, fontWeight: 300, fontStyle: 'italic' }}>Every plan includes our full writing sanctuary. Upgrade for more space to grow.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {plans.map(p => (
          <Tilt key={p.name} style={{
            borderRadius: 24, border: `1.5px solid ${p.active ? 'rgba(192,132,252,.5)' : cardBd}`,
            background: p.active ? (night ? 'rgba(124,58,237,.1)' : 'linear-gradient(148deg,rgba(238,230,255,.9),rgba(252,228,240,.8))') : cardBg,
            backdropFilter: 'blur(20px)', padding: '28px 26px', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 12, color: '#c084fc', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 300, color: ink }}>{p.price}</div>
              <div style={{ fontSize: 12, color: ink3 }}>{p.sub}</div>
            </div>
            <div style={{ height: 1, background: cardBd, margin: '20px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#c084fc', fontSize: 12 }}>✦</span>
                  <span style={{ fontSize: 12, color: ink2, fontWeight: 300 }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{
              width: '100%', padding: '12px', borderRadius: 50, border: p.active ? `1px solid ${cardBd}` : 'none',
              background: p.active ? 'transparent' : 'linear-gradient(135deg,#c084fc,#7c3aed)',
              color: p.active ? ink3 : '#fff', fontSize: 12, cursor: p.active ? 'default' : 'pointer',
              fontFamily: "'DM Sans',sans-serif", boxShadow: p.active ? 'none' : '0 6px 20px rgba(124,58,237,.3)',
            }}>{p.cta}</button>
          </Tilt>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: ink3, fontWeight: 300 }}>
        All plans include a 14-day free trial. No credit card required.
      </div>
    </div>
  );
}
