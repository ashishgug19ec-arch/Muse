'use client';
import { useEffect, useRef, useState } from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Props { night: boolean; }

interface Entry {
  id: string;
  promptText: string;
  response: string;
  createdAt: string;
}

interface Journal {
  whatYouLove: string | null;
  goodAt: string | null;
  worldNeeds: string | null;
  canOffer: string | null;
  statement: string | null;
  score: number;
  entries: Entry[];
}

const PILLARS = [
  { key: 'whatYouLove', emoji: '❤️', label: 'What you love',        color: 'rgba(240,168,192,.35)', bd: 'rgba(240,168,192,.5)',  text: '#9d174d' },
  { key: 'goodAt',      emoji: '✦',  label: "What you're good at",  color: 'rgba(144,184,152,.28)', bd: 'rgba(144,184,152,.5)',  text: '#166534' },
  { key: 'worldNeeds',  emoji: '🌍', label: 'What the world needs', color: 'rgba(200,160,80,.22)',  bd: 'rgba(200,160,80,.45)',  text: '#7a5a10' },
  { key: 'canOffer',    emoji: '💜', label: 'What you can offer',   color: 'rgba(208,191,240,.35)', bd: 'rgba(208,191,240,.55)', text: '#5b21b6' },
] as const;

const PROMPTS = [
  "What did you create today that only you could have made?",
  "What word visited you today, uninvited?",
  "Where did beauty surprise you today?",
  "What feeling are you carrying that hasn't found its poem yet?",
  "What would you write if no one would ever read it?",
  "Describe today in three words, then write about the third one.",
  "What small thing mattered more than it should have?",
];

