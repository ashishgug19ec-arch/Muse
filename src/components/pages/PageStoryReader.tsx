'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { night: boolean; }

const chapters = [
  { n: 1, title: 'The Lantern Hour', words: 1240 },
  { n: 2, title: 'Paper and Ink', words: 980 },
  { n: 3, title: 'Spirit Gate', words: 1560 },
];

const storyMeta = {
  title: 'Where Lanterns Dream',
  author: 'Yuki M.',
  fandom: 'Original',
  status: 'ongoing',
};

const chapterContent: Record<number, string> = {
  1: `The spirit realm opens at midnight, when the lanterns forget to shine.

She had always known this. Her grandmother told her in the language of smoke and chrysanthemums, in the way old women pass secrets — sideways, never directly, as if truth were too bright to look at straight.

Yuki pressed her palm against the old torii gate. The vermillion paint had faded to rose, then to rust, then to a colour she had no name for. The wood was cold. Everything here was cold, even in midsummer.

*If you are reading this, you have already crossed.*

She turned. The forest behind her was not the forest she had walked through. These trees had never known axes. Their roots reached down into something older than memory, older than the mountain, older than the name of rain.

A paper crane landed on her shoulder. It opened its beak and sang a single note — the kind of note that means *welcome home* in a language you've spoken only in dreams.`,
  2: `Paper is patient. It holds every word without complaint, without asking why you've written this particular grief on a Tuesday, without wondering whether you meant any of it.

Yuki found the letters in a lacquered box, tied with cord the colour of old blood. She didn't untie them. She already knew what they said — she had written them herself, in another life, in a time that was not yet but would be.

This was the trouble with the spirit realm: it did not follow tenses. Everything happened at once, and nothing had happened yet, and the gap between those two states was where she lived now.`,
  3: `The gate at the mountain's heart was not a door. It was a question.

Yuki stood before it for what felt like a season. Around her, the spirit trees breathed in and out, their exhaled breath forming small clouds of moths that drifted upward and became stars.

She thought of her grandmother. Of the smoke-language, the chrysanthemum-language, the language of things that are already over and also just beginning. She thought of how the old woman had held both her hands and looked at her, not with sadness, but with recognition.

*You will go back,* her grandmother had said. *And you will carry all of it with you.*

The gate opened. Beyond it: morning.`,
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.34, 1.2, 0.64, 1] } },
};

