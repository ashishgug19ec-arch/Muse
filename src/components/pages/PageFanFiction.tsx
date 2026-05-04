'use client';
import { useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';
import { Chip } from '@/components/ui/Chip';

interface Props { night: boolean; }

const stories = [
  { title: 'Between Worlds', fandom: 'Studio Ghibli', author: 'Yuki M.', chapters: 12, reads: '4.2k', updated: 'Apr 12', excerpt: 'The spirit realm opens at midnight, when the lanterns forget to shine…', color: 'purple' as const },
  { title: 'Letters from the Sea', fandom: 'Original', author: 'Celia R.', chapters: 3, reads: '1.8k', updated: 'Apr 9', excerpt: 'Every tide brings a letter she never expected to answer…', color: 'rose' as const },
  { title: 'Paper Cranes', fandom: 'Spirited Away', author: 'Mei L.', chapters: 8, reads: '6.1k', updated: 'Apr 5', excerpt: 'One thousand cranes for a single impossible wish…', color: 'gold' as const },
  { title: 'Moonless Garden', fandom: 'Original', author: 'Priya S.', chapters: 5, reads: '2.3k', updated: 'Mar 28', excerpt: 'She tended the flowers that only bloomed in darkness…', color: 'sage' as const },
  { title: 'The Last Firefly', fandom: 'Grave of the Fireflies', author: 'Yuki M.', chapters: 1, reads: '9.4k', updated: 'Mar 15', excerpt: 'Not a continuation. A remembering. A small mercy…', color: 'night' as const },
  { title: 'Ink and Stars', fandom: 'Original', author: 'Sora K.', chapters: 22, reads: '11.2k', updated: 'Mar 2', excerpt: 'The cartographer mapped every star except the one she lived on…', color: 'purple' as const },
];

const fandoms = ['All', 'Original', 'Studio Ghibli', 'Spirited Away'];

export function PageFanFiction({ night }: Props) {
  const [fandom, setFandom] = useState('All');
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  const filtered = fandom === 'All' ? stories : stories.filter(s => s.fandom === fandom);

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Discover</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Fan Fiction</div>
        </div>
        <button style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>+ New Story</button>
      </div>

      {/* Fandom filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {fandoms.map(f => (
          <button key={f} onClick={() => setFandom(f)} style={{
            padding: '6px 16px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
            background: fandom === f ? 'rgba(124,58,237,.18)' : 'transparent',
            border: `1px solid ${fandom === f ? 'rgba(124,58,237,.35)' : cardBd}`,
            color: fandom === f ? '#c084fc' : ink3, fontFamily: "'DM Sans',sans-serif",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {filtered.map(s => (
          <Tilt key={s.title} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '20px 22px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Chip label={s.fandom} color={s.color} />
              <span style={{ fontSize: 10, color: ink3 }}>{s.chapters} ch · {s.reads} reads</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, color: ink, marginBottom: 8 }}>{s.title}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 14 }}>"{s.excerpt}"</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: ink3 }}>
              <span>by {s.author}</span>
              <span>Updated {s.updated}</span>
            </div>
          </Tilt>
        ))}
      </div>
    </div>
  );
}
