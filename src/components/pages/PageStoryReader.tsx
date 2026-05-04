'use client';
import { useState } from 'react';

interface Props { night: boolean; }

const chapters = [
  { n: 1, title: 'The Lantern Hour', words: 1240 },
  { n: 2, title: 'Paper and Ink', words: 980 },
  { n: 3, title: 'Spirit Gate', words: 1560 },
];

const content = `The spirit realm opens at midnight, when the lanterns forget to shine.

She had always known this. Her grandmother told her in the language of smoke and chrysanthemums, in the way old women pass secrets — sideways, never directly, as if truth were too bright to look at straight.

Yuki pressed her palm against the old torii gate. The vermillion paint had faded to rose, then to rust, then to a colour she had no name for. The wood was cold. Everything here was cold, even in midsummer.

*If you are reading this, you have already crossed.*

She turned. The forest behind her was not the forest she had walked through. These trees had never known axes. Their roots reached down into something older than memory, older than the mountain, older than the name of rain.

A paper crane landed on her shoulder. It opened its beak and sang a single note — the kind of note that means *welcome home* in a language you've spoken only in dreams.`;

export function PageStoryReader({ night }: Props) {
  const [chapter, setChapter] = useState(1);
  const n = night;
  const ink  = n ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = n ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = n ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = n ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${cardBd}`, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14, paddingLeft: 8 }}>Chapters</div>
        {chapters.map(c => (
          <button key={c.n} onClick={() => setChapter(c.n)} style={{
            padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left',
            background: chapter === c.n ? 'rgba(124,58,237,.12)' : 'transparent',
            color: chapter === c.n ? '#c084fc' : ink2,
          }}>
            <div style={{ fontSize: 10, color: chapter === c.n ? '#c084fc' : ink3, marginBottom: 2 }}>Chapter {c.n}</div>
            <div style={{ fontSize: 12, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>{c.title}</div>
            <div style={{ fontSize: 10, color: ink3, marginTop: 2 }}>{c.words} words</div>
          </button>
        ))}
      </div>

      {/* Reader */}
      <div style={{ flex: 1, padding: '40px 80px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ fontSize: 10, color: ink3, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Chapter {chapter}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 300, color: ink, marginBottom: 32, lineHeight: 1.3 }}>
            {chapters[chapter - 1]?.title}
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 300, color: ink2, lineHeight: 2.1, whiteSpace: 'pre-line' }}>
            {content}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 24, borderTop: `1px solid ${cardBd}` }}>
            <button onClick={() => setChapter(Math.max(1, chapter - 1))} disabled={chapter === 1} style={{
              padding: '10px 24px', borderRadius: 50, border: `1px solid ${cardBd}`,
              background: 'transparent', color: chapter === 1 ? ink3 : ink2, cursor: chapter === 1 ? 'default' : 'pointer',
              fontSize: 12, fontFamily: "'DM Sans',sans-serif",
            }}>← Previous</button>
            <button onClick={() => setChapter(Math.min(chapters.length, chapter + 1))} disabled={chapter === chapters.length} style={{
              padding: '10px 24px', borderRadius: 50, border: 'none',
              background: chapter === chapters.length ? cardBd : 'linear-gradient(135deg,#c084fc,#7c3aed)',
              color: '#fff', cursor: chapter === chapters.length ? 'default' : 'pointer',
              fontSize: 12, fontFamily: "'DM Sans',sans-serif",
            }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
