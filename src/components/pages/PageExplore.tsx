'use client';
import { useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';
import { Chip } from '@/components/ui/Chip';

interface Props { night: boolean; }

const featured = [
  { title: 'Autumn Rain', author: 'Yuki M.', form: 'Haiku', excerpt: 'Autumn rain taps soft / on the window where I wait / for your voice to come', likes: 284, color: 'gold' as const },
  { title: 'Letters to No One', author: 'Celia R.', form: 'Free verse', excerpt: 'I have written you into existence / with borrowed metaphors and / the ache of 3am', likes: 512, color: 'purple' as const },
  { title: 'First Bloom', author: 'Priya S.', form: 'Tanka', excerpt: 'Cherry petals fall / into the space between us — / spring is a question', likes: 197, color: 'rose' as const },
];

const moods = ['All moods', '🌙 Night', '🌸 Spring', '💔 Loss', '🌿 Nature', '🌅 Dawn', '✨ Hope'];
const tags = ['Haiku', 'Free verse', 'Sonnet', 'Tanka', 'Villanelle', 'Ode'];

export function PageExplore({ night }: Props) {
  const [mood, setMood] = useState('All moods');
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Discover</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Explore</div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input placeholder="Search poems, forms, moods…" style={{
          width: '100%', padding: '12px 18px 12px 42px', borderRadius: 50,
          border: `1.5px solid ${cardBd}`, background: cardBg,
          backdropFilter: 'blur(18px)', color: ink, fontSize: 13,
          fontFamily: "'DM Sans',sans-serif", outline: 'none',
        }} />
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: ink3, fontSize: 15 }}>🔍</span>
      </div>

      {/* Mood filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {moods.map(m => (
          <button key={m} onClick={() => setMood(m)} style={{
            padding: '5px 14px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
            background: mood === m ? 'rgba(124,58,237,.18)' : 'transparent',
            border: `1px solid ${mood === m ? 'rgba(124,58,237,.35)' : cardBd}`,
            color: mood === m ? '#c084fc' : ink3, fontFamily: "'DM Sans',sans-serif",
          }}>{m}</button>
        ))}
      </div>

      {/* Featured */}
      <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 12 }}>Featured Today</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {featured.map(p => (
          <Tilt key={p.title} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '20px 22px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <Chip label={p.form} color={p.color} />
              <span style={{ fontSize: 11, color: ink3 }}>♡ {p.likes}</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, color: ink, marginBottom: 8 }}>{p.title}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 12 }}>{p.excerpt}</div>
            <div style={{ fontSize: 10, color: ink3 }}>by {p.author}</div>
          </Tilt>
        ))}
      </div>

      {/* Tags */}
      <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 12 }}>Browse by Form</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {tags.map(t => (
          <Tilt key={t} style={{ borderRadius: 16, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '14px 22px', cursor: 'pointer' }}>
            <div style={{ fontSize: 14, color: ink, fontFamily: "'Playfair Display',serif", fontWeight: 400 }}>{t}</div>
          </Tilt>
        ))}
      </div>
    </div>
  );
}
