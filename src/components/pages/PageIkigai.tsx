'use client';
import { useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Props { night: boolean; }

const pillars = [
  { emoji: '❤️', label: 'What you love', text: 'Writing at midnight. Moon poetry. The weight of a good sentence.', color: 'rose' as const },
  { emoji: '✦', label: "What you're good at", text: 'Finding beauty in small moments. Crafting emotional verse.', color: 'sage' as const },
  { emoji: '🌍', label: 'What the world needs', text: 'Stories that hold space for grief and wonder simultaneously.', color: 'gold' as const },
  { emoji: '💜', label: 'What you can offer', text: 'A tender, honest voice that speaks to the quiet people.', color: 'purple' as const },
];

const pastEntries = [
  { date: 'Apr 11', preview: 'I wrote about the moon again. Perhaps the moon is just a metaphor…' },
  { date: 'Apr 8',  preview: 'Today felt like autumn in April. Heavy and golden at once…' },
  { date: 'Apr 3',  preview: "Something about the rain made me want to write every word I'd been holding…" },
];

export function PageIkigai({ night }: Props) {
  const [reflection, setReflection] = useState('');
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Ikigai Journal</div>
        <div style={{ fontSize: 12, color: ink3, marginTop: 4 }}>92% aligned · keep writing</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left */}
        <div>
          {/* Venn */}
          <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px', marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="240" height="220" viewBox="0 0 240 220" fill="none">
              <circle cx="120" cy="80"  r="70" fill="rgba(208,191,240,.18)" stroke="rgba(208,191,240,.5)" strokeWidth="1.2"/>
              <circle cx="80"  cy="140" r="70" fill="rgba(240,168,192,.15)" stroke="rgba(240,168,192,.45)" strokeWidth="1.2"/>
              <circle cx="160" cy="140" r="70" fill="rgba(144,184,152,.15)" stroke="rgba(144,184,152,.45)" strokeWidth="1.2"/>
              <circle cx="120" cy="115" r="70" fill="rgba(200,160,80,.12)"  stroke="rgba(200,160,80,.4)"   strokeWidth="1.2"/>
              <circle cx="120" cy="118" r="22" fill="rgba(192,132,252,.28)" stroke="rgba(192,132,252,.6)"  strokeWidth="1.5"/>
              <text x="120" y="114" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill="#7c3aed" fontWeight="400" letterSpacing=".06em">ikigai</text>
              <text x="120" y="127" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="11" fill="#c084fc" fontStyle="italic">🌸</text>
              <text x="120" y="24"  textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what you love</text>
              <text x="22"  y="175" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what you&#39;re</text>
              <text x="22"  y="186" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>good at</text>
              <text x="218" y="175" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what the</text>
              <text x="218" y="186" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>world needs</text>
              <text x="120" y="210" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what you can offer</text>
            </svg>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 300, color: ink, letterSpacing: '-.04em', marginBottom: 6 }}>92%</div>
            <ProgressBar pct={92} color="purple" />
            <div style={{ fontSize: 12, color: ink3, fontWeight: 300, marginTop: 8, fontStyle: 'italic', textAlign: 'center' }}>You are 92% aligned with your ikigai 🌸</div>
          </div>

          {/* Daily prompt */}
          <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '20px 22px', marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 10 }}>Today&apos;s Reflection</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 14 }}>What did you create today that only you could have made?</div>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Begin writing your reflection…" style={{ width: '100%', minHeight: 100, background: 'transparent', border: `1.5px solid ${cardBd}`, borderRadius: 12, padding: '12px 14px', fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 300, fontStyle: 'italic', color: ink, lineHeight: 1.8, resize: 'none', outline: 'none' }} />
          </div>

          {/* Ikigai statement */}
          <div style={{ borderRadius: 22, border: '1.5px solid rgba(192,132,252,.35)', background: night ? 'rgba(124,58,237,.1)' : 'linear-gradient(148deg,rgba(238,230,255,.9),rgba(252,228,240,.8))', padding: '20px 22px' }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 10 }}>Your Ikigai Statement</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', color: '#7c3aed', lineHeight: 1.8, fontWeight: 300 }}>"I am a poet who finds meaning in silence — writing the feelings that words almost miss, for the women who have felt the same thing but could not say it."</div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Four Pillars</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {pillars.map(p => (
              <Tilt key={p.label} style={{ borderRadius: 18, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '16px 18px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{p.emoji}</span>
                  <Chip label={p.label} color={p.color} />
                </div>
                <div style={{ fontSize: 13, color: ink2, fontWeight: 300, lineHeight: 1.7, fontStyle: 'italic' }}>"{p.text}"</div>
              </Tilt>
            ))}
          </div>

          {/* Past reflections */}
          <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '20px 22px' }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Past Reflections</div>
            {pastEntries.map((e, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? `1px solid ${cardBd}` : 'none', cursor: 'pointer' }}>
                <div style={{ fontSize: 11, color: ink3, fontWeight: 300, marginBottom: 4 }}>{e.date}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.6, fontWeight: 300 }}>{e.preview}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
