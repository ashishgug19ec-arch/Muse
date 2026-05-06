'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseStore } from '@/lib/store';
import { WriteToolbar } from '@/components/ui/WriteToolbar';

interface Props { night: boolean; }

const moods = [
  { label: 'Reflective', icon: '🌙', color: '#c084fc' },
  { label: 'Melancholic', icon: '🌧', color: '#90a8c0' },
  { label: 'Peaceful',   icon: '🌿', color: '#90c8a8' },
  { label: 'Hopeful',    icon: '🌅', color: '#f8d890' },
  { label: 'Yearning',   icon: '🌸', color: '#f0a8c0' },
  { label: 'Fierce',     icon: '⚡', color: '#f472b6' },
];

export function PageSanctuary({ night }: Props) {
  const { sanctuaryDraft, clearDraft } = useMuseStore();
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('Reflective');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [fontSize, setFontSize] = useState(22);
  const [lineHeight, setLineHeight] = useState(2.1);
  const [showTip, setShowTip] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const n = night;

  const bdCol = n ? 'rgba(160,124,200,.2)' : 'rgba(208,191,240,.4)';
  const placeholderCol = n ? 'rgba(160,130,200,.38)' : 'rgba(130,100,160,.32)';
  const ink = n ? 'rgba(230,215,255,.85)' : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';

  useEffect(() => {
    if (sanctuaryDraft && editorRef.current) {
      editorRef.current.innerHTML = sanctuaryDraft.body
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
      setWordCount(editorRef.current.innerText.split(/\s+/).filter(Boolean).length);
      clearDraft();
    }
  }, []);

  async function handleSave() {
    const html = editorRef.current?.innerHTML ?? '';
    const plain = editorRef.current?.innerText?.trim() ?? '';
    if (!title.trim() || !plain) {
      setError('Please add a title and some words before saving.');
      return;
    }
    setSaving(true); setError(''); setSaved(false);
    try {
      const res = await fetch('/api/poems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: html, mood, visibility: 'public' }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to save.');
      } else {
        setSaved(true);
        setTitle('');
        if (editorRef.current) editorRef.current.innerHTML = '';
        setWordCount(0);
        setMood('Reflective');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  }

  const activeMood = moods.find(m => m.label === mood);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: n
        ? 'linear-gradient(160deg,#1a0c2e 0%,#0f0620 100%)'
        : 'linear-gradient(160deg,rgba(238,230,255,.95) 0%,rgba(252,228,240,.9) 100%)',
      minHeight: '100%',
    }}>
      <style>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: ${placeholderCol};
          font-style: italic;
          pointer-events: none;
        }
        .sanctuary-title::placeholder { color: ${placeholderCol}; font-style: italic; }
      `}</style>

      {/* Top bar — mood + title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
        style={{ padding: '24px 56px 0', borderBottom: `1px solid ${bdCol}` }}
      >
        {/* Mood picker */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {moods.map(m => (
            <motion.button
              key={m.label}
              onClick={() => setMood(m.label)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '5px 16px', borderRadius: 50, fontSize: 11, fontWeight: 300,
                letterSpacing: '.04em', cursor: 'pointer',
                background: m.label === mood
                  ? `${m.color}22`
                  : (n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.55)'),
                border: m.label === mood
                  ? `1px solid ${m.color}55`
                  : `1px solid ${n ? 'rgba(160,124,200,.2)' : 'rgba(208,191,240,.5)'}`,
                color: m.label === mood ? m.color : ink3,
                fontFamily: "'DM Sans',sans-serif",
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all .2s',
              }}
            >
              <span style={{ fontSize: 12 }}>{m.icon}</span>
              {m.label}
            </motion.button>
          ))}
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled poem…"
          className="sanctuary-title"
          style={{
            fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300,
            color: n ? 'rgba(240,228,255,.88)' : '#1e1628',
            background: 'transparent', border: 'none', outline: 'none',
            letterSpacing: '-.03em', marginBottom: 0,
            width: '100%', paddingBottom: 16,
          }}
        />
      </motion.div>

      {/* Toolbar */}
      <div style={{ padding: '0 56px', borderBottom: `1px solid ${bdCol}` }}>
        <WriteToolbar
          editorRef={editorRef}
          night={n}
          fontSize={fontSize}
          setFontSize={setFontSize}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
        />
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, padding: '32px 56px', position: 'relative' }}>

        {/* Ambient mood glow */}
        {activeMood && (
          <div style={{
            position: 'absolute', top: 0, right: 80, width: 200, height: 200,
            background: `radial-gradient(circle,${activeMood.color}18,transparent 70%)`,
            pointerEvents: 'none', borderRadius: '50%',
            transition: 'background .6s',
          }} />
        )}

        {/* Writing tip */}
        <AnimatePresence>
          {showTip && wordCount === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                position: 'absolute', top: 16, right: 24,
                background: n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)',
                border: `1px solid ${bdCol}`,
                borderRadius: 14, padding: '10px 16px',
                fontSize: 11, color: ink3, maxWidth: 180,
                backdropFilter: 'blur(16px)',
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>✦</span>
              <div>
                Let a word arrive. One small true thing.
                <button onClick={() => setShowTip(false)} style={{ display: 'block', marginTop: 4, fontSize: 10, color: ink3, background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: .6 }}>dismiss</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Begin writing…"
          onInput={() => {
            setWordCount(editorRef.current?.innerText.split(/\s+/).filter(Boolean).length ?? 0);
          }}
          style={{
            flex: 1,
            fontFamily: "'Playfair Display',serif",
            fontSize,
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight,
            color: ink,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            minHeight: 280,
            whiteSpace: 'pre-wrap',
          }}
        />
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 56px 20px',
          borderTop: `1px solid ${bdCol}`,
          background: n ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.4)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: n ? 'rgba(160,140,200,.5)' : '#bbadd0', fontWeight: 300, letterSpacing: '.06em' }}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          {activeMood && (
            <span style={{ fontSize: 11, color: activeMood.color, opacity: .7 }}>
              {activeMood.icon} {activeMood.label}
            </span>
          )}
          <AnimatePresence>
            {error && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#e05080', fontSize: 11 }}>{error}</motion.span>
            )}
            {saved && (
              <motion.span initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ color: '#7c3aed', fontSize: 11 }}>✓ Published</motion.span>
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['Haiku', 'Free verse', 'Sonnet'].map(f => (
            <span key={f} style={{
              fontSize: 10, padding: '3px 12px', borderRadius: 50,
              border: `1px solid ${n ? 'rgba(160,124,200,.25)' : 'rgba(208,191,240,.52)'}`,
              color: n ? 'rgba(200,170,255,.6)' : '#8a7aa0',
            }}>{f}</span>
          ))}
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '11px 32px', borderRadius: 50, border: 'none',
            background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)',
            color: '#fff', fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: "'Playfair Display',serif", letterSpacing: '.05em',
            boxShadow: saving ? 'none' : '0 6px 24px rgba(124,58,237,.3)',
          }}
        >{saving ? 'Saving…' : 'Publish poem'}</motion.button>
      </motion.div>
    </div>
  );
}
