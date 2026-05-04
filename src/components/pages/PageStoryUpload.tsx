'use client';
import { useState } from 'react';

interface Props { night: boolean; }

export function PageStoryUpload({ night }: Props) {
  const [title, setTitle] = useState('');
  const [fandom, setFandom] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [form, setForm] = useState('Free verse');
  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    borderRadius: 14, border: `1.5px solid ${cardBd}`,
    background: cardBg, backdropFilter: 'blur(18px)',
    color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
    outline: 'none',
  };

  const forms = ['Free verse', 'Haiku', 'Sonnet', 'Tanka', 'Prose poem', 'Other'];

  return (
    <div style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Discover</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Upload Story</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your story title…" style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Fandom / Universe</label>
          <input value={fandom} onChange={e => setFandom(e.target.value)} placeholder="e.g. Original, Studio Ghibli…" style={inputStyle} />
        </div>

        <div>
          <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Form</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {forms.map(f => (
              <button key={f} onClick={() => setForm(f)} style={{
                padding: '6px 16px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
                background: form === f ? 'rgba(124,58,237,.18)' : 'transparent',
                border: `1px solid ${form === f ? 'rgba(124,58,237,.35)' : cardBd}`,
                color: form === f ? '#c084fc' : ink3, fontFamily: "'DM Sans',sans-serif",
              }}>{f}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Summary</label>
          <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="A brief summary of your story…" style={{ ...inputStyle, minHeight: 80, resize: 'none' }} />
        </div>

        <div>
          <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Chapter 1 Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Begin your story…" style={{ ...inputStyle, minHeight: 200, resize: 'none', fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', lineHeight: 2 }} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button style={{ padding: '11px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Save draft</button>
          <button style={{ padding: '11px 28px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 20px rgba(124,58,237,.3)' }}>Publish →</button>
        </div>
      </div>
    </div>
  );
}
