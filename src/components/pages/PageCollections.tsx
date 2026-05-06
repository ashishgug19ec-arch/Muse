'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

interface Collection { id: string; name: string; description: string | null; updatedAt: string; }
interface CollectionPoem { id: string; title: string; body: string; mood: string | null; createdAt: string; }
interface CollectionDetail extends Collection { poems: CollectionPoem[]; }

const GRADIENTS = [
  { bg: 'linear-gradient(160deg,rgba(192,132,252,.28),rgba(124,58,237,.15))', orb: '#c084fc' },
  { bg: 'linear-gradient(160deg,rgba(244,114,182,.22),rgba(208,100,136,.12))', orb: '#f472b6' },
  { bg: 'linear-gradient(160deg,rgba(144,200,168,.22),rgba(94,153,117,.12))', orb: '#90c8a8' },
  { bg: 'linear-gradient(160deg,rgba(248,216,144,.22),rgba(200,160,80,.12))', orb: '#f8d890' },
  { bg: 'linear-gradient(160deg,rgba(144,168,192,.22),rgba(94,120,154,.12))', orb: '#90a8c0' },
];

const moodColors: Record<string, { text: string; bg: string; border: string }> = {
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

export function PageCollections({ night }: Props) {
  const [cols, setCols]             = useState<Collection[]>([]);
  const [loading, setLoading]       = useState(true);
  const [creating, setCreating]     = useState(false);
  const [newName, setNewName]       = useState('');
  const [saving, setSaving]         = useState(false);
  const [detail, setDetail]         = useState<CollectionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [renaming, setRenaming]     = useState(false);
  const [renameName, setRenameName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/collections')
      .then(r => r.json())
      .then(d => { setCols(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function createCollection() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/collections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const col = await res.json();
        setCols(prev => [col, ...prev]);
        setNewName(''); setCreating(false);
      }
    } finally { setSaving(false); }
  }

  async function openCollection(col: Collection) {
    setDetailLoading(true); setDetail(null);
    setRenaming(false); setConfirmDelete(false);
    const res = await fetch(`/api/collections/${col.id}`);
    const data = await res.json();
    setDetail(data); setDetailLoading(false);
  }

  function closeDetail() { setDetail(null); setDetailLoading(false); setRenaming(false); setConfirmDelete(false); }

  async function renameCollection() {
    if (!detail || !renameName.trim()) return;
    const res = await fetch(`/api/collections/${detail.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameName.trim() }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDetail(prev => prev ? { ...prev, name: updated.name } : prev);
      setCols(prev => prev.map(c => c.id === updated.id ? { ...c, name: updated.name } : c));
      setRenaming(false);
    }
  }

  async function deleteCollection() {
    if (!detail) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/collections/${detail.id}`, { method: 'DELETE' });
      if (res.ok) { setCols(prev => prev.filter(c => c.id !== detail.id)); closeDetail(); }
    } finally { setDeleting(false); }
  }

  async function removeFromCollection(poemId: string) {
    if (!detail) return;
    const res = await fetch(`/api/poems/${poemId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionId: null }),
    });
    if (res.ok) setDetail(prev => prev ? { ...prev, poems: prev.poems.filter(p => p.id !== poemId) } : prev);
  }

  function firstLine(body: string) { return body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 80); }
  function getMoodStyle(m: string | null) { return m ? (moodColors[m] ?? { bg: 'rgba(196,181,253,.15)', text: '#a78bfa', border: 'rgba(196,181,253,.35)' }) : null; }

  // ── Detail view ──────────────────────────────────────────────────────────
  if (detail !== null || detailLoading) {
    return (
      <div style={{ padding: '36px 44px', maxWidth: 860, margin: '0 auto' }}>
        <motion.button
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          onClick={closeDetail}
          style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 13, marginBottom: 28, fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          All collections
        </motion.button>

        {detailLoading || !detail ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
            </motion.div>
            <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
                  <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>Collection</span>
                </div>
                {renaming ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      autoFocus value={renameName}
                      onChange={e => setRenameName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') renameCollection(); if (e.key === 'Escape') setRenaming(false); }}
                      style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300, color: ink, background: 'transparent', border: `1.5px solid rgba(160,100,220,.4)`, borderRadius: 10, padding: '6px 12px', outline: 'none', width: 280 }}
                    />
                    <button onClick={renameCollection} style={{ padding: '8px 18px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Save</button>
                    <button onClick={() => setRenaming(false)} style={{ padding: '8px 14px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 300, color: ink, letterSpacing: '-.02em', margin: 0 }}>{detail.name}</h1>
                    <button onClick={() => { setRenameName(detail.name); setRenaming(true); }} title="Rename" style={{ background: 'none', border: 'none', cursor: 'pointer', color: ink3, opacity: .6, padding: 0, display: 'flex' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                    </button>
                  </div>
                )}
                <p style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>{detail.poems.length} poem{detail.poems.length !== 1 ? 's' : ''}</p>
              </div>

              {confirmDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: ink3, fontFamily: "'DM Sans',sans-serif" }}>Delete this collection?</span>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: '8px 16px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>No</button>
                  <button onClick={deleteCollection} disabled={deleting} style={{ padding: '8px 16px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#e05080,#c0304a)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{deleting ? 'Deleting…' : 'Yes, delete'}</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} style={{ padding: '9px 18px', borderRadius: 50, border: '1px solid rgba(224,80,128,.3)', background: 'transparent', color: '#e05080', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  Delete
                </button>
              )}
            </div>

            {/* Poems */}
            {detail.poems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300, marginBottom: 8 }}>No poems yet</div>
                <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>Add poems to this collection from your Library.</div>
              </div>
            ) : (
              <motion.div
                initial="hidden" animate="show" variants={stagger}
                style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}
              >
                {detail.poems.map((p, i) => {
                  const ms = getMoodStyle(p.mood);
                  return (
                    <motion.div key={p.id} variants={fadeUp}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 22px', borderBottom: i < detail.poems.length - 1 ? `1px solid ${cardBd}` : 'none', transition: 'background .15s' }}
                      whileHover={{ backgroundColor: n ? 'rgba(160,124,200,.07)' : 'rgba(208,191,240,.16)' }}
                    >
                      <div style={{ width: 5, height: 32, borderRadius: 4, background: ms ? `${ms.text}` : '#c084fc', opacity: .45, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: 12, fontStyle: 'italic', color: ink3, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Playfair Display',serif" }}>{firstLine(p.body)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                        {ms && <span style={{ fontSize: 9, padding: '2px 10px', borderRadius: 50, background: ms.bg, color: ms.text, border: `1px solid ${ms.border}` }}>{p.mood}</span>}
                        <span style={{ fontSize: 10, color: ink3, minWidth: 52, textAlign: 'right' }}>{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <button onClick={() => removeFromCollection(p.id)} title="Remove" style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${cardBd}`, background: 'transparent', cursor: 'pointer', color: ink3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, opacity: .6 }}>×</button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
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
            <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>My Garden</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            My{' '}
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Collections</em>
          </h1>
          <p style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>{cols.length} collection{cols.length !== 1 ? 's' : ''}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }}
          onClick={() => setCreating(true)}
          style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 18px rgba(124,58,237,.3)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Collection
        </motion.button>
      </motion.div>

      {/* Create inline form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: .98 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 24, borderRadius: 20, border: `1.5px solid rgba(160,100,220,.4)`, background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.9)', backdropFilter: 'blur(20px)', padding: '20px 24px', boxShadow: '0 4px 24px rgba(124,58,237,.1)', display: 'flex', gap: 10, alignItems: 'center' }}
          >
            <input
              autoFocus value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createCollection(); if (e.key === 'Escape') { setCreating(false); setNewName(''); } }}
              placeholder="Collection name…"
              style={{ flex: 1, padding: '10px 16px', borderRadius: 12, fontSize: 14, color: ink, border: `1.5px solid ${cardBd}`, background: 'transparent', outline: 'none', fontFamily: "'Playfair Display',serif" }}
            />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }} onClick={createCollection} disabled={saving} style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{saving ? 'Saving…' : 'Create'}</motion.button>
            <button onClick={() => { setCreating(false); setNewName(''); }} style={{ padding: '10px 16px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          </motion.div>
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && cols.length === 0 && !creating && (
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 16, opacity: .3 }}>📚</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink2, fontWeight: 300, marginBottom: 8 }}>No collections yet</div>
          <p style={{ fontSize: 13, color: ink3, fontWeight: 300, marginBottom: 28 }}>Group your poems into themed collections.</p>
          <motion.button whileHover={{ scale: 1.03, y: -1 }} onClick={() => setCreating(true)} style={{ padding: '12px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 22px rgba(124,58,237,.3)' }}>Create your first collection →</motion.button>
        </motion.div>
      )}

      {/* Grid */}
      {!loading && (
        <motion.div
          initial="hidden" animate="show" variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}
        >
          {cols.map((c, i) => {
            const g = GRADIENTS[i % GRADIENTS.length];
            return (
              <motion.div key={c.id} variants={fadeUp}>
                <Tilt
                  onClick={() => openCollection(c)}
                  style={{ borderRadius: 24, border: `1.5px solid ${cardBd}`, cursor: 'pointer', overflow: 'hidden', boxShadow: '0 4px 20px rgba(124,58,237,.06)' }}
                >
                  {/* Cover */}
                  <div style={{ height: 100, background: g.bg, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '14px 20px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle,${g.orb}35,transparent 70%)` }} />
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: `${g.orb}30`, border: `1px solid ${g.orb}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📚</div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px 20px', background: cardBg, backdropFilter: 'blur(20px)' }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, color: ink, marginBottom: 6, lineHeight: 1.3 }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: ink3, fontWeight: 300, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Updated {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}

          {/* Add card */}
          <motion.div variants={fadeUp}>
            <Tilt
              onClick={() => setCreating(true)}
              style={{ borderRadius: 24, border: `2px dashed ${cardBd}`, background: 'transparent', cursor: 'pointer', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, border: `1.5px dashed ${cardBd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ink3 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div style={{ fontSize: 13, color: ink3, fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontWeight: 300 }}>New collection</div>
            </Tilt>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
