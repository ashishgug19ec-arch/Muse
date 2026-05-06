'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

interface Entry { id: string; promptText: string; response: string; createdAt: string; }
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
  { key: 'whatYouLove', emoji: '❤️', label: 'What you love',        color: 'rgba(240,168,192,.25)', bd: 'rgba(240,168,192,.5)',  text: '#d06888', grad: 'linear-gradient(135deg,#f472b6,#d06888)' },
  { key: 'goodAt',      emoji: '✦',  label: "What you're good at",  color: 'rgba(144,200,168,.2)',  bd: 'rgba(144,200,168,.5)',  text: '#5e9975', grad: 'linear-gradient(135deg,#90c8a8,#5e9975)' },
  { key: 'worldNeeds',  emoji: '🌍', label: 'What the world needs', color: 'rgba(248,216,144,.2)',  bd: 'rgba(248,216,144,.5)',  text: '#c8a050', grad: 'linear-gradient(135deg,#f8d890,#c8a050)' },
  { key: 'canOffer',    emoji: '💜', label: 'What you can offer',   color: 'rgba(192,132,252,.18)', bd: 'rgba(192,132,252,.5)', text: '#c084fc', grad: 'linear-gradient(135deg,#c084fc,#7c3aed)' },
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
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function PageIkigai({ night }: Props) {
  const [journal, setJournal]       = useState<Journal | null>(null);
  const [loading, setLoading]       = useState(true);
  const [editPillar, setEditPillar] = useState<string | null>(null);
  const [pillarDraft, setPillarDraft] = useState('');
  const [pillarSaving, setPillarSaving] = useState(false);
  const [editStatement, setEditStatement] = useState(false);
  const [statementDraft, setStatementDraft] = useState('');
  const [statementSaving, setStatementSaving] = useState(false);
  const [reflection, setReflection] = useState('');
  const [reflSaving, setReflSaving] = useState(false);
  const reflRef = useRef<HTMLTextAreaElement>(null);
  const { openSanctuary } = useMuseStore();
  const prompt = todayPrompt();

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

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
      if (res.ok) { const u = await res.json(); setJournal(prev => prev ? { ...prev, ...u } : prev); setEditPillar(null); }
    } finally { setPillarSaving(false); }
  }

  async function saveStatement() {
    setStatementSaving(true);
    try {
      const res = await fetch('/api/ikigai', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: statementDraft.trim() || null }),
      });
      if (res.ok) { const u = await res.json(); setJournal(prev => prev ? { ...prev, ...u } : prev); setEditStatement(false); }
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
    <div style={{ padding: '60px 40px', textAlign: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 12 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
      </motion.div>
      <div style={{ fontSize: 13, color: '#8a7aa0', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Loading your ikigai…</div>
    </div>
  );

  const score = journal?.score ?? 0;
  const blossomLabel = score < 25 ? 'just beginning' : score < 50 ? 'growing' : score < 75 ? 'blossoming' : 'in full bloom';

  return (
    <div style={{ padding: '36px 44px', maxWidth: 1040, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#c084fc' }}>My Garden</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em', lineHeight: 1.1 }}>
          Ikigai{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Journal</em>
        </h1>
        <p style={{ fontSize: 13, color: ink3, marginTop: 6, fontWeight: 300 }}>
          {score}% aligned · <span style={{ fontStyle: 'italic' }}>{blossomLabel}</span>
        </p>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={stagger} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── Left Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Venn diagram + score */}
          <motion.div variants={fadeUp} style={{ borderRadius: 24, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* ambient glow */}
            <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,.12),transparent 70%)', pointerEvents: 'none' }} />

            <svg width="240" height="224" viewBox="0 0 240 224" fill="none">
              {/* Four overlapping circles */}
              <circle cx="120" cy="78"  r="68" fill="rgba(208,191,240,.16)" stroke="rgba(208,191,240,.45)" strokeWidth="1.2"/>
              <circle cx="80"  cy="142" r="68" fill="rgba(240,168,192,.13)" stroke="rgba(240,168,192,.42)" strokeWidth="1.2"/>
              <circle cx="160" cy="142" r="68" fill="rgba(144,200,168,.13)" stroke="rgba(144,200,168,.42)" strokeWidth="1.2"/>
              <circle cx="120" cy="116" r="68" fill="rgba(248,216,144,.1)"  stroke="rgba(248,216,144,.38)"  strokeWidth="1.2"/>
              {/* Centre pulse */}
              <motion.circle
                cx="120" cy="116" r="22"
                fill="rgba(192,132,252,.25)"
                stroke="rgba(192,132,252,.6)"
                strokeWidth="1.5"
                animate={{ r: [22, 24, 22], opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <text x="120" y="112" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="8" fill="#7c3aed" fontWeight="500" letterSpacing=".06em">ikigai</text>
              <text x="120" y="126" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="12" fill="#c084fc" fontStyle="italic">🌸</text>
              {/* Labels */}
              <text x="120" y="22"  textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="8.5" fill={ink3}>what you love</text>
              <text x="18"  y="178" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="8.5" fill={ink3}>good at</text>
              <text x="222" y="178" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="8.5" fill={ink3}>world needs</text>
              <text x="120" y="218" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="8.5" fill={ink3}>can offer</text>
            </svg>

            <motion.div
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
              style={{ fontFamily: "'Playfair Display',serif", fontSize: 44, fontWeight: 300, color: ink, letterSpacing: '-.04em', lineHeight: 1, marginBottom: 12 }}
            >
              {score}<span style={{ fontSize: 22, color: ink3, marginLeft: 2 }}>%</span>
            </motion.div>
            <div style={{ width: '100%', maxWidth: 200 }}>
              <ProgressBar pct={score} color="purple" />
            </div>
            <div style={{ fontSize: 12, color: ink3, marginTop: 10, fontStyle: 'italic', textAlign: 'center', fontFamily: "'Playfair Display',serif" }}>
              {score === 0 ? 'Fill in your four pillars to begin' : `You are ${score}% aligned 🌸`}
            </div>
          </motion.div>

          {/* Today's reflection */}
          <motion.div variants={fadeUp} style={{ borderRadius: 24, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 16, height: 1, background: 'linear-gradient(90deg,#f8d890,transparent)' }} />
              <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#c8a050' }}>Today's Reflection</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', color: ink2, lineHeight: 1.85, marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: n ? 'rgba(248,216,144,.06)' : 'rgba(248,216,144,.12)', border: `1px solid rgba(248,216,144,.28)` }}>
              {prompt}
            </div>
            <textarea
              ref={reflRef}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Begin writing your reflection…"
              rows={4}
              style={{ width: '100%', background: 'transparent', border: `1.5px solid ${cardBd}`, borderRadius: 14, padding: '12px 16px', fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 300, fontStyle: 'italic', color: ink, lineHeight: 1.85, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
            />
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: .97 }}
              onClick={saveReflection}
              disabled={reflSaving || !reflection.trim()}
              style={{ padding: '9px 22px', borderRadius: 50, border: 'none', background: reflection.trim() ? 'linear-gradient(135deg,#f8d890,#c8a050)' : cardBd, color: reflection.trim() ? '#fff' : ink3, fontSize: 12, cursor: reflection.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans',sans-serif", boxShadow: reflection.trim() ? '0 4px 16px rgba(200,160,80,.25)' : 'none' }}
            >{reflSaving ? 'Saving…' : 'Save reflection'}</motion.button>
          </motion.div>

          {/* Ikigai statement */}
          <motion.div variants={fadeUp} style={{ borderRadius: 24, border: '1.5px solid rgba(192,132,252,.4)', background: n ? 'rgba(124,58,237,.1)' : 'linear-gradient(148deg,rgba(238,230,255,.92),rgba(252,228,240,.85))', padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
                <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#c084fc' }}>Your Ikigai Statement</span>
              </div>
              {!editStatement && (
                <button onClick={() => { setStatementDraft(journal?.statement ?? ''); setEditStatement(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ink3, opacity: .6, display: 'flex' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                </button>
              )}
            </div>
            {editStatement ? (
              <>
                <textarea
                  autoFocus value={statementDraft}
                  onChange={e => setStatementDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') setEditStatement(false); }}
                  rows={3}
                  placeholder="I am a writer who…"
                  style={{ width: '100%', background: 'transparent', border: '1.5px solid rgba(192,132,252,.45)', borderRadius: 12, padding: '10px 14px', fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', color: ink, lineHeight: 1.8, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button whileHover={{ scale: 1.03 }} onClick={saveStatement} disabled={statementSaving} style={{ padding: '8px 20px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{statementSaving ? 'Saving…' : 'Save'}</motion.button>
                  <button onClick={() => setEditStatement(false)} style={{ padding: '8px 16px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                </div>
              </>
            ) : (
              <div
                onClick={() => { setStatementDraft(journal?.statement ?? ''); setEditStatement(true); }}
                style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', color: '#7c3aed', lineHeight: 1.85, fontWeight: 300, cursor: 'text', minHeight: 48 }}
              >
                {journal?.statement
                  ? `"${journal.statement}"`
                  : <span style={{ color: ink3, fontSize: 13 }}>Click to write your ikigai statement…</span>
                }
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Right Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Four pillars */}
          <motion.div variants={fadeUp}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 16, height: 1, background: 'linear-gradient(90deg,#c084fc,transparent)' }} />
              <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3 }}>Four Pillars</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PILLARS.map(p => {
                const value = journal?.[p.key] ?? null;
                const isEditing = editPillar === p.key;
                return (
                  <motion.div
                    key={p.key}
                    layout
                    style={{ borderRadius: 20, border: `1.5px solid ${isEditing ? p.bd : cardBd}`, background: isEditing ? p.color : cardBg, backdropFilter: 'blur(18px)', padding: '14px 18px', transition: 'background .2s, border-color .2s', position: 'relative', overflow: 'hidden' }}
                  >
                    {isEditing && <div style={{ position: 'absolute', top: -16, right: -16, width: 64, height: 64, borderRadius: '50%', background: `radial-gradient(circle,${p.text}30,transparent 70%)` }} />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: (isEditing || value) ? 10 : 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: p.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{p.emoji}</div>
                      <span style={{ fontSize: 10, color: p.text, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, letterSpacing: '.08em', flex: 1 }}>{p.label.toUpperCase()}</span>
                      {!isEditing && (
                        <button onClick={() => { setEditPillar(p.key); setPillarDraft(value ?? ''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ink3, opacity: .55, display: 'flex' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                        </button>
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div key="edit" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          <textarea
                            autoFocus value={pillarDraft}
                            onChange={e => setPillarDraft(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Escape') setEditPillar(null); }}
                            rows={2}
                            placeholder={`What ${p.label.toLowerCase()}…`}
                            style={{ width: '100%', background: 'transparent', border: `1.5px solid ${p.bd}`, borderRadius: 10, padding: '8px 12px', fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink, lineHeight: 1.7, resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
                          />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => savePillar(p.key, pillarDraft)} disabled={pillarSaving} style={{ padding: '5px 16px', borderRadius: 8, border: 'none', background: p.grad, color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{pillarSaving ? '…' : 'Save'}</button>
                            <button onClick={() => setEditPillar(null)} style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
                          </div>
                        </motion.div>
                      ) : value ? (
                        <motion.div key="value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setEditPillar(p.key); setPillarDraft(value); }} style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.7, cursor: 'text' }}>
                          "{value}"
                        </motion.div>
                      ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setEditPillar(p.key); setPillarDraft(''); }} style={{ fontSize: 12, color: ink3, fontStyle: 'italic', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                          Click to fill in…
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Past reflections */}
          <motion.div variants={fadeUp} style={{ borderRadius: 24, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 24px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 16, height: 1, background: 'linear-gradient(90deg,#90a8c0,transparent)' }} />
              <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3 }}>Past Reflections</span>
            </div>
            {!journal?.entries.length ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 28, marginBottom: 10, opacity: .4 }}>📝</div>
                <div style={{ fontSize: 13, color: ink3, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Save your first reflection above.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {journal.entries.map((e, i) => (
                  <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ padding: '14px 0', borderBottom: i < journal.entries.length - 1 ? `1px solid ${cardBd}` : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: ink3, fontWeight: 300, marginBottom: 3 }}>{timeLabel(e.createdAt)}</div>
                      <div style={{ fontSize: 10, color: ink3, fontStyle: 'italic', marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{e.promptText}</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{e.response}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => openSanctuary({ body: e.response })}
                        title="Turn into poem"
                        style={{ fontSize: 9, color: '#c084fc', background: 'rgba(192,132,252,.1)', border: '1px solid rgba(192,132,252,.28)', borderRadius: 6, cursor: 'pointer', padding: '3px 8px', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap', letterSpacing: '.06em' }}
                      >→ Poem</button>
                      <button
                        onClick={() => deleteEntry(e.id)}
                        style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(224,80,128,.25)', background: 'transparent', cursor: 'pointer', color: '#e05080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
                        title="Delete"
                      >×</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
