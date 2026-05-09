'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

const PROMPTS = [
  'Write about the last thing that made you stop and look twice.',
  'A letter to the moon from someone who misses the sun.',
  'Describe silence as if it had a texture.',
  'The colour of forgetting.',
  'What the river says when no one is listening.',
  'A season you carry in your body.',
  'The distance between two people in the same room.',
  'Name the thing you keep returning to.',
];

const FORMS = ['Free verse', 'Haiku', 'Sonnet', 'Tanka', 'Ode', 'Villanelle', 'Ghazal'];

export function PageNewPoem({ night }: Props) {
  const { openPage } = useMuseStore();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('Free verse');
  const [prompt, setPrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  async function save(visibility: 'private' | 'public') {
    if (!title.trim() || !text.trim()) {
      setError('Please add a title and some words first.');
      return;
    }
    setSaving(true); setError(''); setSaved(false);
    try {
      const res = await fetch('/api/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: text, type: form, visibility }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to save.');
      } else {
        setSaved(true);
        setTitle(''); setText(''); setForm('Free verse');
        setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
        setTimeout(() => setSaved(false), 3000);
        if (visibility === 'public') setTimeout(() => openPage('library'), 1200);
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      flex: 1, display: 'flex', height: '100%',
      background: n ? 'linear-gradient(160deg,#1a0c2e,#0f0620)' : 'linear-gradient(160deg,rgba(238,230,255,.95),rgba(252,228,240,.9))',
    }}>

      {/* Left: prompt + form panel */}
      <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${cardBd}`, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 10 }}>Today's Prompts</div>
        {PROMPTS.slice(0, 5).map(p => (
          <motion.button
            key={p}
            onClick={() => setPrompt(p)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
            style={{
              padding: '12px 14px', borderRadius: 14, border: `1px solid ${prompt === p ? 'rgba(124,58,237,.35)' : cardBd}`,
              background: prompt === p ? 'rgba(124,58,237,.1)' : 'transparent',
              color: prompt === p ? '#c084fc' : ink3, fontSize: 12, cursor: 'pointer', textAlign: 'left',
              fontFamily: "'Playfair Display',serif", fontStyle: 'italic', lineHeight: 1.6,
              transition: 'all .2s',
            }}
          >{p}</motion.button>
        ))}

        <div style={{ height: 1, background: cardBd, margin: '12px 0' }} />
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 8 }}>Form</div>
        {FORMS.map(f => (
          <button
            key={f}
            onClick={() => setForm(f)}
            style={{
              padding: '8px 14px', borderRadius: 50, border: `1px solid ${form === f ? 'rgba(124,58,237,.35)' : cardBd}`,
              background: form === f ? 'rgba(124,58,237,.18)' : 'transparent',
              color: form === f ? '#c084fc' : ink3, fontSize: 11, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif", textAlign: 'left',
              transition: 'all .15s',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Right: editor */}
      <div style={{ flex: 1, padding: '40px 70px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Active prompt */}
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink3, marginBottom: 28, lineHeight: 1.7 }}>
          ✦ {prompt}
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled poem"
          style={{
            fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300,
            color: ink, background: 'transparent', border: 'none', outline: 'none',
            letterSpacing: '-.03em', marginBottom: 28,
            borderBottom: `1px solid ${cardBd}`, paddingBottom: 10, width: '100%',
          }}
        />

        {/* Body */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Begin here…"
          style={{
            flex: 1, fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 300,
            fontStyle: 'italic', lineHeight: 2.1, color: n ? 'rgba(230,215,255,.85)' : '#4a3960',
            background: 'transparent', border: 'none', outline: 'none', resize: 'none', minHeight: 260,
          }}
        />

        {/* Bottom bar */}
        <div style={{ paddingTop: 20, borderTop: `1px solid ${cardBd}`, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'} · {form}
              </span>
              <AnimatePresence>
                {error && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 11, color: '#e05080' }}>{error}</motion.span>
                )}
                {saved && (
                  <motion.span initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 11, color: '#7c3aed' }}>✓ Saved!</motion.span>
                )}
              </AnimatePresence>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button
                onClick={() => save('private')}
                disabled={saving}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
                style={{ padding: '10px 22px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif" }}
              >
                {saving ? 'Saving…' : 'Save draft'}
              </motion.button>
              <motion.button
                onClick={() => save('public')}
                disabled={saving}
                whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .97 }}
                style={{ padding: '10px 28px', borderRadius: 50, border: 'none', background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)', color: '#fff', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Playfair Display',serif", letterSpacing: '.05em', boxShadow: saving ? 'none' : '0 6px 24px rgba(124,58,237,.3)' }}
              >
                Publish
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
