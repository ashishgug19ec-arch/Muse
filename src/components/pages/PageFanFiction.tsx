'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WriteToolbar } from '@/components/ui/WriteToolbar';
import ImageUpload from '@/components/ImageUpload';

interface Props { night: boolean; defaultView?: View; }

interface Fanfic {
  id: string;
  title: string;
  blurb: string | null;
  fandom: string | null;
  coverImageUrl: string | null;
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

const statusColors: Record<string, { text: string; bg: string; border: string }> = {
  ongoing:  { text: '#5e9975', bg: 'rgba(144,200,168,.15)', border: 'rgba(144,200,168,.35)' },
  complete: { text: '#c084fc', bg: 'rgba(192,132,252,.12)', border: 'rgba(192,132,252,.3)' },
  hiatus:   { text: '#c8a050', bg: 'rgba(200,160,80,.12)',  border: 'rgba(200,160,80,.3)' },
};

const ficGrads = [
  'linear-gradient(135deg,rgba(192,132,252,.18),rgba(124,58,237,.1))',
  'linear-gradient(135deg,rgba(244,114,182,.15),rgba(208,100,136,.08))',
  'linear-gradient(135deg,rgba(144,200,168,.15),rgba(94,153,117,.08))',
  'linear-gradient(135deg,rgba(248,216,144,.15),rgba(200,160,80,.08))',
];

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function PageFanFiction({ night, defaultView }: Props) {
  const [view, setView] = useState<View>(defaultView ?? 'list');
  const [fics, setFics] = useState<Fanfic[]>([]);
  const [loading, setLoading] = useState(true);
  const [fic, setFic] = useState<Fanfic | null>(null);
  const [chaps, setChaps] = useState<Chapter[]>([]);
  const [chapsLoading, setChapsLoading] = useState(false);
  const [activeChap, setActiveChap] = useState(1);
  const [ficTitle, setFicTitle] = useState('');
  const [ficFandom, setFicFandom] = useState('');
  const [ficBlurb, setFicBlurb] = useState('');
  const [ficStatus, setFicStatus] = useState('ongoing');
  const [ficCoverUrl, setFicCoverUrl] = useState('');
  const [chapTitle, setChapTitle] = useState('');
  const chapBodyRef = useRef('');
  const chapEditorRef = useRef<HTMLDivElement>(null);
  const [chapFontSize, setChapFontSize] = useState(15);
  const [chapLineHeight, setChapLineHeight] = useState(2.1);
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
    border: `1.5px solid ${cardBd}`,
    background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.82)',
    color: ink, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
    outline: 'none', boxSizing: 'border-box',
  };

  const STATUS_OPTS = ['ongoing', 'complete', 'hiatus'];

  useEffect(() => {
    if (!chapEditorRef.current) return;
    if (view === 'edit-chapter') chapEditorRef.current.innerHTML = chapBodyRef.current;
    else if (view === 'add-chapter') chapEditorRef.current.innerHTML = '';
  }, [view]);

  useEffect(() => {
    fetch('/api/fanfics').then(r => r.json()).then(d => { setFics(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function openFic(f: Fanfic) {
    setFic(f); setActiveChap(1); setChapsLoading(true); setView('reader');
    const res = await fetch(`/api/fanfics/${f.id}/chapters`);
    const data = await res.json();
    setChaps(Array.isArray(data) ? data : []);
    setChapsLoading(false);
  }

  async function createFic() {
    if (!ficTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/fanfics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: ficTitle.trim(), blurb: ficBlurb.trim() || null, fandom: ficFandom.trim() || null, status: ficStatus, visibility: 'public', coverImageUrl: ficCoverUrl || null }) });
      if (res.ok) { const f = await res.json(); setFics(prev => [f, ...prev]); setFicTitle(''); setFicFandom(''); setFicBlurb(''); setFicStatus('ongoing'); setFicCoverUrl(''); setView('list'); }
    } finally { setSaving(false); }
  }

  async function saveFicEdit() {
    if (!fic) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fanfics/${fic.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: ficTitle, blurb: ficBlurb || null, fandom: ficFandom || null, status: ficStatus, coverImageUrl: ficCoverUrl || null }) });
      if (res.ok) { const updated = await res.json(); setFics(prev => prev.map(x => x.id === updated.id ? updated : x)); setFic(updated); setView('reader'); }
    } finally { setSaving(false); }
  }

  async function deleteFic() {
    if (!fic) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/fanfics/${fic.id}`, { method: 'DELETE' });
      if (res.ok) { setFics(prev => prev.filter(x => x.id !== fic.id)); setFic(null); setChaps([]); setConfirmDelete(false); setView('list'); }
    } finally { setDeleting(false); }
  }

  async function addChapter() {
    const body = chapEditorRef.current?.innerHTML ?? '';
    const plain = chapEditorRef.current?.innerText?.trim() ?? '';
    if (!fic || !chapTitle.trim() || !plain) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/fanfics/${fic.id}/chapters`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: chapTitle.trim(), body }) });
      if (res.ok) { const ch = await res.json(); setChaps(prev => [...prev, ch]); setFics(prev => prev.map(x => x.id === fic.id ? { ...x, chapterCount: (x.chapterCount ?? 0) + 1 } : x)); setFic(prev => prev ? { ...prev, chapterCount: (prev.chapterCount ?? 0) + 1 } : prev); setActiveChap(ch.chapterNumber); setChapTitle(''); setView('reader'); }
    } finally { setSaving(false); }
  }

  async function saveChapEdit() {
    if (!fic) return;
    const ch = chaps.find(c => c.chapterNumber === activeChap);
    if (!ch) return;
    setSaving(true);
    const body = chapEditorRef.current?.innerHTML ?? '';
    try {
      const res = await fetch(`/api/fanfics/${fic.id}/chapters/${activeChap}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: chapTitle, body }) });
      if (res.ok) { const updated = await res.json(); setChaps(prev => prev.map(c => c.chapterNumber === activeChap ? updated : c)); setView('reader'); }
    } finally { setSaving(false); }
  }

  function startEditFic() { if (!fic) return; setFicTitle(fic.title); setFicFandom(fic.fandom ?? ''); setFicBlurb(fic.blurb ?? ''); setFicStatus(fic.status); setFicCoverUrl(fic.coverImageUrl ?? ''); setView('edit-fic'); }
  function startEditChap() { const ch = chaps.find(c => c.chapterNumber === activeChap); if (!ch) return; setChapTitle(ch.title); chapBodyRef.current = ch.body; setView('edit-chapter'); }
  function startAddChap() { setChapTitle(''); chapBodyRef.current = ''; setView('add-chapter'); }

  const currentChap = chaps.find(c => c.chapterNumber === activeChap);

  // ══ LIST VIEW ══
  if (view === 'list') return (
    <div style={{ padding: '36px 44px', maxWidth: 860, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#f472b6' }}>My Stories</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            <span style={{ background: 'linear-gradient(135deg,#f472b6,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fan</span>{' '}
            <span style={{ color: ink }}>Fiction</span>
          </h1>
          <p style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>{fics.length} {fics.length === 1 ? 'story' : 'stories'} in your world</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }}
          onClick={() => { setFicTitle(''); setFicFandom(''); setFicBlurb(''); setFicStatus('ongoing'); setFicCoverUrl(''); setView('create-fic'); }}
          style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#f472b6,#c084fc)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 18px rgba(244,114,182,.3)', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Story
        </motion.button>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          </motion.div>
          <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading your stories…</div>
        </div>
      ) : fics.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '72px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 16, opacity: .35 }}>📖</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink2, fontWeight: 300, marginBottom: 8 }}>No stories yet</div>
          <p style={{ fontSize: 13, color: ink3, marginBottom: 28 }}>Every epic began with an opening line.</p>
          <motion.button whileHover={{ scale: 1.03, y: -1 }} onClick={() => setView('create-fic')} style={{ padding: '12px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#f472b6,#c084fc)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 22px rgba(244,114,182,.3)' }}>Start your first story →</motion.button>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={stagger} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {fics.map((f, i) => {
            const sc = statusColors[f.status] ?? statusColors.ongoing;
            const ficBg = ficGrads[i % ficGrads.length];
            return (
              <motion.div key={f.id} variants={fadeUp}
                onClick={() => openFic(f)}
                whileHover={{ y: -4, scale: 1.008 }}
                style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: n ? cardBg : ficBg, backdropFilter: 'blur(20px)', padding: '24px 26px', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(124,58,237,.06)' }}
              >
                <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, background: 'radial-gradient(circle,rgba(192,132,252,.2),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 12 }}>
                  {f.fandom && <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: 'rgba(192,132,252,.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,.3)' }}>{f.fandom}</span>}
                  <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, textTransform: 'capitalize' }}>{f.status}</span>
                  <span style={{ fontSize: 10, color: ink3, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    {f.chapterCount ?? 0} ch
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 400, color: ink, marginBottom: 10, lineHeight: 1.3 }}>{f.title}</h3>
                {f.blurb && <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 14 }}>"{f.blurb.length > 110 ? f.blurb.slice(0, 110) + '…' : f.blurb}"</p>}
                <div style={{ fontSize: 10, color: ink3, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Updated {new Date(f.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );

  // ══ CREATE / EDIT FIC ══
  if (view === 'create-fic' || view === 'edit-fic') {
    const isEdit = view === 'edit-fic';
    return (
      <div style={{ padding: '36px 44px', maxWidth: 600, margin: '0 auto' }}>
        <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} onClick={() => setView(isEdit ? 'reader' : 'list')} style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 13, marginBottom: 28, fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {isEdit ? `Back to "${fic?.title}"` : 'All stories'}
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 22, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
            <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#f472b6' }}>{isEdit ? 'Edit story' : 'New story'}</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300, color: ink, marginBottom: 32 }}>
            {isEdit ? 'Update your story' : 'Begin a new world'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 140, flexShrink: 0 }}>
                <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Cover image</label>
                <ImageUpload endpoint="fanficCover" value={ficCoverUrl} onChange={setFicCoverUrl} aspectRatio="portrait" label="Add cover" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Title *', val: ficTitle, set: setFicTitle, placeholder: 'Story title…' },
                  { label: 'Fandom / Universe', val: ficFandom, set: setFicFandom, placeholder: 'e.g. Studio Ghibli, Original…' },
                ].map(f2 => (
                  <div key={f2.label}>
                    <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>{f2.label}</label>
                    <input value={f2.val} onChange={e => f2.set(e.target.value)} placeholder={f2.placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Summary</label>
              <textarea value={ficBlurb} onChange={e => setFicBlurb(e.target.value)} placeholder="A brief summary of your story…" rows={3} style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.7 }} />
            </div>

            <div>
              <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 10 }}>Status</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {STATUS_OPTS.map(s => {
                  const sc = statusColors[s];
                  return (
                    <button key={s} onClick={() => setFicStatus(s)} style={{ padding: '7px 18px', borderRadius: 50, fontSize: 11, cursor: 'pointer', textTransform: 'capitalize' as const, background: ficStatus === s ? sc.bg : 'transparent', border: `1px solid ${ficStatus === s ? sc.border : cardBd}`, color: ficStatus === s ? sc.text : ink3, fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' }}>{s}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <button onClick={() => setView(isEdit ? 'reader' : 'list')} style={{ padding: '11px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }}
                onClick={isEdit ? saveFicEdit : createFic}
                disabled={saving || !ficTitle.trim()}
                style={{ padding: '11px 28px', borderRadius: 50, border: 'none', background: saving ? 'rgba(244,114,182,.4)' : 'linear-gradient(135deg,#f472b6,#c084fc)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 20px rgba(244,114,182,.3)' }}
              >{saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Create story →')}</motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══ ADD / EDIT CHAPTER ══
  if (view === 'add-chapter' || view === 'edit-chapter') {
    const isEdit = view === 'edit-chapter';
    return (
      <div style={{ padding: '36px 44px', maxWidth: 720, margin: '0 auto' }}>
        <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} onClick={() => setView('reader')} style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 13, marginBottom: 28, fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to {fic?.title}
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div style={{ fontSize: 11, color: ink3, marginBottom: 4 }}>{fic?.title}</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300, color: ink, marginBottom: 28 }}>
            {isEdit ? `Edit Chapter ${activeChap}` : `Chapter ${(fic?.chapterCount ?? 0) + 1}`}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Chapter title *</label>
              <input value={chapTitle} onChange={e => setChapTitle(e.target.value)} placeholder="Chapter title…" style={inputStyle} autoFocus />
            </div>
            <div>
              <label style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, display: 'block', marginBottom: 8 }}>Content *</label>
              <WriteToolbar editorRef={chapEditorRef} night={n} fontSize={chapFontSize} setFontSize={setChapFontSize} lineHeight={chapLineHeight} setLineHeight={setChapLineHeight} />
              <style>{`[data-chap-placeholder]:empty::before{content:attr(data-chap-placeholder);color:${n?'rgba(160,130,200,.38)':'rgba(130,100,160,.32)'};font-style:italic;pointer-events:none;}`}</style>
              <div ref={chapEditorRef} contentEditable suppressContentEditableWarning data-chap-placeholder="Begin writing…" style={{ ...inputStyle, minHeight: 340, fontFamily: "'Playfair Display',serif", fontSize: chapFontSize, fontStyle: 'italic', lineHeight: chapLineHeight, outline: 'none', overflowY: 'auto', whiteSpace: 'pre-wrap' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <button onClick={() => setView('reader')} style={{ padding: '11px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .98 }} onClick={isEdit ? saveChapEdit : addChapter} disabled={saving || !chapTitle.trim()} style={{ padding: '11px 28px', borderRadius: 50, border: 'none', background: saving ? 'rgba(244,114,182,.4)' : 'linear-gradient(135deg,#f472b6,#c084fc)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 20px rgba(244,114,182,.3)' }}>
                {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Publish chapter →')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══ READER VIEW ══
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Sidebar */}
      <div style={{ width: 260, flexShrink: 0, borderRight: `1px solid ${cardBd}`, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: n ? 'rgba(255,255,255,.02)' : 'rgba(248,244,255,.6)', backdropFilter: 'blur(16px)' }}>
        <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${cardBd}` }}>
          <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: ink3, cursor: 'pointer', fontSize: 12, marginBottom: 16, fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            All stories
          </button>
          {fic?.fandom && <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 50, background: 'rgba(192,132,252,.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,.3)', display: 'inline-block', marginBottom: 8 }}>{fic.fandom}</span>}
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 400, color: ink, lineHeight: 1.4, marginBottom: 4 }}>{fic?.title}</div>
          {fic?.status && <div style={{ fontSize: 10, color: statusColors[fic.status]?.text ?? ink3, textTransform: 'capitalize', marginBottom: 14 }}>{fic.status}</div>}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={startEditFic} style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif', display: 'flex', alignItems: 'center', gap: 4" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
              Edit
            </button>
            <button onClick={() => setConfirmDelete(true)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(224,80,128,.3)', background: 'transparent', color: '#e05080', fontSize: 11, cursor: 'pointer' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '14px 14px', flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3, marginBottom: 10, paddingLeft: 4 }}>Chapters</div>
          {chapsLoading ? <div style={{ fontSize: 12, color: ink3, fontStyle: 'italic', padding: '0 4px' }}>Loading…</div>
            : chaps.length === 0 ? <div style={{ fontSize: 12, color: ink3, fontStyle: 'italic', padding: '0 4px' }}>No chapters yet.</div>
            : chaps.map(c => (
              <button key={c.id} onClick={() => setActiveChap(c.chapterNumber)}
                style={{ width: '100%', padding: '10px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 2, background: activeChap === c.chapterNumber ? 'rgba(244,114,182,.12)' : 'transparent', transition: 'background .15s' }}
                onMouseEnter={e => { if (activeChap !== c.chapterNumber) e.currentTarget.style.background = n ? 'rgba(160,124,200,.08)' : 'rgba(208,191,240,.18)'; }}
                onMouseLeave={e => { if (activeChap !== c.chapterNumber) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ fontSize: 10, color: activeChap === c.chapterNumber ? '#f472b6' : ink3, marginBottom: 1 }}>Ch {c.chapterNumber}</div>
                <div style={{ fontSize: 12, fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: activeChap === c.chapterNumber ? '#f472b6' : ink2, lineHeight: 1.4 }}>{c.title}</div>
              </button>
            ))
          }
          <button onClick={startAddChap} style={{ width: '100%', marginTop: 8, padding: '9px 10px', borderRadius: 10, border: `1.5px dashed ${cardBd}`, background: 'transparent', cursor: 'pointer', fontSize: 11, color: ink3, fontFamily: "'DM Sans',sans-serif", textAlign: 'left' }}>+ Add chapter</button>
        </div>
      </div>

      {/* Reader */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px 80px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {confirmDelete ? (
              <motion.div key="delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', paddingTop: 60 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink, marginBottom: 10 }}>Delete "{fic?.title}"?</div>
                <div style={{ fontSize: 13, color: ink3, marginBottom: 32 }}>All chapters will be permanently deleted.</div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: '11px 28px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                  <button onClick={deleteFic} disabled={deleting} style={{ padding: '11px 28px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#e05080,#c0304a)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{deleting ? 'Deleting…' : 'Yes, delete'}</button>
                </div>
              </motion.div>
            ) : chaps.length === 0 && !chapsLoading ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: 60 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: ink2, fontWeight: 300, marginBottom: 10 }}>No chapters yet</div>
                <p style={{ fontSize: 13, color: ink3, marginBottom: 28 }}>Write the first chapter of your story.</p>
                <motion.button whileHover={{ scale: 1.03, y: -1 }} onClick={startAddChap} style={{ padding: '12px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#f472b6,#c084fc)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 6px 20px rgba(244,114,182,.28)' }}>Write Chapter 1 →</motion.button>
              </motion.div>
            ) : currentChap ? (
              <motion.div key={currentChap.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{ fontSize: 10, color: '#f472b6', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Chapter {currentChap.chapterNumber}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 300, color: ink, lineHeight: 1.3 }}>{currentChap.title}</h2>
                  <button onClick={startEditChap} style={{ padding: '6px 14px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", flexShrink: 0, marginLeft: 20, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                    Edit
                  </button>
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 300, color: ink2, lineHeight: 2.1 }} dangerouslySetInnerHTML={{ __html: /<[a-z][\s\S]*?>/i.test(currentChap.body) ? currentChap.body : currentChap.body.replace(/\n/g, '<br>') }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 24, borderTop: `1px solid ${cardBd}` }}>
                  <button onClick={() => setActiveChap(activeChap - 1)} disabled={activeChap === 1} style={{ padding: '10px 24px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: activeChap === 1 ? ink3 : ink2, cursor: activeChap === 1 ? 'default' : 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif", opacity: activeChap === 1 ? .4 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>← Previous</button>
                  <span style={{ fontSize: 11, color: ink3, alignSelf: 'center' }}>{activeChap} / {chaps.length}</span>
                  <motion.button whileHover={{ scale: 1.03, y: -1 }} onClick={() => activeChap < chaps.length ? setActiveChap(activeChap + 1) : startAddChap()} style={{ padding: '10px 24px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#f472b6,#c084fc)', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                    {activeChap < chaps.length ? 'Next →' : '+ New chapter'}
                  </motion.button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