export function PageStoryReader({ night }: Props) {
  const [chapter, setChapter] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);

  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';

  const progress = Math.round((chapter / chapters.length) * 100);
  const currentMeta = chapters[chapter - 1];

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>

      {/* Sidebar */}
      <div style={{
        width: 248, flexShrink: 0,
        borderRight: `1px solid ${cardBd}`,
        display: 'flex', flexDirection: 'column',
        background: n ? 'rgba(255,255,255,.02)' : 'rgba(248,244,255,.55)',
        backdropFilter: 'blur(20px)',
        overflowY: 'auto',
      }}>
        {/* Story info */}
        <div style={{ padding: '22px 18px 18px', borderBottom: `1px solid ${cardBd}` }}>
          {storyMeta.fandom && (
            <span style={{ fontSize: 9, padding: '2px 10px', borderRadius: 50, background: 'rgba(192,132,252,.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,.28)', display: 'inline-block', marginBottom: 10, letterSpacing: '.06em' }}>{storyMeta.fandom}</span>
          )}
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 400, color: ink, lineHeight: 1.4, marginBottom: 4 }}>{storyMeta.title}</div>
          <div style={{ fontSize: 11, color: ink3, marginBottom: 14 }}>by {storyMeta.author}</div>

          {/* Reading progress */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ height: 3, borderRadius: 2, background: n ? 'rgba(255,255,255,.08)' : 'rgba(196,181,253,.2)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#f472b6,#c084fc)' }}
              />
            </div>
            <div style={{ fontSize: 9, color: ink3, marginTop: 4, letterSpacing: '.06em' }}>{progress}% complete</div>
          </div>
        </div>

        {/* Chapter list */}
        <div style={{ padding: '14px 10px', flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: ink3, marginBottom: 10, paddingLeft: 8 }}>Chapters</div>
          {chapters.map(c => (
            <button
              key={c.n}
              onClick={() => setChapter(c.n)}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 12, border: 'none',
                cursor: 'pointer', textAlign: 'left', marginBottom: 2,
                background: chapter === c.n
                  ? (n ? 'rgba(244,114,182,.12)' : 'rgba(244,114,182,.1)')
                  : 'transparent',
                transition: 'background .15s',
              }}
              onMouseEnter={e => { if (chapter !== c.n) e.currentTarget.style.background = n ? 'rgba(160,124,200,.08)' : 'rgba(208,191,240,.2)'; }}
              onMouseLeave={e => { if (chapter !== c.n) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ fontSize: 9, color: chapter === c.n ? '#f472b6' : ink3, marginBottom: 2, letterSpacing: '.06em' }}>CH {c.n}</div>
              <div style={{ fontSize: 12, fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: chapter === c.n ? (n ? '#f9a8d4' : '#d06888') : ink2, lineHeight: 1.4 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: ink3, marginTop: 3 }}>{c.words.toLocaleString()} words</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main reader */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Reader toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 40px', borderBottom: `1px solid ${cardBd}`,
          background: n ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.6)',
          backdropFilter: 'blur(16px)', flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, color: ink3 }}>
            Chapter {chapter} of {chapters.length} · <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: ink2 }}>{currentMeta?.title}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
            <button
              onClick={() => setShowSettings(s => !s)}
              style={{ padding: '6px 14px', borderRadius: 50, border: `1px solid ${cardBd}`, background: 'transparent', color: ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Reading settings
            </button>

            {/* Settings popover */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, scale: .94, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: .94, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 50,
                    background: n ? 'rgba(18,10,36,.97)' : 'rgba(255,252,255,.98)',
                    border: `1px solid ${cardBd}`, borderRadius: 16,
                    padding: '18px 20px', backdropFilter: 'blur(30px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,.18)', minWidth: 220,
                  }}
                >
                  <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Font size</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => setFontSize(s => Math.max(13, s - 1))} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink2, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: 13, color: ink2, minWidth: 36, textAlign: 'center', fontFamily: "'DM Sans',sans-serif" }}>{fontSize}px</span>
                    <button onClick={() => setFontSize(s => Math.min(24, s + 1))} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${cardBd}`, background: 'transparent', color: ink2, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '52px 80px' }} onClick={() => setShowSettings(false)}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter}
                initial="hidden"
                animate="show"
                variants={fadeUp}
              >
                {/* Chapter header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 18, height: 1, background: 'linear-gradient(90deg,#f472b6,transparent)' }} />
                  <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#f472b6' }}>Chapter {chapter}</span>
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 28, fontWeight: 300,
                  color: ink, lineHeight: 1.3,
                  letterSpacing: '-.02em', marginBottom: 40,
                }}>{currentMeta?.title}</h2>

                {/* Body */}
                <div style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize, fontWeight: 300,
                  color: ink2, lineHeight: 2.1,
                  whiteSpace: 'pre-line',
                }}>
                  {chapterContent[chapter]}
                </div>

                {/* Bottom nav */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginTop: 64,
                  paddingTop: 28, borderTop: `1px solid ${cardBd}`,
                }}>
                  <motion.button
                    whileHover={{ scale: 1.03, x: -2 }} whileTap={{ scale: .97 }}
                    onClick={() => setChapter(c => Math.max(1, c - 1))}
                    disabled={chapter === 1}
                    style={{
                      padding: '10px 24px', borderRadius: 50,
                      border: `1px solid ${cardBd}`, background: 'transparent',
                      color: chapter === 1 ? ink3 : ink2,
                      cursor: chapter === 1 ? 'default' : 'pointer',
                      fontSize: 12, fontFamily: "'DM Sans',sans-serif",
                      opacity: chapter === 1 ? .4 : 1,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Previous
                  </motion.button>

                  <span style={{ fontSize: 11, color: ink3, fontFamily: "'DM Sans',sans-serif" }}>
                    {chapter} / {chapters.length}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.03, x: 2 }} whileTap={{ scale: .97 }}
                    onClick={() => setChapter(c => Math.min(chapters.length, c + 1))}
                    disabled={chapter === chapters.length}
                    style={{
                      padding: '10px 24px', borderRadius: 50, border: 'none',
                      background: chapter === chapters.length
                        ? (n ? 'rgba(255,255,255,.08)' : 'rgba(208,191,240,.3)')
                        : 'linear-gradient(135deg,#f472b6,#c084fc)',
                      color: chapter === chapters.length ? ink3 : '#fff',
                      cursor: chapter === chapters.length ? 'default' : 'pointer',
                      fontSize: 12, fontFamily: "'DM Sans',sans-serif",
                      boxShadow: chapter === chapters.length ? 'none' : '0 4px 16px rgba(244,114,182,.3)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    Next
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
