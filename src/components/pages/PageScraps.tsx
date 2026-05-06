'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { night: boolean; }

interface Scrap { id: string; body: string; mood: string | null; createdAt: string; }

type ChipColor = 'purple' | 'rose' | 'sage' | 'gold' | 'night';

const MOODS: { label: string; value: string; color: ChipColor }[] = [
  { label: '🌙 Night',   value: 'Night',   color: 'night'  },
  { label: '🌸 Spring',  value: 'Spring',  color: 'rose'   },
  { label: '💔 Loss',    value: 'Loss',    color: 'purple' },
  { label: '🌅 Dawn',    value: 'Dawn',    color: 'gold'   },
  { label: '🌿 Nature',  value: 'Nature',  color: 'sage'   },
  { label: '💫 Dream',   value: 'Dream',   color: 'night'  },
  { label: '🔥 Fire',    value: 'Fire',    color: 'rose'   },
  { label: '✦ Wonder',  value: 'Wonder',  color: 'purple' },
];

const CHIP_COLORS: Record<ChipColor, { bg: string; text: string; bd: string }> = {
  purple: { bg: 'rgba(192,132,252,.18)', text: '#c084fc', bd: 'rgba(192,132,252,.38)' },
  rose:   { bg: 'rgba(240,168,192,.2)',  text: '#d06888', bd: 'rgba(240,168,192,.4)'  },
  sage:   { bg: 'rgba(144,200,168,.18)', text: '#5e9975', bd: 'rgba(144,200,168,.38)' },
  gold:   { bg: 'rgba(248,216,144,.18)', text: '#c8a050', bd: 'rgba(248,216,144,.4)'  },
  night:  { bg: 'rgba(124,58,237,.14)',  text: '#a78bfa', bd: 'rgba(124,58,237,.3)'   },
};

function moodMeta(value: string | null) {
  return MOODS.find(m => m.value === value) ?? null;
}