function todayPrompt() {
  const d = new Date();
  return PROMPTS[(d.getDate() + d.getMonth()) % PROMPTS.length];
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PageIkigai({ night }: Props) {
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);

  // pillar editing
  const [editPillar, setEditPillar] = useState<string | null>(null);
  const [pillarDraft, setPillarDraft] = useState('');
  const [pillarSaving, setPillarSaving] = useState(false);

  // statement editing
  const [editStatement, setEditStatement] = useState(false);
  const [statementDraft, setStatementDraft] = useState('');
  const [statementSaving, setStatementSaving] = useState(false);

  // today's reflection
  const prompt = todayPrompt();
  const [reflection, setReflection] = useState('');
  const [reflSaving, setReflSaving] = useState(false);
  const reflRef = useRef<HTMLTextAreaElement>(null);

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  useEffect(() => {
    fetch('/api/ikigai')
      .then(r => r.json())
      .then(d => { setJournal(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function savePillar(key: string, value: string) {
    setPillarSaving(true);
    try {
      const res = await fetch('/api/ikigai', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value.trim() || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setJournal(prev => prev ? { ...prev, ...updated } : prev);
        setEditPillar(null);
      }
    } finally { setPillarSaving(false); }
  }

  async function saveStatement() {
    setStatementSaving(true);
    try {
      const res = await fetch('/api/ikigai', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: statementDraft.trim() || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setJournal(prev => prev ? { ...prev, ...updated } : prev);
        setEditStatement(false);
      }
    } finally { setStatementSaving(false); }
  }

  async function saveReflection() {
    if (!reflection.trim()) return;
    setReflSaving(true);
    try {
      const res = await fetch('/api/ikigai/entries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText: prompt, response: reflection.trim() }),
      });
      if (res.ok) {
        const entry = await res.json();
        setJournal(prev => prev ? { ...prev, entries: [entry, ...prev.entries] } : prev);
        setReflection('');
      }
    } finally { setReflSaving(false); }
  }

  async function deleteEntry(id: string) {
    const res = await fetch(`/api/ikigai/entries/${id}`, { method: 'DELETE' });
    if (res.ok) setJournal(prev => prev ? { ...prev, entries: prev.entries.filter(e => e.id !== id) } : prev);
  }

  if (loading) return (
    <div style={{ padding: '32px 40px', fontSize: 13, color: '#8a7aa0', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading…</div>
  );

  const score = journal?.score ?? 0;

  return (
    <div style={{ padding: '24px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Ikigai Journal</div>
        <div style={{ fontSize: 12, color: ink3, marginTop: 4, fontWeight: 300 }}>
          {score}% aligned · {score < 25 ? 'just beginning' : score < 50 ? 'growing' : score < 75 ? 'blossoming' : 'in full bloom'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── Left Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Venn + Score */}
          <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="240" height="220" viewBox="0 0 240 220" fill="none">
              <circle cx="120" cy="80"  r="70" fill="rgba(208,191,240,.18)" stroke="rgba(208,191,240,.5)" strokeWidth="1.2"/>
              <circle cx="80"  cy="140" r="70" fill="rgba(240,168,192,.15)" stroke="rgba(240,168,192,.45)" strokeWidth="1.2"/>
              <circle cx="160" cy="140" r="70" fill="rgba(144,184,152,.15)" stroke="rgba(144,184,152,.45)" strokeWidth="1.2"/>
              <circle cx="120" cy="115" r="70" fill="rgba(200,160,80,.12)"  stroke="rgba(200,160,80,.4)"   strokeWidth="1.2"/>
              <circle cx="120" cy="118" r="22" fill="rgba(192,132,252,.28)" stroke="rgba(192,132,252,.6)"  strokeWidth="1.5"/>
              <text x="120" y="114" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill="#7c3aed" fontWeight="400" letterSpacing=".06em">ikigai</text>
              <text x="120" y="127" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="11" fill="#c084fc" fontStyle="italic">🌸</text>
              <text x="120" y="24"  textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what you love</text>
              <text x="22"  y="175" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what you&apos;re</text>
              <text x="22"  y="186" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>good at</text>
              <text x="218" y="175" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what the</text>
              <text x="218" y="186" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>world needs</text>
              <text x="120" y="210" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="9" fill={ink3}>what you can offer</text>
            </svg>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 300, color: ink, letterSpacing: '-.04em', marginBottom: 8 }}>{score}%</div>
            <ProgressBar pct={score} color="purple" />
            <div style={{ fontSize: 12, color: ink3, fontWeight: 300, marginTop: 8, fontStyle: 'italic', textAlign: 'center' }}>
              {score === 0 ? 'Fill in your four pillars to begin' : `You are ${score}% aligned with your ikigai 🌸`}
            </div>
          </div>

          {/* Today's reflection */}
          <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '20px 22px' }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 10 }}>Today&apos;s Reflection</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 14 }}>{prompt}</div>
            <textarea
              ref={reflRef}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Begin writing your reflection…"
              rows={4}
              style={{
                width: '100%', background: 'transparent',
                border: `1.5px solid ${cardBd}`, borderRadius: 12,
                padding: '12px 14px', fontFamily: "'Playfair Display',serif",
                fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: ink,
                lineHeight: 1.8, resize: 'none', outline: 'none', boxSizing: 'border-box',
                marginBottom: 10,
              }}
            />
            <button
              onClick={saveReflection}
              disabled={reflSaving || !reflection.trim()}
              style={{
                padding: '8px 20px', borderRadius: 10, border: 'none',
                background: reflection.trim() ? 'linear-gradient(135deg,#c084fc,#7c3aed)' : cardBd,
                color: reflection.trim() ? '#fff' : ink3,
                fontSize: 12, cursor: reflection.trim() ? 'pointer' : 'not-allowed',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >{reflSaving ? 'Saving…' : 'Save reflection'}</button>
          </div>

          {/* Ikigai statement */}
          <div style={{ borderRadius: 22, border: '1.5px solid rgba(192,132,252,.35)', background: night ? 'rgba(124,58,237,.1)' : 'linear-gradient(148deg,rgba(238,230,255,.9),rgba(252,228,240,.8))', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>Your Ikigai Statement</div>
              {!editStatement && (
                <button onClick={() => { setStatementDraft(journal?.statement ?? ''); setEditStatement(true); }} style={{ fontSize: 13, color: ink3, background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: .7 }} title="Edit">✎</button>
              )}
            </div>
            {editStatement ? (
              <>
                <textarea
                  autoFocus value={statementDraft}
                  onChange={e => setStatementDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') setEditStatement(false); }}
                  rows={4}
                  placeholder="I am a writer who…"
                  style={{ width: '100%', background: 'transparent', border: `1.5px solid rgba(192,132,252,.4)`, borderRadius: 10, padding: '10px 12px', fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', color: ink, lineHeight: 1.8, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveStatement} disabled={statementSaving} style={{ padding: '7px 18px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{statementSaving ? 'Saving…' : 'Save'}</button>
                  <button onClick={() => setEditStatement(false)} style={{ padding: '7px 14px', borderRadius: 9, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                </div>
              </>
            ) : (
              <div
                onClick={() => { setStatementDraft(journal?.statement ?? ''); setEditStatement(true); }}
                style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', color: '#7c3aed', lineHeight: 1.8, fontWeight: 300, cursor: 'text', minHeight: 40 }}
              >
                {journal?.statement
                  ? `"${journal.statement}"`
                  : <span style={{ color: ink3, fontSize: 13 }}>Click to write your ikigai statement…</span>
                }
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Four pillars */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 12 }}>Four Pillars</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PILLARS.map(p => {
                const value = journal?.[p.key] ?? null;
                const isEditing = editPillar === p.key;
                return (
                  <div key={p.key} style={{ borderRadius: 18, border: `1.5px solid ${isEditing ? p.bd : cardBd}`, background: isEditing ? p.color : cardBg, backdropFilter: 'blur(18px)', padding: '14px 16px', transition: 'all .15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isEditing || value ? 8 : 0 }}>
                      <span style={{ fontSize: 16 }}>{p.emoji}</span>
                      <span style={{ fontSize: 11, color: p.text, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, letterSpacing: '.06em' }}>{p.label.toUpperCase()}</span>
                      {!isEditing && (
                        <button
                          onClick={() => { setEditPillar(p.key); setPillarDraft(value ?? ''); }}
                          style={{ marginLeft: 'auto', fontSize: 13, color: ink3, background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: .6 }}
                          title="Edit"
                        >✎</button>
                      )}
                    </div>
                    {isEditing ? (
                      <>
                        <textarea
                          autoFocus value={pillarDraft}
                          onChange={e => setPillarDraft(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Escape') setEditPillar(null); }}
                          rows={2}
                          placeholder={`What ${p.label.toLowerCase()}…`}
                          style={{ width: '100%', background: 'transparent', border: `1px solid ${p.bd}`, borderRadius: 8, padding: '8px 10px', fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink, lineHeight: 1.7, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => savePillar(p.key, pillarDraft)} disabled={pillarSaving} style={{ padding: '5px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{pillarSaving ? '…' : 'Save'}</button>
                          <button onClick={() => setEditPillar(null)} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                        </div>
                      </>
                    ) : value ? (
                      <div
                        onClick={() => { setEditPillar(p.key); setPillarDraft(value); }}
                        style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.7, cursor: 'text' }}
                      >"{value}"</div>
                    ) : (
                      <div
                        onClick={() => { setEditPillar(p.key); setPillarDraft(''); }}
                        style={{ fontSize: 12, color: ink3, fontStyle: 'italic', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                      >Click to fill in…</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past reflections */}
          <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '20px 22px', flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Past Reflections</div>
            {!journal?.entries.length ? (
              <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Save your first reflection above.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {journal.entries.map((e, i) => (
                  <div key={e.id} style={{ padding: '12px 0', borderBottom: i < journal.entries.length - 1 ? `1px solid ${cardBd}` : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: ink3, fontWeight: 300, marginBottom: 3 }}>{timeLabel(e.createdAt)}</div>
                      <div style={{ fontSize: 11, color: ink3, fontStyle: 'italic', marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>{e.promptText}</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{e.response}</div>
                    </div>
                    <button
                      onClick={() => deleteEntry(e.id)}
                      style={{ fontSize: 12, color: '#e05080', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, opacity: .5 }}
                      title="Delete"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
