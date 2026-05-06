'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

interface Poem {
  id: string;
  title: string;
  body: string;
  type: string | null;
  mood: string | null;
  collectionId: string | null;
  createdAt: string;
}

interface Collection { id: string; name: string; }

const MOODS = ['Reflective', 'Melancholic', 'Peaceful', 'Hopeful'];

const moodColors: Record<string, { bg: string; text: string; border: string }> = {
  Reflective: { bg: 'rgba(192,132,252,.15)', text: '#c084fc', border: 'rgba(192,132,252,.35)' },
  Melancholic:{ bg: 'rgba(144,168,192,.15)', text: '#90a8c0', border: 'rgba(144,168,192,.35)' },
  Peaceful:   { bg: 'rgba(144,200,168,.15)', text: '#5e9975', border: 'rgba(144,200,168,.35)' },
  Hopeful:    { bg: 'rgba(248,216,144,.15)', text: '#c8a050', border: 'rgba(248,216,144,.45)' },
  Yearning:   { bg: 'rgba(240,168,192,.15)', text: '#d06888', border: 'rgba(240,168,192,.35)' },
  Fierce:     { bg: 'rgba(244,114,182,.15)', text: '#f472b6', border: 'rgba(244,114,182,.35)' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function PoemIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/>
      <path d="M8 12h5M8 8.5h7M8 15.5h4"/>
      <path d="M18 2l2 2-6 6-2-2z"/>
    </svg>
  );
}

