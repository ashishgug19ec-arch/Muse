'use client';
import { useEffect, useRef, useState } from 'react';

interface Props { night: boolean; }

interface Scrap {
  id: string;
  body: string;
  mood: string | null;
  createdAt: string;
}

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
  purple: { bg: 'rgba(208,191,240,.38)', text: '#5b21b6', bd: 'rgba(208,191,240,.62)' },
  rose:   { bg: 'rgba(240,168,192,.24)', text: '#9d174d', bd: 'rgba(240,168,192,.42)' },
  sage:   { bg: 'rgba(144,184,152,.22)', text: '#166534', bd: 'rgba(144,184,152,.42)' },
  gold:   { bg: 'rgba(200,160,80,.18)',  text: '#7a5a10', bd: 'rgba(200,160,80,.36)'  },
  night:  { bg: 'rgba(124,58,237,.16)',  text: '#c084fc', bd: 'rgba(124,58,237,.32)'  },
};

function moodMeta(value: string | null) {
  return MOODS.find(m => m.value === value) ?? null;
}

function MoodChip({ value, size = 'sm' }: { value: string | null; size?: 'sm' | 'md' }) {
  const m = moodMeta(value);
  if (!m) return null;
  const c = CHIP_COLORS[m.color];
  return (
    <span style={{
      padding: size === 'sm' ? '3px 12px' : '5px 16px',
      borderRadius: 50, fontSize: size === 'sm' ? 10 : 12,
      background: c.bg, color: c.text, border: `1px solid ${c.bd}`,
      display: 'inline-block', whiteSpace: 'nowrap',
      fontFamily: "'DM Sans',sans-serif", fontWeight: 400, letterSpacing: '.08em',
    }}>{m.label}</span>
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
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [loading, setLoading] = useState(true);

  // new note state
  const [composing, setComposing] = useState(false);
  const [newBody, setNewBody] = useState('');
  const [newMood, setNewMood] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editMood, setEditMood] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  // hover state for delete button
  const [hoverId, setHoverId] = useState<string | null>(null);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const ink4 = night ? 'rgba(120,100,160,.45)' : '#bbadd0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const inputBg = night ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.8)';

  useEffect(() => {
    fetch('/api/scraps')
      .then(r => r.json())
      .then(d => { setScraps(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (composing) textRef.current?.focus();
  }, [composing]);

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

  function startEdit(s: Scrap) {
    setEditId(s.id); setEditBody(s.body); setEditMood(s.mood);
  }

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
    <div style={{ padding: '32px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Scraps</div>
          <div style={{ fontSize: 12, color: ink3, fontWeight: 300, marginTop: 4 }}>Quick fragments, half-formed lines, ideas that aren't poems yet.</div>
        </div>
        {!composing && (
          <button onClick={() => setComposing(true)} style={{
            padding: '10px 22px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
            color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
          }}>+ Quick note</button>
        )}
      </div>

      {/* Compose box */}
      {composing && (
        <div style={{
          marginBottom: 28, borderRadius: 20,
          border: `1.5px solid rgba(160,100,220,.4)`,
          background: inputBg, backdropFilter: 'blur(20px)',
          padding: '20px 22px',
          boxShadow: '0 4px 24px rgba(124,58,237,.1)',
        }}>
          <textarea
            ref={textRef}
            value={newBody}
            onChange={e => setNewBody(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') { setComposing(false); setNewBody(''); setNewMood(null); } }}
            placeholder="A line, a phrase, a fleeting thought…"
            rows={3}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
              fontFamily: "'Playfair Display',serif", fontSize: 16, fontStyle: 'italic', fontWeight: 300,
              color: ink, lineHeight: 1.8, boxSizing: 'border-box',
            }}
          />
          {/* Mood picker */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, marginBottom: 14 }}>
            {MOODS.map(m => {
              const active = newMood === m.value;
              const c = CHIP_COLORS[m.color];
              return (
                <button key={m.value} onClick={() => setNewMood(active ? null : m.value)} style={{
                  padding: '3px 12px', borderRadius: 50, fontSize: 10,
                  background: active ? c.bg : 'transparent',
                  color: active ? c.text : ink3,
                  border: active ? `1px solid ${c.bd}` : `1px solid ${cardBd}`,
                  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 400,
                  transition: 'all .15s',
                }}>{m.label}</button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveNew} disabled={saving || !newBody.trim()} style={{
              padding: '8px 20px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
              color: '#fff', fontSize: 12, cursor: newBody.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'DM Sans',sans-serif", opacity: newBody.trim() ? 1 : .5,
            }}>{saving ? 'Saving…' : 'Save scrap'}</button>
            <button onClick={() => { setComposing(false); setNewBody(''); setNewMood(null); }} style={{
              padding: '8px 16px', borderRadius: 10, border: `1px solid ${cardBd}`,
              background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif",
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && scraps.length === 0 && !composing && (
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✍️</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: ink2, fontWeight: 300, marginBottom: 8 }}>No scraps yet</div>
          <div style={{ fontSize: 13, color: ink3, fontWeight: 300, marginBottom: 28 }}>Capture a line before it slips away.</div>
          <button onClick={() => setComposing(true)} style={{
            padding: '10px 24px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
            color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
          }}>Write your first scrap</button>
        </div>
      )}

      {loading && (
        <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
      )}

      {/* Masonry grid */}
      {!loading && scraps.length > 0 && (
        <div style={{ columnCount: 3, columnGap: 14 }}>
          {scraps.map(s => {
            const isEditing = editId === s.id;
            const m = moodMeta(s.mood);

            return (
              <div key={s.id}
                onMouseEnter={() => setHoverId(s.id)}
                onMouseLeave={() => setHoverId(null)}
                style={{
                  breakInside: 'avoid', marginBottom: 14, borderRadius: 18,
                  border: `1.5px solid ${isEditing ? 'rgba(160,100,220,.45)' : cardBd}`,
                  background: cardBg, backdropFilter: 'blur(18px)',
                  padding: '18px 20px',
                  transition: 'border-color .15s, box-shadow .15s',
                  boxShadow: hoverId === s.id && !isEditing ? '0 4px 20px rgba(124,58,237,.1)' : 'none',
                }}
              >
                {isEditing ? (
                  <>
                    <textarea
                      autoFocus value={editBody}
                      onChange={e => setEditBody(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Escape') setEditId(null); }}
                      rows={3}
                      style={{
                        width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none',
                        fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', fontWeight: 300,
                        color: ink, lineHeight: 1.8, boxSizing: 'border-box', marginBottom: 10,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                      {MOODS.map(mood => {
                        const active = editMood === mood.value;
                        const c = CHIP_COLORS[mood.color];
                        return (
                          <button key={mood.value} onClick={() => setEditMood(active ? null : mood.value)} style={{
                            padding: '2px 10px', borderRadius: 50, fontSize: 10,
                            background: active ? c.bg : 'transparent',
                            color: active ? c.text : ink3,
                            border: active ? `1px solid ${c.bd}` : `1px solid ${cardBd}`,
                            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                          }}>{mood.label}</button>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={saveEdit} disabled={editSaving} style={{
                        padding: '5px 14px', borderRadius: 8, border: 'none',
                        background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
                        color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                      }}>{editSaving ? 'Saving…' : 'Save'}</button>
                      <button onClick={() => setEditId(null)} style={{
                        padding: '5px 12px', borderRadius: 8, border: `1px solid ${cardBd}`,
                        background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer',
                        fontFamily: "'DM Sans',sans-serif",
                      }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => startEdit(s)}
                      style={{
                        fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic',
                        fontWeight: 300, color: ink, lineHeight: 1.8, marginBottom: 14, cursor: 'text',
                      }}
                    >"{s.body}"</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {m && <MoodChip value={s.mood} />}
                        <span style={{ fontSize: 10, color: ink4, fontWeight: 300 }}>{timeAgo(s.createdAt)}</span>
                      </div>
                      <button
                        onClick={() => deleteScrap(s.id)}
                        style={{
                          fontSize: 13, color: '#e05080', background: 'none', border: 'none',
                          cursor: 'pointer', padding: 0, opacity: hoverId === s.id ? .7 : 0,
                          transition: 'opacity .15s',
                        }}
                        title="Delete"
                      >✕</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
