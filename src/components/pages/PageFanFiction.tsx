'use client';
import { useEffect, useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

interface Fanfic {
  id: string;
  title: string;
  blurb: string | null;
  fandom: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function PageFanFiction({ night }: Props) {
  const [fics, setFics] = useState<Fanfic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Fanfic | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [formTitle, setFormTitle] = useState('');
  const [formBlurb, setFormBlurb] = useState('');
  const [formFandom, setFormFandom] = useState('');
  const [formStatus, setFormStatus] = useState('ongoing');
  const [editTitle, setEditTitle] = useState('');
  const [editBlurb, setEditBlurb] = useState('');
  const [editFandom, setEditFandom] = useState('');
  const [editStatus, setEditStatus] = useState('ongoing');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const modalBg = night ? 'rgba(18,10,36,.98)' : 'rgba(255,252,255,.99)';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: `1px solid rgba(160,100,220,.4)`,
    background: night ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.8)',
    color: ink, fontSize: 14, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box', marginBottom: 12,
  };

  useEffect(() => {
    fetch('/api/fanfics')
      .then(r => r.json())
      .then(data => { setFics(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function createFic() {
    if (!formTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/fanfics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle.trim(), blurb: formBlurb.trim() || null, fandom: formFandom.trim() || null, status: formStatus, visibility: 'public' }),
      });
      if (res.ok) {
        const fic = await res.json();
        setFics(prev => [fic, ...prev]);
        setFormTitle(''); setFormBlurb(''); setFormFandom(''); setFormStatus('ongoing');
        setCreating(false);
      }
    } finally { setSaving(false); }
  }

  function startEdit() {
    if (!selected) return;
    setEditTitle(selected.title);
    setEditBlurb(selected.blurb ?? '');
    setEditFandom(selected.fandom ?? '');
    setEditStatus(selected.status);
    setEditing(true);
  }

  async function saveEdit() {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fanfics/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, blurb: editBlurb || null, fandom: editFandom || null, status: editStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setFics(prev => prev.map(f => f.id === updated.id ? updated : f));
        setSelected(updated);
        setEditing(false);
      }
    } finally { setSaving(false); }
  }

  async function deleteFic() {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/fanfics/${selected.id}`, { method: 'DELETE' });
      if (res.ok) {
        setFics(prev => prev.filter(f => f.id !== selected.id));
        setSelected(null); setConfirmDelete(false);
      }
    } finally { setDeleting(false); }
  }

  function closeModal() { setSelected(null); setEditing(false); setConfirmDelete(false); }

  const STATUS_OPTS = ['ongoing', 'complete', 'hiatus'];

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Fan Fiction</div>
        </div>
        <button onClick={() => setCreating(true)} style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>+ New Story</button>
      </div>

      {/* Inline create form */}
      {creating && (
        <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#c084fc', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>New Story</div>
          <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Title *" style={inputStyle} />
          <input value={formFandom} onChange={e => setFormFandom(e.target.value)} placeholder="Fandom (e.g. Studio Ghibli, Original…)" style={inputStyle} />
          <textarea value={formBlurb} onChange={e => setFormBlurb(e.target.value)} placeholder="Short blurb…"
            style={{ ...inputStyle, resize: 'vertical', minHeight: 80, fontStyle: 'italic', lineHeight: 1.7 }} />
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {STATUS_OPTS.map(s => (
              <button key={s} onClick={() => setFormStatus(s)} style={{
                padding: '4px 14px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
                background: formStatus === s ? 'rgba(124,58,237,.18)' : 'transparent',
                border: `1px solid ${formStatus === s ? 'rgba(124,58,237,.4)' : cardBd}`,
                color: formStatus === s ? '#c084fc' : ink3, fontFamily: "'DM Sans',sans-serif",
                textTransform: 'capitalize',
              }}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setCreating(false); setFormTitle(''); setFormBlurb(''); setFormFandom(''); }} style={{ flex: 1, padding: '10px', borderRadius: 12, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
            <button onClick={createFic} disabled={saving || !formTitle.trim()} style={{ flex: 2, padding: '10px', borderRadius: 12, border: 'none', background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#a855f7,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{saving ? 'Creating…' : 'Create story'}</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading your stories…</div>
      ) : fics.length === 0 && !creating ? (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300, marginBottom: 10 }}>No stories yet</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300 }}>Start your first fan fiction above.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {fics.map(f => (
            <Tilt key={f.id} onClick={() => { setSelected(f); setEditing(false); setConfirmDelete(false); }} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '20px 22px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {f.fandom && <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: 'rgba(124,58,237,.12)', color: '#a855f7', border: '1px solid rgba(124,58,237,.2)' }}>{f.fandom}</span>}
                <span style={{ fontSize: 10, color: ink3, textTransform: 'capitalize' }}>{f.status}</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 400, color: ink, marginBottom: 8 }}>{f.title}</div>
              {f.blurb && <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 12 }}>"{f.blurb.length > 100 ? f.blurb.slice(0, 100) + '…' : f.blurb}"</div>}
              <div style={{ fontSize: 10, color: ink3 }}>
                {new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </Tilt>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <>
          <div onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 401, width: '90%', maxWidth: 540, maxHeight: '88vh', overflowY: 'auto',
            background: modalBg, backdropFilter: 'blur(40px)',
            borderRadius: 28, border: `1px solid ${cardBd}`,
            boxShadow: '0 24px 80px rgba(0,0,0,.25)',
            padding: '44px 48px 36px',
          }}>
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6 }}>
              {!editing && !confirmDelete && (
                <>
                  <button onClick={startEdit} title="Edit" style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${cardBd}`, background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.8)', cursor: 'pointer', fontSize: 14, color: ink2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
                  <button onClick={() => setConfirmDelete(true)} title="Delete" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(224,80,128,.3)', background: night ? 'rgba(224,80,128,.08)' : 'rgba(255,240,245,.8)', cursor: 'pointer', fontSize: 14, color: '#e05080', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑</button>
                </>
              )}
              <button onClick={closeModal} style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${cardBd}`, background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.8)', cursor: 'pointer', fontSize: 18, color: ink3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            {confirmDelete ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink, marginBottom: 10 }}>Delete this story?</div>
                <div style={{ fontSize: 13, color: ink3, marginBottom: 28 }}>This cannot be undone.</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: '10px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                  <button onClick={deleteFic} disabled={deleting} style={{ padding: '10px 24px', borderRadius: 50, border: 'none', background: '#e05080', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{deleting ? 'Deleting…' : 'Yes, delete'}</button>
                </div>
              </div>
            ) : editing ? (
              <div>
                <div style={{ fontSize: 11, color: '#c084fc', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Editing</div>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" style={{ ...inputStyle, fontFamily: "'Playfair Display',serif", fontSize: 18 }} />
                <input value={editFandom} onChange={e => setEditFandom(e.target.value)} placeholder="Fandom" style={inputStyle} />
                <textarea value={editBlurb} onChange={e => setEditBlurb(e.target.value)} placeholder="Blurb…"
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 100, fontStyle: 'italic', lineHeight: 1.7 }} />
                <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                  {STATUS_OPTS.map(s => (
                    <button key={s} onClick={() => setEditStatus(s)} style={{
                      padding: '4px 14px', borderRadius: 50, fontSize: 11, cursor: 'pointer',
                      background: editStatus === s ? 'rgba(124,58,237,.18)' : 'transparent',
                      border: `1px solid ${editStatus === s ? 'rgba(124,58,237,.4)' : cardBd}`,
                      color: editStatus === s ? '#c084fc' : ink3, fontFamily: "'DM Sans',sans-serif",
                      textTransform: 'capitalize',
                    }}>{s}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                  <button onClick={saveEdit} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#a855f7,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{saving ? 'Saving…' : 'Save changes'}</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                  {selected.fandom && <span style={{ fontSize: 10, padding: '3px 12px', borderRadius: 50, background: 'rgba(124,58,237,.12)', color: '#a855f7', border: '1px solid rgba(124,58,237,.2)' }}>{selected.fandom}</span>}
                  <span style={{ fontSize: 10, color: ink3, textTransform: 'capitalize' }}>{selected.status}</span>
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 400, color: ink, letterSpacing: '-.02em', lineHeight: 1.3, marginBottom: 20 }}>
                  {selected.title}
                </div>
                {selected.blurb && (
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 1.9, marginBottom: 24 }}>
                    "{selected.blurb}"
                  </div>
                )}
                <div style={{ paddingTop: 20, borderTop: `1px solid ${cardBd}`, fontSize: 11, color: ink3, fontWeight: 300 }}>
                  Created {new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