export function PageLibrary({ night }: Props) {
  const { openPage } = useMuseStore();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Poem | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editMood, setEditMood] = useState('');
  const [editCollectionId, setEditCollectionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const modalBg = night ? 'rgba(18,10,36,.98)' : 'rgba(255,252,255,.99)';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 15px', borderRadius: 12,
    border: `1px solid ${night ? 'rgba(160,100,220,.3)' : 'rgba(196,181,253,.5)'}`,
    background: night ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.8)',
    color: ink, fontSize: 14, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box', marginBottom: 12,
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/poems').then(r => r.json()),
      fetch('/api/collections').then(r => r.json()),
    ]).then(([poemData, colData]) => {
      setPoems(Array.isArray(poemData) ? poemData : []);
      setCollections(Array.isArray(colData) ? colData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function collectionName(id: string | null) {
    if (!id) return null;
    return collections.find(c => c.id === id)?.name ?? null;
  }

  function openPoem(p: Poem) { setSelected(p); setEditing(false); setConfirmDelete(false); }
  function closeModal() { setSelected(null); setEditing(false); setConfirmDelete(false); }

  function startEdit() {
    if (!selected) return;
    setEditTitle(selected.title);
    setEditBody(selected.body);
    setEditMood(selected.mood ?? '');
    setEditCollectionId(selected.collectionId);
    setEditing(true);
  }

  async function saveEdit() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/poems/${selected.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, body: editBody, mood: editMood || null, collectionId: editCollectionId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPoems(prev => prev.map(p => p.id === updated.id ? updated : p));
        setSelected(updated); setEditing(false);
      }
    } finally { setSaving(false); }
  }

  async function deletePoem() {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/poems/${selected.id}`, { method: 'DELETE' });
      if (res.ok) { setPoems(prev => prev.filter(p => p.id !== selected.id)); closeModal(); }
    } finally { setDeleting(false); }
  }

  function firstLine(body: string) {
    return body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 90);
  }

  function bodyHtml(body: string) {
    if (/<[a-z][\s\S]*?>/i.test(body)) return body;
    return body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  }

  function getMoodStyle(m: string | null) {
    if (!m) return null;
    return moodColors[m] ?? { bg: 'rgba(196,181,253,.15)', text: '#a78bfa', border: 'rgba(196,181,253,.35)' };
  }

  return (
    <div style={{ padding: '36px 44px', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg,#d06888,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#d06888' }}>My Garden</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            My{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Poems</em>
          </h1>
          <p style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>
            {poems.length} poem{poems.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: night ? 'rgba(255,255,255,.06)' : 'rgba(245,240,255,.8)', borderRadius: 10, border: `1px solid ${cardBd}`, overflow: 'hidden' }}>
            {(['list', 'grid'] as const).map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{
                padding: '7px 12px', border: 'none', cursor: 'pointer', fontSize: 13,
                background: viewMode === v ? 'linear-gradient(135deg,#c084fc,#7c3aed)' : 'transparent',
                color: viewMode === v ? '#fff' : ink3,
                transition: 'all .2s',
              }}>
                {v === 'list'
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                }
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.98 }}
            onClick={() => openPage('Sanctuary')}
            style={{
              padding: '10px 22px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
              color: '#fff', fontSize: 12, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: '0 4px 18px rgba(124,58,237,.3)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Write poem
          </motion.button>
        </div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial="hidden" animate="show" variants={stagger}
        style={{ display: 'flex', gap: 12, marginBottom: 28 }}
      >
        {[
          { label: 'Total poems',   val: poems.length, color: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
          { label: 'In collections',val: poems.filter(p => p.collectionId).length, color: '#90c8a8', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)' },
          { label: 'This month',    val: poems.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length, color: '#f0a8c0', grad: 'linear-gradient(135deg,#f472b6,#d06888)' },
          { label: 'With mood',     val: poems.filter(p => p.mood).length, color: '#f8d890', grad: 'linear-gradient(135deg,#f8d890,#c8a050)' },
        ].map(s => (
          <motion.div key={s.label} variants={fadeUp} style={{
            flex: 1, borderRadius: 16,
            background: night ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.65)',
            border: `1px solid ${cardBd}`, backdropFilter: 'blur(18px)',
            padding: '14px 18px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', bottom: -10, right: -10, width: 50, height: 50, background: s.grad, opacity: .08, borderRadius: '50%', filter: 'blur(10px)' }} />
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: ink3, marginTop: 4, letterSpacing: '.06em' }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Poem list / grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          </motion.div>
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading your poems…</div>
        </div>
      ) : poems.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '72px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: .4 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={ink3} strokeWidth="1"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M8 8h5M8 16h6"/></svg>
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink2, fontWeight: 300, marginBottom: 8 }}>Your garden is empty</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300, marginBottom: 28, maxWidth: 300, margin: '0 auto 28px' }}>Every garden begins with a single seed. Write your first poem.</div>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }}
            onClick={() => openPage('Sanctuary')}
            style={{ padding: '12px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 22px rgba(124,58,237,.3)' }}
          >Begin writing →</motion.button>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div
          initial="hidden" animate="show" variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}
        >
          {poems.map(p => {
            const ms = getMoodStyle(p.mood);
            const colName = collectionName(p.collectionId);
            return (
              <motion.div key={p.id} variants={fadeUp}
                onClick={() => openPoem(p)}
                whileHover={{ y: -4, scale: 1.012 }}
                style={{
                  borderRadius: 20, border: `1.5px solid ${cardBd}`,
                  background: cardBg, backdropFilter: 'blur(20px)',
                  padding: '22px 22px', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(124,58,237,.06)',
                  transition: 'box-shadow .3s',
                }}
              >
                {ms && <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle,${ms.text}18,transparent 70%)`, pointerEvents: 'none' }} />}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {ms && <span style={{ fontSize: 9, padding: '2px 10px', borderRadius: 50, background: ms.bg, color: ms.text, border: `1px solid ${ms.border}`, letterSpacing: '.08em' }}>{p.mood}</span>}
                  {colName && <span style={{ fontSize: 9, padding: '2px 10px', borderRadius: 50, background: 'rgba(144,200,168,.15)', color: '#5e9975', border: '1px solid rgba(144,200,168,.3)' }}>📚 {colName}</span>}
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, color: ink, marginBottom: 8, lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink3, lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{firstLine(p.body)}</div>
                <div style={{ marginTop: 14, fontSize: 10, color: ink3, fontWeight: 300 }}>
                  {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial="hidden" animate="show" variants={stagger}
          style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}
        >
          {poems.map((p, i) => {
            const ms = getMoodStyle(p.mood);
            const colName = collectionName(p.collectionId);
            return (
              <motion.div key={p.id} variants={fadeUp}
                onClick={() => openPoem(p)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 22px', borderBottom: i < poems.length - 1 ? `1px solid ${cardBd}` : 'none', cursor: 'pointer', transition: 'background .15s', position: 'relative' }}
                whileHover={{ backgroundColor: night ? 'rgba(160,124,200,.07)' : 'rgba(208,191,240,.16)' }}
              >
                <div style={{ width: 5, height: 36, borderRadius: 4, background: ms ? ms.grad ?? 'linear-gradient(180deg,#c084fc,#7c3aed)' : 'linear-gradient(180deg,#c084fc,#7c3aed)', opacity: .5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 400, color: ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink3, fontWeight: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstLine(p.body)}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                  {colName && <span style={{ fontSize: 9, padding: '2px 9px', borderRadius: 50, background: 'rgba(144,200,168,.15)', color: '#5e9975', border: '1px solid rgba(144,200,168,.3)' }}>📚 {colName}</span>}
                  {ms && <span style={{ fontSize: 9, padding: '2px 9px', borderRadius: 50, background: ms.bg, color: ms.text, border: `1px solid ${ms.border}` }}>{p.mood}</span>}
                  <div style={{ fontSize: 10, color: ink3, fontWeight: 300, minWidth: 52, textAlign: 'right' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Poem modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(6px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: .94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.34, 1.2, 0.64, 1] }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                zIndex: 401, width: '90%', maxWidth: 560, maxHeight: '88vh', overflowY: 'auto',
                background: modalBg, backdropFilter: 'blur(40px)',
                borderRadius: 28, border: `1px solid ${cardBd}`,
                boxShadow: '0 24px 80px rgba(0,0,0,.22)', padding: '44px 48px 36px',
              }}
            >
              <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
                {!editing && !confirmDelete && (
                  <>
                    <button onClick={startEdit} title="Edit" style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${cardBd}`, background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.8)', cursor: 'pointer', color: ink2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => setConfirmDelete(true)} title="Delete" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(224,80,128,.3)', background: night ? 'rgba(224,80,128,.08)' : 'rgba(255,240,245,.8)', cursor: 'pointer', color: '#e05080', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </>
                )}
                <button onClick={closeModal} style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${cardBd}`, background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.8)', cursor: 'pointer', color: ink3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>×</button>
              </div>

              {confirmDelete ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🌸</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink, marginBottom: 8 }}>Delete this poem?</div>
                  <div style={{ fontSize: 13, color: ink3, marginBottom: 28 }}>This cannot be undone.</div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button onClick={() => setConfirmDelete(false)} style={{ padding: '10px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                    <button onClick={deletePoem} disabled={deleting} style={{ padding: '10px 24px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#e05080,#c0304a)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif' " }}>{deleting ? 'Deleting…' : 'Yes, delete'}</button>
                  </div>
                </div>
              ) : editing ? (
                <div>
                  <div style={{ fontSize: 10, color: '#c084fc', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 18 }}>Editing poem</div>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" style={{ ...inputStyle, fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 400 }} />
                  <textarea value={editBody} onChange={e => setEditBody(e.target.value)} placeholder="Poem…" rows={6} style={{ ...inputStyle, resize: 'vertical', minHeight: 160, fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', lineHeight: 1.9 }} />
                  <div style={{ fontSize: 10, color: ink3, marginBottom: 8, letterSpacing: '.06em' }}>Mood</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                    {MOODS.map(m => {
                      const ms2 = getMoodStyle(m);
                      return (
                        <button key={m} onClick={() => setEditMood(editMood === m ? '' : m)} style={{ padding: '4px 14px', borderRadius: 50, fontSize: 11, cursor: 'pointer', background: editMood === m ? (ms2?.bg ?? 'rgba(124,58,237,.18)') : 'transparent', border: `1px solid ${editMood === m ? (ms2?.border ?? 'rgba(124,58,237,.4)') : cardBd}`, color: editMood === m ? (ms2?.text ?? '#c084fc') : ink3, fontFamily: "'DM Sans',sans-serif" }}>{m}</button>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 10, color: ink3, marginBottom: 8, letterSpacing: '.06em' }}>Collection</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                    <button onClick={() => setEditCollectionId(null)} style={{ padding: '4px 14px', borderRadius: 50, fontSize: 11, cursor: 'pointer', background: editCollectionId === null ? 'rgba(144,200,168,.15)' : 'transparent', border: `1px solid ${editCollectionId === null ? 'rgba(144,200,168,.4)' : cardBd}`, color: editCollectionId === null ? '#5e9975' : ink3, fontFamily: "'DM Sans',sans-serif" }}>None</button>
                    {collections.map(c => (
                      <button key={c.id} onClick={() => setEditCollectionId(c.id)} style={{ padding: '4px 14px', borderRadius: 50, fontSize: 11, cursor: 'pointer', background: editCollectionId === c.id ? 'rgba(144,200,168,.15)' : 'transparent', border: `1px solid ${editCollectionId === c.id ? 'rgba(144,200,168,.4)' : cardBd}`, color: editCollectionId === c.id ? '#5e9975' : ink3, fontFamily: "'DM Sans',sans-serif" }}>📚 {c.name}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '11px', borderRadius: 14, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                    <button onClick={saveEdit} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: 14, border: 'none', background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{saving ? 'Saving…' : 'Save changes'}</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                    {selected.mood && (() => { const ms2 = getMoodStyle(selected.mood); return ms2 ? <div style={{ fontSize: 10, padding: '3px 12px', borderRadius: 50, background: ms2.bg, color: ms2.text, border: `1px solid ${ms2.border}`, letterSpacing: '.08em' }}>{selected.mood}</div> : null; })()}
                    {selected.collectionId && collectionName(selected.collectionId) && (
                      <div style={{ fontSize: 10, padding: '3px 10px', borderRadius: 50, background: 'rgba(144,200,168,.15)', color: '#5e9975', border: '1px solid rgba(144,200,168,.3)' }}>
                        📚 {collectionName(selected.collectionId)}
                      </div>
                    )}
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 400, color: ink, letterSpacing: '-.02em', lineHeight: 1.25, marginBottom: 28 }}>{selected.title}</h2>
                  <div
                    style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 2.2 }}
                    dangerouslySetInnerHTML={{ __html: bodyHtml(selected.body) }}
                  />
                  <div style={{ marginTop: 32, paddingTop: 18, borderTop: `1px solid ${cardBd}`, fontSize: 11, color: ink3, fontWeight: 300, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
