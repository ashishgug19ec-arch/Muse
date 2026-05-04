'use client';
import { useState } from 'react';

interface Props { night: boolean; }

const prompts = [
  'Write about the last thing that made you stop and look twice.',
  'A letter to the moon from someone who misses the sun.',
  'Describe silence as if it had a texture.',
  'The colour of forgetting.',
];

export function PageNewPoem({ night }: Props) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('Free verse');
  const [prompt, setPrompt] = useState(prompts[0]);
  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const forms = ['Free verse', 'Haiku', 'Sonnet', 'Tanka', 'Ode', 'Villanelle'];

  return (
    <div style={{
      flex: 1, display: 'flex', height: '100%',
      background: n ? 'linear-gradient(160deg,#1a0c2e,#0f0620)' : 'linear-gradient(160deg,rgba(238,230,255,.95),rgba(252,228,240,.9))',
    }}>
      {/* Left: prompt panel */}
      <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${cardBd}`, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 10 }}>Today&apos;s Prompts</div>
        {prompts.map(p => (
          <button key={p} onClick={() => setPrompt(p)} style={{
            padding: '12px 14px', borderRadius: 14, border: `1px solid ${prompt === p ? 'rgba(124,58,237,.35)' : cardBd}`,
            background: prompt === p ? 'rgba(124,58,237,.1)' : 'transparent',
            color: prompt === p ? '#c084fc' : ink3, fontSize: 12, cursor: 'pointer', textAlign: 'left',
            fontFamily: "'Playfair Display',serif", fontStyle: 'italic', lineHeight: 1.6,
          }}>{p}</button>
        ))}

        <div style={{ height: 1, background: cardBd, margin: '12px 0' }} />
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 8 }}>Form</div>
        {forms.map(f => (
          <button key={f} onClick={() => setForm(f)} style={{
            padding: '8px 14px', borderRadius: 50, border: `1px solid ${form === f ? 'rgba(124,58,237,.35)' : cardBd}`,
            background: form === f ? 'rgba(124,58,237,.18)' : 'transparent',
            color: form === f ? '#c084fc' : ink3, fontSize: 11, cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif", textAlign: 'left',
          }}>{f}</button>
        ))}
      </div>

      {/* Right: editor */}
      <div style={{ flex: 1, padding: '40px 70px', display: 'flex', flexDirection: 'column' }}>
        {/* Active prompt */}
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink3, marginBottom: 28, lineHeight: 1.7 }}>
          ✦ {prompt}
        </div>

        {/* Title */}
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Untitled poem" style={{
          fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300,
          color: ink, background: 'transparent', border: 'none', outline: 'none',
          letterSpacing: '-.03em', marginBottom: 28,
          borderBottom: `1px solid ${cardBd}`, paddingBottom: 10, width: '100%',
        }} />

        {/* Body */}
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Begin here…" style={{
          flex: 1, fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 300,
          fontStyle: 'italic', lineHeight: 2.1, color: n ? 'rgba(230,215,255,.85)' : '#4a3960',
          background: 'transparent', border: 'none', outline: 'none', resize: 'none', minHeight: 200,
        }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: `1px solid ${cardBd}`, marginTop: 20 }}>
          <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>
            {text.split(/\s+/).filter(Boolean).length} words · {form}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '10px 22px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Save draft</button>
            <button style={{ padding: '10px 28px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'Playfair Display',serif", letterSpacing: '.05em', boxShadow: '0 6px 24px rgba(124,58,237,.3)' }}>Publish</button>
          </div>
        </div>
      </div>
    </div>
  );
}
