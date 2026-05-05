'use client';
import { useEffect, useState } from 'react';

interface Props { night: boolean; }

interface Fanfic {
  id: string;
  title: string;
  blurb: string | null;
  fandom: string | null;
  status: string;
  chapterCount: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  body: string;
  createdAt: string;
}

type View = 'list' | 'reader' | 'add-chapter' | 'edit-chapter' | 'create-fic' | 'edit-fic';

export function PageFanFiction({ night }: Props) {
  const [view, setView] = useState<View>('list');
  const [fics, setFics] = useState<Fanfic[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected fanfic + chapters
  const [fic, setFic] = useState<Fanfic | null>(null);
  const [chaps, setChaps] = useState<Chapter[]>([]);
  const [chapsLoading, setChapsLoading] = useState(false);
  const [activeChap, setActiveChap] = useState(1);

  // Create/edit fic form
  const [ficTitle, setFicTitle] = useState('');
  const [ficFandom, setFicFandom] = useState('');
  const [ficBlurb, setFicBlurb] = useState('');
  const [ficStatus, setFicStatus] = useState('ongoing');

  // Chapter form
  const [chapTitle, setChapTitle] = useState('');
  const [chapBody, setChapBody] = useState('');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 16px', borderRadius: 12,
    border: `1.5px solid ${cardBd}`, background: cardBg,
    color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box',
  };

  const STATUS_OPTS = ['ongoing', 'complete', 'hiatus'];

  // ── Load fanfic list ──────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/fanfics')
      .then(r => r.json())
      .then(d => { setFics(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Load chapters when a fanfic is opened ─────────────────────────
  async function openFic(f: Fanfic) {
    setFic(f);
    setActiveChap(1);
    setChapsLoading(true);
    setView('reader');
    const res = await fetch(`/api/fanfics/${f.id}/chapters`);
    const data = await res.json();
    setChaps(Array.isArray(data) ? data : []);
    setChapsLoading(false);
  }

  // ── Create fanfic ─────────────────────────────────────────────────
  async function createFic() {
    if (!ficTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/fanfics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: ficTitle.trim(), blurb: ficBlurb.trim() || null, fandom: ficFandom.trim() || null, status: ficStatus, visibility: 'public' }),
      });
      if (res.ok) {
        const f = await res.json();
        setFics(prev => [f, ...prev]);
        setFicTitle(''); setFicFandom(''); setFicBlurb(''); setFicStatus('ongoing');
        setView('list');
      }
    } finally { setSaving(false); }
  }

  // ── Update fanfic metadata ────────────────────────────────────────
  async function saveFicEdit() {
    if (!fic) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fanfics/${fic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: ficTitle, blurb: ficBlurb || null, fandom: ficFandom || null, status: ficStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setFics(prev => prev.map(x => x.id === updated.id ? updated : x));
        setFic(updated);
        setView('reader');
      }
    } finally { setSaving(false); }
  }

  // ── Delete fanfic ─────────────────────────────────────────────────
  async function deleteFic() {
    if (!fic) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/fanfics/${fic.id}`, { method: 'DELETE' });
      if (res.ok) {
        setFics(prev => prev.filter(x => x.id !== fic.id));
        setFic(null); setChaps([]); setConfirmDelete(false); setView('list');
      }
    } finally { setDeleting(false); }
  }

  // ── Add chapter ───────────────────────────────────────────────────
  async function addChapter() {
    if (!fic || !chapTitle.trim() || !chapBody.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fanfics/${fic.id}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: chapTitle.trim(), body: chapBody.trim() }),
      });
      if (res.ok) {
        const ch = await res.json();
        setChaps(prev => [...prev, ch]);
        setFics(prev => prev.map(x => x.id === fic.id ? { ...x, chapterCount: (x.chapterCount ?? 0) + 1 } : x));
        setFic(prev => prev ? { ...prev, chapterCount: (prev.chapterCount ?? 0) + 1 } : prev);
        setActiveChap(ch.chapterNumber);
        setChapTitle(''); setChapBody('');
        setView('reader');
      }
    } finally { setSaving(false); }
  }

  // ── Save chapter edit ─────────────────────────────────────────────
  async function saveChapEdit() {
    if (!fic) return;
    const ch = chaps.find(c => c.chapterNumber === activeChap);
    if (!ch) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fanfics/${fic.id}/chapters/${activeChap}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: chapTitle, body: chapBody }),
      });
      if (res.ok) {
        const updated = await res.json();
        setChaps(prev => prev.map(c => c.chapterNumber === activeChap ? updated : c));
        setView('reader');
      }
    } finally { setSaving(false); }
  }

  function startEditFic() {
    if (!fic) return;
    setFicTitle(fic.title); setFicFandom(fic.fandom ?? '');
    setFicBlurb(fic.blurb ?? ''); setFicStatus(fic.status);
    setView('edit-fic');
  }

  function startEditChap() {
    const ch = chaps.find(c => c.chapterNumber === activeChap);
    if (!ch) return;
    setChapTitle(ch.title); setChapBody(ch.body);
    setView('edit-chapter');
  }

  function startAddChap() {
    setChapTitle(''); setChapBody('');
    setView('add-chapter');
  }

  const currentChap = chaps.find(c => c.chapterNumber === activeChap);

  // ══════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ══════════════════════════════════════════════════════════════════
  if (view === 'list') return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Fan Fiction</div>
        </div>
        <button onClick={() => { setFicTitle(''); setFicFandom(''); setFicBlurb(''); setFicStatus('ongoing'); setView('create-fic'); }} style={{
          padding: '10px 22px', borderRadius: 50, border: 'none',
          background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff',
          fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
        }}>+ New Story</button>
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
      ) : fics.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300, marginBottom: 10 }}>No stories yet</div>
          <div style={{ fontSize: 13, color: ink3 }}>Start your first fan fiction above.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {fics.map(f => (
            <div key={f.id} onClick={() => openFic(f)} style={{
              borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg,
              backdropFilter: 'blur(18px)', padding: '22px 24px', cursor: 'pointer',
              transition: 'border-color .2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(192,132,252,.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = cardBd)}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                {f.fandom && <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: 'rgba(124,58,237,.12)', color: '#a855f7', border: '1px solid rgba(124,58,237,.2)' }}>{f.fandom}</span>}
                <span style={{ fontSize: 10, color: ink3, textTransform: 'capitalize' }}>{f.status}</span>
                <span style={{ fontSize: 10, color: ink3, marginLeft: 'auto' }}>{f.chapterCount ?? 0} ch</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 400, color: ink, marginBottom: 10, lineHeight: 1.3 }}>{f.title}</div>
              {f.blurb && <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 14 }}>"{f.blurb.length > 120 ? f.blurb.slice(0, 120) + '…' : f.blurb}"</div>}
              <div style={{ fontSize: 10, color: ink3 }}>
                Updated {new Date(f.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════
  // CREATE FANFIC
  // ══════════════════════════════════════════════════════════════════
  if (view === 'create-fic' || view === 'edit-fic') {
    const isEdit = view === 'edit-fic';
    return (
      <div style={{ padding: '32px 40px', maxWidth: 640, margin: '0 auto' }}>
        <button onClick={() => setView(isEdit ? 'reader' : 'list')} style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 13, marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 300, color: ink, marginBottom: 28 }}>{isEdit ? 'Edit story' : 'New story'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Title *</label>
            <input value={ficTitle} onChange={e => setFicTitle(e.target.value)} placeholder="Story title…" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Fandom / Universe</label>
            <input value={ficFandom} onChange={e => setFicFandom(e.target.value)} placeholder="e.g. Studio Ghibli, Original…" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Summary</label>
            <textarea value={ficBlurb} onChange={e => setFicBlurb(e.target.value)} placeholder="A brief summary…" style={{ ...inputStyle, minHeight: 90, resize: 'vertical' as const, lineHeight: 1.7 }} />
          </div>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUS_OPTS.map(s => (
                <button key={s} onClick={() => setFicStatus(s)} style={{
                  padding: '6px 16px', borderRadius: 50, fontSize: 11, cursor: 'pointer', textTransform: 'capitalize',
                  background: ficStatus === s ? 'rgba(124,58,237,.18)' : 'transparent',
                  border: `1px solid ${ficStatus === s ? 'rgba(124,58,237,.35)' : cardBd}`,
                  color: ficStatus === s ? '#c084fc' : ink3, fontFamily: "'DM Sans',sans-serif",
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button onClick={() => setView(isEdit ? 'reader' : 'list')} style={{ padding: '11px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
            <button onClick={isEdit ? saveFicEdit : createFic} disabled={saving || !ficTitle.trim()} style={{
              padding: '11px 28px', borderRadius: 50, border: 'none',
              background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#7c3aed)',
              color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              boxShadow: '0 6px 20px rgba(124,58,237,.3)',
            }}>{saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Create story →')}</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // ADD / EDIT CHAPTER
  // ══════════════════════════════════════════════════════════════════
  if (view === 'add-chapter' || view === 'edit-chapter') {
    const isEdit = view === 'edit-chapter';
    return (
      <div style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>
        <button onClick={() => setView('reader')} style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 13, marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>← Back to {fic?.title}</button>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 300, color: ink, marginBottom: 6 }}>{isEdit ? `Edit Chapter ${activeChap}` : `Chapter ${(fic?.chapterCount ?? 0) + 1}`}</div>
        <div style={{ fontSize: 12, color: ink3, marginBottom: 28 }}>{fic?.title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Chapter title *</label>
            <input value={chapTitle} onChange={e => setChapTitle(e.target.value)} placeholder="Chapter title…" style={inputStyle} autoFocus />
          </div>
          <div>
            <label style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Content *</label>
            <textarea value={chapBody} onChange={e => setChapBody(e.target.value)} placeholder="Begin writing…"
              style={{ ...inputStyle, minHeight: 340, resize: 'vertical' as const, fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', lineHeight: 2.1 }} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button onClick={() => setView('reader')} style={{ padding: '11px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
            <button onClick={isEdit ? saveChapEdit : addChapter} disabled={saving || !chapTitle.trim() || !chapBody.trim()} style={{
              padding: '11px 28px', borderRadius: 50, border: 'none',
              background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#c084fc,#7c3aed)',
              color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
              boxShadow: '0 6px 20px rgba(124,58,237,.3)',
            }}>{saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Publish chapter →')}</button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // READER VIEW  (left chapter sidebar + right content)
  // ══════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>

      {/* Left sidebar */}
      <div style={{
        width: 240, flexShrink: 0,
        borderRight: `1px solid ${cardBd}`,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Back + meta */}
        <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${cardBd}` }}>
          <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 12, marginBottom: 14, fontFamily: "'DM Sans',sans-serif", display: 'block' }}>← All stories</button>
          {fic?.fandom && <div style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: 'rgba(124,58,237,.12)', color: '#a855f7', border: '1px solid rgba(124,58,237,.2)', display: 'inline-block', marginBottom: 8 }}>{fic.fandom}</div>}
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 400, color: ink, lineHeight: 1.4, marginBottom: 6 }}>{fic?.title}</div>
          <div style={{ fontSize: 10, color: ink3, textTransform: 'capitalize', marginBottom: 14 }}>{fic?.status}</div>
          {/* Story actions */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={startEditFic} style={{ flex: 1, padding: '6px', borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>✎ Edit</button>
            <button onClick={() => setConfirmDelete(true)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(224,80,128,.3)', background: 'transparent', color: '#e05080', fontSize: 11, cursor: 'pointer' }}>🗑</button>
          </div>
        </div>

        {/* Chapter list */}
        <div style={{ padding: '14px 12px', flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 10, paddingLeft: 6 }}>Chapters</div>
          {chapsLoading ? (
            <div style={{ fontSize: 12, color: ink3, fontStyle: 'italic', padding: '0 6px' }}>Loading…</div>
          ) : chaps.length === 0 ? (
            <div style={{ fontSize: 12, color: ink3, fontStyle: 'italic', padding: '0 6px' }}>No chapters yet.</div>
          ) : chaps.map(c => (
            <button key={c.id} onClick={() => setActiveChap(c.chapterNumber)} style={{
              width: '100%', padding: '10px 10px', borderRadius: 10, border: 'none',
              cursor: 'pointer', textAlign: 'left', marginBottom: 2,
              background: activeChap === c.chapterNumber ? 'rgba(124,58,237,.12)' : 'transparent',
            }}
              onMouseEnter={e => { if (activeChap !== c.chapterNumber) e.currentTarget.style.background = n ? 'rgba(160,124,200,.1)' : 'rgba(208,191,240,.2)'; }}
              onMouseLeave={e => { if (activeChap !== c.chapterNumber) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ fontSize: 10, color: activeChap === c.chapterNumber ? '#c084fc' : ink3, marginBottom: 2 }}>Chapter {c.chapterNumber}</div>
              <div style={{ fontSize: 12, fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: activeChap === c.chapterNumber ? '#c084fc' : ink2, lineHeight: 1.4 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: ink3, marginTop: 2 }}>{c.body.split(/\s+/).filter(Boolean).length} words</div>
            </button>
          ))}
          <button onClick={startAddChap} style={{
            width: '100%', marginTop: 10, padding: '9px 10px', borderRadius: 10,
            border: `1px dashed ${cardBd}`, background: 'transparent', cursor: 'pointer',
            fontSize: 11, color: ink3, fontFamily: "'DM Sans',sans-serif", textAlign: 'left',
          }}>+ Add chapter</button>
        </div>
      </div>

      {/* Right: reader */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '44px 80px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* Delete confirmation overlay */}
          {confirmDelete && (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink, marginBottom: 12 }}>Delete "{fic?.title}"?</div>
              <div style={{ fontSize: 13, color: ink3, marginBottom: 32 }}>All chapters will be permanently deleted.</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setConfirmDelete(false)} style={{ padding: '11px 28px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                <button onClick={deleteFic} disabled={deleting} style={{ padding: '11px 28px', borderRadius: 50, border: 'none', background: '#e05080', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{deleting ? 'Deleting…' : 'Yes, delete'}</button>
              </div>
            </div>
          )}

          {!confirmDelete && chaps.length === 0 && !chapsLoading && (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300, marginBottom: 12 }}>No chapters yet</div>
              <div style={{ fontSize: 13, color: ink3, marginBottom: 28 }}>Write the first chapter of your story.</div>
              <button onClick={startAddChap} style={{ padding: '12px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 20px rgba(124,58,237,.28)' }}>Write Chapter 1 →</button>
            </div>
          )}

          {!confirmDelete && currentChap && (
            <>
              {/* Chapter header */}
              <div style={{ fontSize: 10, color: ink3, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Chapter {currentChap.chapterNumber}</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300, color: ink, lineHeight: 1.3 }}>
                  {currentChap.title}
                </div>
                <button onClick={startEditChap} style={{
                  padding: '6px 14px', borderRadius: 50, border: `1px solid ${cardBd}`,
                  background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif", flexShrink: 0, marginLeft: 20, marginTop: 4,
                }}>✎ Edit</button>
              </div>

              {/* Chapter body */}
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 300, color: ink2, lineHeight: 2.1, whiteSpace: 'pre-line' }}>
                {currentChap.body}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 24, borderTop: `1px solid ${cardBd}` }}>
                <button
                  onClick={() => setActiveChap(activeChap - 1)}
                  disabled={activeChap === 1}
                  style={{
                    padding: '10px 24px', borderRadius: 50, border: `1px solid ${cardBd}`,
                    background: 'transparent', color: activeChap === 1 ? ink3 : ink2,
                    cursor: activeChap === 1 ? 'default' : 'pointer',
                    fontSize: 12, fontFamily: "'DM Sans',sans-serif", opacity: activeChap === 1 ? .4 : 1,
                  }}
                >← Previous</button>
                <span style={{ fontSize: 11, color: ink3, alignSelf: 'center' }}>{activeChap} / {chaps.length}</span>
                <button
                  onClick={() => activeChap < chaps.length ? setActiveChap(activeChap + 1) : startAddChap()}
                  style={{
                    padding: '10px 24px', borderRadius: 50, border: 'none',
                    background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
                    color: '#fff', cursor: 'pointer',
                    fontSize: 12, fontFamily: "'DM Sans',sans-serif",
                  }}
                >{activeChap < chaps.length ? 'Next →' : '+ New chapter'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
