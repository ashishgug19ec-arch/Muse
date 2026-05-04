'use client';
import { useState } from 'react';

interface Props { night: boolean; }

export function PageSanctuary({ night }: Props) {
  const [text, setText] = useState('Between two words\nsilence blooms like peonies—\nyou are the garden');
  const [title, setTitle] = useState('Untitled poem');
  const [mood, setMood] = useState('Reflective');
  const n = night;
  const moods = ['Reflective', 'Melancholic', 'Peaceful', 'Hopeful'];

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: n ? 'linear-gradient(160deg,#1a0c2e,#0f0620)' : 'linear-gradient(160deg,rgba(238,230,255,.95),rgba(252,228,240,.9))',
      minHeight: '100%', padding: '40px 60px',
    }}>
      {/* Mood chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {moods.map(m => (
          <button key={m} onClick={() => setMood(m)} style={{
            padding: '5px 16px', borderRadius: 50, fontSize: 11, fontWeight: 300, letterSpacing: '.04em', cursor: 'pointer',
            background: m === mood ? 'rgba(124,58,237,.18)' : (n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.55)'),
            border: m === mood ? '1px solid rgba(124,58,237,.35)' : `1px solid ${n ? 'rgba(160,124,200,.2)' : 'rgba(208,191,240,.5)'}`,
            color: m === mood ? '#c084fc' : (n ? 'rgba(200,170,255,.6)' : '#8a7aa0'),
            fontFamily: "'DM Sans',sans-serif",
          }}>{m}</button>
        ))}
      </div>

      {/* Title */}
      <input value={title} onChange={e => setTitle(e.target.value)} style={{
        fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 300,
        color: n ? 'rgba(240,228,255,.88)' : '#1e1628',
        background: 'transparent', border: 'none', outline: 'none',
        letterSpacing: '-.03em', marginBottom: 32,
        borderBottom: `1px solid ${n ? 'rgba(160,124,200,.2)' : 'rgba(208,191,240,.4)'}`,
        paddingBottom: 12, width: '100%',
      }} />

      {/* Poem body */}
      <textarea value={text} onChange={e => setText(e.target.value)} style={{
        flex: 1, fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 300,
        fontStyle: 'italic', lineHeight: 2.1,
        color: n ? 'rgba(230,215,255,.85)' : '#4a3960',
        background: 'transparent', border: 'none', outline: 'none', resize: 'none',
        minHeight: 200,
      }} />

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 20,
        borderTop: `1px solid ${n ? 'rgba(160,124,200,.18)' : 'rgba(208,191,240,.35)'}`,
        marginTop: 20,
      }}>
        <div style={{ fontSize: 11, color: n ? 'rgba(160,140,200,.5)' : '#bbadd0', fontWeight: 300, letterSpacing: '.06em' }}>
          {text.split(/\s+/).filter(Boolean).length} words · autosaved
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Haiku', 'Free verse', 'Sonnet'].map(f => (
            <span key={f} style={{
              fontSize: 10, padding: '3px 12px', borderRadius: 50,
              border: `1px solid ${n ? 'rgba(160,124,200,.25)' : 'rgba(208,191,240,.52)'}`,
              color: n ? 'rgba(200,170,255,.6)' : '#8a7aa0', cursor: 'pointer',
            }}>{f}</span>
          ))}
        </div>
        <button style={{
          padding: '10px 28px', borderRadius: 50, border: 'none',
          background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)',
          color: '#fff', fontSize: 13, cursor: 'pointer',
          fontFamily: "'Playfair Display',serif", letterSpacing: '.05em',
          boxShadow: '0 6px 24px rgba(124,58,237,.3)',
        }}>Save poem</button>
      </div>
    </div>
  );
}
