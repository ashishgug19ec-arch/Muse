'use client';
import { useEffect, useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

interface Collection {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
}

interface CollectionPoem {
  id: string;
  title: string;
  body: string;
  mood: string | null;
  createdAt: string;
}

interface CollectionDetail extends Collection {
  poems: CollectionPoem[];
}

const GRADIENTS = [
  'linear-gradient(160deg,rgba(238,230,255,.9),rgba(252,228,240,.8))',
  'linear-gradient(160deg,rgba(252,228,240,.9),rgba(255,245,220,.8))',
  'linear-gradient(160deg,rgba(230,244,234,.9),rgba(238,230,255,.8))',
  'linear-gradient(160deg,rgba(255,245,220,.9),rgba(252,228,240,.8))',
  'linear-gradient(160deg,rgba(220,235,255,.9),rgba(238,230,255,.8))',
];

export function PageCollections({ night }: Props) {
  const [cols, setCols] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  // Detail view state
  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/collections')
      .then(r => r.json())
      .then(data => { setCols(Array.isArray(data) ? data : []); setLoading(false); })
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
    setDetailLoading(true);
    setDetail(null);
    setRenaming(false); setConfirmDelete(false);
    const res = await fetch(`/api/collections/${col.id}`);
    const data = await res.json();
    setDetail(data);
    setDetailLoading(false);
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
      if (res.ok) {
        setCols(prev => prev.filter(c => c.id !== detail.id));
        closeDetail();
      }
    } finally { setDeleting(false); }
  }

  async function removeFromCollection(poemId: string) {
    if (!detail) return;
    const res = await fetch(`/api/poems/${poemId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionId: null }),
    });
    if (res.ok) {
      setDetail(prev => prev ? { ...prev, poems: prev.poems.filter(p => p.id !== poemId) } : prev);
    }
  }

  function firstLine(body: string) { return body.split('\n').find(l => l.trim()) ?? ''; }

  // ── Detail view ──────────────────────────────────────────────────────────
  if (detail !== null || detailLoading) {
    return (
      <div style={{ padding: '32px 40px' }}>
        {/* Back */}
        <button onClick={closeDetail} style={{ fontSize: 12, color: ink3, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to collections
        </button>

        {detailLoading || !detail ? (
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic' }}>Loading…</div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>Collection</div>
                {renaming ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      autoFocus value={renameName}
                      onChange={e => setRenameName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') renameCollection(); if (e.key === 'Escape') setRenaming(false); }}
                      style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300, color: ink, background: 'transparent', border: `1px solid rgba(160,100,220,.4)`, borderRadius: 8, padding: '4px 10px', outline: 'none', width: 280 }}
                    />
                    <button onClick={renameCollection} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setRenaming(false)} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>{detail.name}</div>
                    <button onClick={() => { setRenameName(detail.name); setRenaming(true); }} style={{ fontSize: 14, color: ink3, background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: .7 }} title="Rename">✎</button>
                  </div>
                )}
                <div style={{ fontSize: 12, color: ink3, marginTop: 6 }}>{detail.poems.length} poem{detail.poems.length !== 1 ? 's' : ''}</div>
              </div>

              {/* Delete */}
              {confirmDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: ink3 }}>Delete this collection?</span>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer' }}>No</button>
                  <button onClick={deleteCollection} disabled={deleting} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: '#e05080', color: '#fff', fontSize: 12, cursor: 'pointer' }}>{deleting ? 'Deleting…' : 'Yes, delete'}</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(224,80,128,.3)', background: 'transparent', color: '#e05080', fontSize: 12, cursor: 'pointer' }}>Delete collection</button>
              )}
            </div>

            {/* Poems list */}
            {detail.poems.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: 48 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: ink2, fontWeight: 300, marginBottom: 8 }}>No poems yet</div>
                <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>Add poems to this collection from the Poems page.</div>
              </div>
            ) : (
              <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
                {detail.poems.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: i < detail.poems.length - 1 ? `1px solid ${cardBd}` : 'none' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(192,132,252,.5)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div style={{ fontSize: 12, fontStyle: 'italic', color: ink3, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstLine(p.body)}</div>
                    </div>
                    {p.mood && <div style={{ fontSize: 10, padding: '3px 10px', borderRadius: 50, background: 'rgba(124,58,237,.08)', color: '#a855f7', border: '1px solid rgba(124,58,237,.15)', flexShrink: 0 }}>{p.mood}</div>}
                    <div style={{ fontSize: 11, color: ink3, flexShrink: 0 }}>{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <button onClick={() => removeFromCollection(p.id)} title="Remove from collection" style={{ fontSize: 13, color: ink3, background: 'none', border: 'none', cursor: 'pointer', opacity: .5, flexShrink: 0, padding: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Collections</div>
        </div>
        <button onClick={() => setCreating(true)} style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>+ New Collection</button>
      </div>

      {creating && (
        <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            autoFocus value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') createCollection(); if (e.key === 'Escape') { setCreating(false); setNewName(''); } }}
            placeholder="Collection name…"
            style={{ padding: '10px 16px', borderRadius: 12, fontSize: 13, color: ink, border: `1px solid rgba(160,100,220,.5)`, background: cardBg, outline: 'none', fontFamily: "'DM Sans',sans-serif", minWidth: 220 }}
          />
          <button onClick={createCollection} disabled={saving} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{saving ? 'Saving…' : 'Create'}</button>
          <button onClick={() => { setCreating(false); setNewName(''); }} style={{ padding: '10px 16px', borderRadius: 12, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {cols.map((c, i) => (
            <Tilt key={c.id} onClick={() => openCollection(c)} style={{ borderRadius: 22, overflow: 'hidden', border: `1.5px solid ${cardBd}`, cursor: 'pointer' }}>
              <div style={{ height: 110, background: GRADIENTS[i % GRADIENTS.length], display: 'flex', alignItems: 'flex-end', padding: '14px 18px' }}>
                <div style={{ fontSize: 28 }}>📚</div>
              </div>
              <div style={{ padding: '16px 18px', background: cardBg, backdropFilter: 'blur(18px)' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, color: ink, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>Updated {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            </Tilt>
          ))}

          <Tilt onClick={() => setCreating(true)} style={{ borderRadius: 22, border: `2px dashed ${cardBd}`, background: 'transparent', cursor: 'pointer', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px dashed ${cardBd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: ink3 }}>+</div>
            <div style={{ fontSize: 13, color: ink3, fontWeight: 300, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>New Collection</div>
          </Tilt>
        </div>
      )}

      {!loading && cols.length === 0 && !creating && (
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink, fontWeight: 300, marginBottom: 10 }}>No collections yet</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>Group your poems into collections.</div>
        </div>
      )}
    </div>
  );
}
