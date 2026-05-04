'use client';
import { Tilt } from '@/components/ui/Tilt';
import { Chip } from '@/components/ui/Chip';

interface Props { night: boolean; }

const collections = [
  { name: 'Moonlit Verses', emoji: '🌙', count: 12, updated: 'Apr 12', forms: ['Haiku','Free verse','Ode'], bg: 'linear-gradient(160deg,#1a1130,#2c1825)' },
  { name: 'Spring Bloom', emoji: '🌸', count: 8, updated: 'Apr 2', forms: ['Haiku','Tanka'], bg: 'linear-gradient(160deg,rgba(252,228,240,.9),rgba(238,230,255,.8))' },
  { name: 'Autumn Archive', emoji: '🍂', count: 15, updated: 'Mar 20', forms: ['Sonnet','Free verse'], bg: 'linear-gradient(160deg,rgba(255,246,228,.9),rgba(252,228,240,.8))' },
  { name: 'Forest Whispers', emoji: '🌿', count: 6, updated: 'Mar 8', forms: ['Free verse'], bg: 'linear-gradient(160deg,rgba(230,244,234,.9),rgba(238,230,255,.8))' },
  { name: 'Night Letters', emoji: '🌑', count: 9, updated: 'Feb 15', forms: ['Free verse','Villanelle'], bg: 'linear-gradient(160deg,#0f0620,#1a0c2e)' },
];

export function PageCollections({ night }: Props) {
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Collections</div>
        </div>
        <button style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>+ New Collection</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {collections.map(c => (
          <Tilt key={c.name} style={{ borderRadius: 22, overflow: 'hidden', border: `1.5px solid ${cardBd}`, cursor: 'pointer' }}>
            <div style={{ height: 110, background: c.bg, display: 'flex', alignItems: 'flex-end', padding: '14px 18px' }}>
              <div style={{ fontSize: 28 }}>{c.emoji}</div>
            </div>
            <div style={{ padding: '16px 18px', background: cardBg, backdropFilter: 'blur(18px)' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, color: ink, marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: ink3, fontWeight: 300, marginBottom: 12 }}>{c.count} poems · Updated {c.updated}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {c.forms.map(f => <Chip key={f} label={f} color="purple" />)}
              </div>
            </div>
          </Tilt>
        ))}
        <Tilt style={{ borderRadius: 22, border: `2px dashed ${cardBd}`, background: 'transparent', cursor: 'pointer', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px dashed ${cardBd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: ink3 }}>+</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>New Collection</div>
        </Tilt>
      </div>
    </div>
  );
}
