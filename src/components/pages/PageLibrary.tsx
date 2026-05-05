'use client';
import { useEffect, useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

interface Poem {
  id: string;
  title: string;
  body: string;
  type: string | null;
  mood: string | null;
  createdAt: string;
}

const MOODS = ['Reflective', 'Melancholic', 'Peaceful', 'Hopeful'];

export function PageLibrary({ night }: Props) {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Poem | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editMood, setEditMood] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const modalBg = night ? 'rgba(18,10,36,.98)' : 'rgba(255,252,255,.99)';

  useEffect(() => {
    fetch('/api/poems')
      .then(r => r.json())
      .then(data => { setPoems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function openPoem(p: Poem) {
    setSelected(p);
    setEditing(false);
    setConfirmDelete(false);
  }

  function startEdit() {
    if (!selected) return;
    setEditTitle(selected.title);
    setEditBody(selected.body);
    setEditMood(selected.mood ?? 'Reflective');
    setEditing(true);
  }

  async function saveEdit() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/poems/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, body: editBody, mood: editMood }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPoems(prev => prev.map(p => p.id === updated.id ? updated : p));
        setSelected(updated);
        setEditing(false);
      }
    } finally { setSaving(false); }
  }

  async function deletePoem() {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/poems/${selected.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPoems(prev => prev.filter(p => p.id !== selected.id));
        setSelected(null);
        setConfirmDelete(false);
      }
    } finally { setDeleting(false); }
  }

  function closeModal() {
    setSelected(null);
    setEditing(false);
    setConfirmDelete(false);
  }

  function preview(body: string) {
    const lines = body.split('\n').filter(l => l.trim()).slice(0, 2).join(' / ');
    return lines.length > 80 ? lines.slice(0, 80) + '…' : lines;
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: `1px solid rgba(160,100,220,.4)`,
    background: night ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.8)',
    color: ink, fontSize: 14, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box', marginBottom: 14,
  };

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>My Library</div>
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading your poems…</div>
      ) : poems.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300, marginBottom: 10 }}>Your garden is empty</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>Write your first poem in the Sanctuary.</div>
        </div>
      ) : (
        <div style={{ columnCount: 3, columnGap: 14 }}>
          {poems.map(p => (
            <Tilt key={p.id} onClick={() => openPoem(p)} style={{
              breakInside: 'avoid' as const, marginBottom: 14, borderRadius: 18,
              border: `1.5px solid ${cardBd}`, background: cardBg,
              backdropFilter: 'blur(20px)', padding: '20px 22px', cursor: 'pointer',
            }}>
              {p.type && <span className="tag tag-purple">{p.type}</span>}
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, color: ink, marginTop: p.type ? 10 : 0, marginBottom: 8, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 1.8 }}>{preview(p.body)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                <div style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>
                  {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                {p.mood && <div style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>{p.mood}</div>}
              </div>
            </Tilt>
          ))}
        </div>
      )}

      {/* Poem reader / editor modal */}
      {selected && (
        <>
          <div onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 401, width: '90%', maxWidth: 560, maxHeight: '88vh', overflowY: 'auto',
            background: modalBg, backdropFilter: 'blur(40px)',
            borderRadius: 28, border: `1px solid ${cardBd}`,
            boxShadow: '0 24px 80px rgba(0,0,0,.25)',
            padding: '44px 48px 36px',
          }}>
            {/* Top action bar */}
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6 }}>
              {!editing && !confirmDelete && (
                <>
                  <button onClick={startEdit} title="Edit" style={{
                    width: 32, height: 32, borderRadius: '50%', border: `1px solid ${cardBd}`,
                    background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.8)',
                    cursor: 'pointer', fontSize: 14, color: ink2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✎</button>
                  <button onClick={() => setConfirmDelete(true)} title="Delete" style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '1px solid rgba(224,80,128,.3)',
                    background: night ? 'rgba(224,80,128,.08)' : 'rgba(255,240,245,.8)',
                    cursor: 'pointer', fontSize: 14, color: '#e05080',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>🗑</button>
                </>
              )}
              <button onClick={closeModal} style={{
                width: 32, height: 32, borderRadius: '50%', border: `1px solid ${cardBd}`,
                background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.8)',
                cursor: 'pointer', fontSize: 18, color: ink3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
              }}>×</button>
            </div>

            {confirmDelete ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink, marginBottom: 10 }}>Delete this poem?</div>
                <div style={{ fontSize: 13, color: ink3, marginBottom: 28 }}>This cannot be undone.</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: '10px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                  <button onClick={deletePoem} disabled={deleting} style={{ padding: '10px 24px', borderRadius: 50, border: 'none', background: '#e05080', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{deleting ? 'Deleting…' : 'Yes, delete'}</button>
                </div>
              </div>
            ) : editing ? (
              <div>
                <div style={{ fontSize: 11, color: '#c084fc', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Editing</div>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title"
                  style={{ ...inputStyle, fontFamily: "'Playfair Display',serif", fontSize: 18 }} />
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} placeholder="Poem body…"
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 160, fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', lineHeight: 1.9 }} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setEditMood(m)} style={{
                      padding: '4px 14px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
                      background: editMood === m ? 'rgba(124,58,237,.18)' : 'transparent',
                      border: `1px solid ${editMood === m ? 'rgba(124,58,237,.4)' : cardBd}`,
                      color: editMood === m ? '#c084fc' : ink3, fontFamily: "'DM Sans',sans-serif",
                    }}>{m}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                  <button onClick={saveEdit} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#a855f7,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{saving ? 'Saving…' : 'Save changes'}</button>
                </div>
              </div>
            ) : (
              <>
                {selected.mood && (
                  <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#c084fc', marginBottom: 14 }}>{selected.mood}</div>
                )}
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 400, color: ink, letterSpacing: '-.02em', lineHeight: 1.3, marginBottom: 28 }}>
                  {selected.title}
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 2.2, whiteSpace: 'pre-wrap' }}>
                  {selected.body}
                </div>
                <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${cardBd}` }}>
                  <div style={{ fontSize: 11, color: ink3, fontWeight: 300 }}>
                    {new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
