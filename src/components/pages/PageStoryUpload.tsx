'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

const FORMS = ['Free verse', 'Haiku', 'Sonnet', 'Tanka', 'Prose poem', 'Other'];
const STATUSES = ['ongoing', 'complete', 'hiatus'];
const statusColors: Record<string, { text: string; bg: string; border: string }> = {
  ongoing:  { text: '#5e9975', bg: 'rgba(144,200,168,.15)', border: 'rgba(144,200,168,.35)' },
  complete: { text: '#c084fc', bg: 'rgba(192,132,252,.12)', border: 'rgba(192,132,252,.3)' },
  hiatus:   { text: '#c8a050', bg: 'rgba(200,160,80,.12)',  border: 'rgba(200,160,80,.3)' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function PageStoryUpload({ night }: Props) {
  const { openPage } = useMuseStore();
  const [title, setTitle] = useState('');
  const [fandom, setFandom] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [form, setForm] = useState('Free verse');
  const [status, setStatus] = useState('ongoing');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 14,
    border: `1.5px solid ${cardBd}`,
    background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.85)',
    backdropFilter: 'blur(18px)',
    color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', transition: 'border-color .2s',
    boxSizing: 'border-box' as const,
  };

  async function handlePublish() {
    if (!title.trim() || !content.trim()) {
      setError('Please add a title and content before publishing.');
      return;
    }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/fanfics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          blurb: summary.trim() || null,
          fandom: fandom.trim() || null,
          status, visibility: 'public',
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTitle(''); setFandom(''); setSummary(''); setContent(''); setTags('');
        setForm('Free verse'); setStatus('ongoing');
        setTimeout(() => setSaved(false), 3000);
      } else {
        const d = await res.json();
        setError(d.error ?? 'Failed to publish.');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: n
        ? 'linear-gradient(160deg,#12081e 0%,#0a0414 100%)'
        : 'linear-gradient(160deg,rgba(248,240,255,.95) 0%,rgba(255,232,245,.9) 100%)',
      minHeight: '100%',
    }}>

      {/* Header band */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
        style={{
          padding: '28px 56px 24px',
          borderBottom: `1px solid ${cardBd}`,
          background: n
            ? 'linear-gradient(135deg,rgba(244,114,182,.08),rgba(192,132,252,.06))'
            : 'linear-gradient(135deg,rgba(252,228,240,.6),rgba(238,228,255,.5))',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* decorative orbs */}
        <div style={{ position: 'absolute', top: -30, right: 80, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,.18),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, left: 140, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,.14),transparent 70%)', pointerEvents: 'none' }} />

        <button onClick={() => openPage('FanFiction')} style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 12, marginBottom: 20, fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          All stories
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#f472b6' }}>New Story</span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 300,
          letterSpacing: '-.03em', lineHeight: 1.15, margin: 0,
          color: ink,
        }}>
          Begin a{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#f472b6,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>new world</em>
        </h1>
      </motion.div>

      {/* Form body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 56px 48px' }}>
        <motion.div
          initial="hidden" animate="show" variants={stagger}
          style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}
        >

          {/* Two columns: title + fandom */}
          <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Story Title *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Your story title…"
                style={{ ...inputBase, fontFamily: "'Playfair Display',serif", fontSize: 15 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Fandom / Universe</label>
              <input
                value={fandom}
                onChange={e => setFandom(e.target.value)}
                placeholder="e.g. Original, Studio Ghibli…"
                style={inputBase}
              />
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div variants={fadeUp}>
            <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Summary</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="A brief summary of your story…"
              rows={3}
              style={{ ...inputBase, resize: 'vertical', lineHeight: 1.7, minHeight: 88 }}
            />
          </motion.div>

          {/* Tags */}
          <motion.div variants={fadeUp}>
            <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Tags</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="romance, magic, found family… (comma separated)"
              style={inputBase}
            />
          </motion.div>

          {/* Form picker */}
          <motion.div variants={fadeUp}>
            <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 10 }}>Writing Form</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FORMS.map(f => (
                <motion.button
                  key={f}
                  onClick={() => setForm(f)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                  style={{
                    padding: '6px 16px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
                    background: form === f ? 'rgba(192,132,252,.18)' : 'transparent',
                    border: `1px solid ${form === f ? 'rgba(192,132,252,.45)' : cardBd}`,
                    color: form === f ? '#c084fc' : ink3,
                    fontFamily: "'DM Sans',sans-serif", transition: 'all .2s',
                  }}
                >{f}</motion.button>
              ))}
            </div>
          </motion.div>

          {/* Status */}
          <motion.div variants={fadeUp}>
            <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 10 }}>Story Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUSES.map(s => {
                const sc = statusColors[s];
                return (
                  <motion.button
                    key={s}
                    onClick={() => setStatus(s)}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
                    style={{
                      padding: '7px 20px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
                      textTransform: 'capitalize', fontFamily: "'DM Sans',sans-serif",
                      background: status === s ? sc.bg : 'transparent',
                      border: `1px solid ${status === s ? sc.border : cardBd}`,
                      color: status === s ? sc.text : ink3,
                      transition: 'all .2s',
                    }}
                  >{s}</motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Chapter 1 content */}
          <motion.div variants={fadeUp}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>Chapter 1 Content</label>
              <span style={{ fontSize: 10, color: ink3 }}>{content.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div style={{
              borderRadius: 18, border: `1.5px solid ${cardBd}`,
              background: n ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.75)',
              backdropFilter: 'blur(20px)', overflow: 'hidden',
            }}>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Begin your story…"
                style={{
                  ...inputBase,
                  minHeight: 260, resize: 'vertical',
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 15, fontStyle: 'italic', lineHeight: 2,
                  borderRadius: 0, border: 'none',
                  background: 'transparent',
                }}
              />
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
            <AnimatePresence>
              {error && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: '#e05080' }}>{error}</motion.span>
              )}
              {saved && (
                <motion.span initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: '#7c3aed' }}>✓ Story published!</motion.span>
              )}
              {!error && !saved && <span />}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button style={{
                padding: '11px 24px', borderRadius: 50,
                border: `1px solid ${cardBd}`,
                background: 'transparent', color: ink3, fontSize: 12,
                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              }}>Save draft</button>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }}
                onClick={handlePublish}
                disabled={saving}
                style={{
                  padding: '11px 30px', borderRadius: 50, border: 'none',
                  background: saving ? 'rgba(244,114,182,.4)' : 'linear-gradient(135deg,#f472b6,#c084fc)',
                  color: '#fff', fontSize: 12, cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow: saving ? 'none' : '0 6px 20px rgba(244,114,182,.3)',
                }}
              >{saving ? 'Publishing…' : 'Publish story →'}</motion.button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