function MoodChip({ value }: { value: string | null }) {
  const m = moodMeta(value);
  if (!m) return null;
  const c = CHIP_COLORS[m.color];
  return (
    <span style={{ padding: '2px 10px', borderRadius: 50, fontSize: 10, background: c.bg, color: c.text, border: `1px solid ${c.bd}`, display: 'inline-block', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif", letterSpacing: '.06em' }}>{m.label}</span>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PageScraps({ night }: Props) {
  const [scraps, setScraps]       = useState<Scrap[]>([]);
  const [loading, setLoading]     = useState(true);
  const [composing, setComposing] = useState(false);
  const [newBody, setNewBody]     = useState('');
  const [newMood, setNewMood]     = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [editId, setEditId]       = useState<string | null>(null);
  const [editBody, setEditBody]   = useState('');
  const [editMood, setEditMood]   = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [hoverId, setHoverId]     = useState<string | null>(null);

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const ink4 = n ? 'rgba(120,100,160,.45)' : '#bbadd0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/scraps')
      .then(r => r.json())
      .then(d => { setScraps(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { if (composing) textRef.current?.focus(); }, [composing]);

  async function saveNew() {
    if (!newBody.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/scraps', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newBody.trim(), mood: newMood }),
      });
      if (res.ok) {
        const s = await res.json();
        setScraps(prev => [s, ...prev]);
        setNewBody(''); setNewMood(null); setComposing(false);
      }
    } finally { setSaving(false); }
  }

  function startEdit(s: Scrap) { setEditId(s.id); setEditBody(s.body); setEditMood(s.mood); }

  async function saveEdit() {
    if (!editId || !editBody.trim()) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/scraps/${editId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: editBody.trim(), mood: editMood }),
      });
      if (res.ok) {
        const updated = await res.json();
        setScraps(prev => prev.map(s => s.id === editId ? updated : s));
        setEditId(null);
      }
    } finally { setEditSaving(false); }
  }

  async function deleteScrap(id: string) {
    const res = await fetch(`/api/scraps/${id}`, { method: 'DELETE' });
    if (res.ok) setScraps(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div style={{ padding: '36px 44px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg,#90c8a8,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#5e9975' }}>My Garden</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            My{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#90c8a8,#5e9975)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Scraps</em>
          </h1>
          <p style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>Quick fragments, half-formed lines, ideas that aren't poems yet.</p>
        </div>

        {!composing && (
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }}
            onClick={() => setComposing(true)}
            style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#90c8a8,#5e9975)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 18px rgba(94,153,117,.3)', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Quick note
          </motion.button>
        )}
      </motion.div>

      {/* Compose box */}
      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: .98 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 28, borderRadius: 22, border: `1.5px solid rgba(144,200,168,.45)`, background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.9)', backdropFilter: 'blur(20px)', padding: '22px 24px', boxShadow: '0 4px 24px rgba(94,153,117,.12)' }}
          >
            <textarea
              ref={textRef}
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') { setComposing(false); setNewBody(''); setNewMood(null); } }}
              placeholder="A line, a phrase, a fleeting thought…"
              rows={3}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: "'Playfair Display',serif", fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: ink, lineHeight: 1.9, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14, marginBottom: 16 }}>
              {MOODS.map(m => {
                const active = newMood === m.value;
                const c = CHIP_COLORS[m.color];
                return (
                  <button key={m.value} onClick={() => setNewMood(active ? null : m.value)} style={{ padding: '3px 12px', borderRadius: 50, fontSize: 10, background: active ? c.bg : 'transparent', color: active ? c.text : ink3, border: active ? `1px solid ${c.bd}` : `1px solid ${cardBd}`, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .15s' }}>{m.label}</button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} onClick={saveNew} disabled={saving || !newBody.trim()} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#90c8a8,#5e9975)', color: '#fff', fontSize: 12, cursor: newBody.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans',sans-serif", opacity: newBody.trim() ? 1 : .5 }}>{saving ? 'Saving…' : 'Save scrap'}</motion.button>
              <button onClick={() => { setComposing(false); setNewBody(''); setNewMood(null); }} style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#90c8a8" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          </motion.div>
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
        </div>
      )}

      {/* Empty */}
      {!loading && scraps.length === 0 && !composing && (
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: .35 }}>✍️</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink2, fontWeight: 300, marginBottom: 8 }}>No scraps yet</div>
          <p style={{ fontSize: 13, color: ink3, fontWeight: 300, marginBottom: 28 }}>Capture a line before it slips away.</p>
          <motion.button whileHover={{ scale: 1.03, y: -1 }} onClick={() => setComposing(true)} style={{ padding: '12px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#90c8a8,#5e9975)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 22px rgba(94,153,117,.3)' }}>Write your first scrap</motion.button>
        </motion.div>
      )}

      {/* Masonry grid */}
      {!loading && scraps.length > 0 && (
        <div style={{ columnCount: 3, columnGap: 14 }}>
          {scraps.map(s => {
            const isEditing = editId === s.id;
            const m = moodMeta(s.mood);
            return (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: .96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: .96 }}
                transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
                onMouseEnter={() => setHoverId(s.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{
                  breakInside: 'avoid', marginBottom: 14, borderRadius: 20,
                  border: `1.5px solid ${isEditing ? 'rgba(144,200,168,.5)' : cardBd}`,
                  background: cardBg, backdropFilter: 'blur(18px)',
                  padding: '18px 20px',
                  boxShadow: hoverId === s.id && !isEditing ? `0 6px 24px rgba(94,153,117,.1)` : 'none',
                  transition: 'box-shadow .2s, border-color .2s',
                }}
              >
                {isEditing ? (
                  <>
                    <textarea
                      autoFocus value={editBody}
                      onChange={e => setEditBody(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Escape') setEditId(null); }}
                      rows={3}
                      style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', fontWeight: 300, color: ink, lineHeight: 1.8, boxSizing: 'border-box', marginBottom: 10 }}
                    />
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                      {MOODS.map(mood => {
                        const active = editMood === mood.value;
                        const c = CHIP_COLORS[mood.color];
                        return (
                          <button key={mood.value} onClick={() => setEditMood(active ? null : mood.value)} style={{ padding: '2px 10px', borderRadius: 50, fontSize: 10, background: active ? c.bg : 'transparent', color: active ? c.text : ink3, border: active ? `1px solid ${c.bd}` : `1px solid ${cardBd}`, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{mood.label}</button>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={saveEdit} disabled={editSaving} style={{ padding: '5px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#90c8a8,#5e9975)', color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{editSaving ? 'Saving…' : 'Save'}</button>
                      <button onClick={() => setEditId(null)} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Mood accent line */}
                    {m && <div style={{ width: 20, height: 2, borderRadius: 2, background: CHIP_COLORS[m.color].text, opacity: .6, marginBottom: 12 }} />}
                    <div
                      onClick={() => startEdit(s)}
                      style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', fontWeight: 300, color: ink, lineHeight: 1.85, marginBottom: 14, cursor: 'text' }}
                    >"{s.body}"</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {m && <MoodChip value={s.mood} />}
                        <span style={{ fontSize: 10, color: ink4, fontWeight: 300 }}>{timeAgo(s.createdAt)}</span>
                      </div>
                      <AnimatePresence>
                        {hoverId === s.id && (
                          <motion.button
                            initial={{ opacity: 0, scale: .8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: .8 }}
                            onClick={() => deleteScrap(s.id)}
                            title="Delete"
                            style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(224,80,128,.3)', background: 'transparent', cursor: 'pointer', color: '#e05080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
                          >×</motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
