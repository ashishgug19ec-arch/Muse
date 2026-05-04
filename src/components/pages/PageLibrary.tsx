'use client';
import { useState } from 'react';
import { Tilt } from '@/components/ui/Tilt';

interface Props { night: boolean; }

const poems = [
  { title: 'Between two words', form: 'Haiku', date: 'Apr 12', preview: 'Between two words / silence blooms like peonies—' },
  { title: 'Instructions for forgetting', form: 'Free verse', date: 'Mar 28', preview: 'Forget the way his name / tasted like autumn rain—' },
  { title: "Selenophile's Diary", form: 'Sonnet', date: 'Mar 15', preview: 'Twelve months. Twelve full moons. Twelve letters—' },
  { title: "Autumn's last breath", form: 'Tanka', date: 'Feb 20', preview: 'Maple leaves surrender / to the quiet of the ground' },
  { title: 'Petals remember', form: 'Haiku', date: 'Feb 8', preview: 'Cherry blossoms fall / remembering every spring—' },
  { title: 'Snow on the mirror', form: 'Free verse', date: 'Jan 31', preview: 'Winter pressed her face against / the cold glass of—' },
];
const filters = ['All', 'Published', 'Drafts', 'Haiku', 'Sonnet'];

export function PageLibrary({ night }: Props) {
  const [active, setActive] = useState('All');
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>My Library</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {filters.map((f, i) => (
            <button key={f} onClick={() => setActive(f)} style={{
              padding: '6px 16px', borderRadius: 50, fontSize: 11, cursor: 'pointer', letterSpacing: '.03em',
              background: active === f ? 'rgba(124,58,237,.18)' : 'transparent',
              border: `1px solid ${active === f ? 'rgba(124,58,237,.35)' : cardBd}`,
              color: active === f ? '#c084fc' : ink3,
              fontFamily: "'DM Sans',sans-serif",
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ columnCount: 3, columnGap: 14 }}>
        {poems.map(p => (
          <Tilt key={p.title} style={{
            breakInside: 'avoid' as const, marginBottom: 14, borderRadius: 18,
            border: `1.5px solid ${cardBd}`, background: cardBg,
            backdropFilter: 'blur(20px)', padding: '20px 22px', cursor: 'pointer',
          }}>
            <span className="tag tag-purple">{p.form}</span>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, color: ink, marginTop: 10, marginBottom: 8, lineHeight: 1.3 }}>{p.title}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 1.8 }}>{p.preview}</div>
            <div style={{ fontSize: 10, color: ink3, fontWeight: 300, marginTop: 12 }}>{p.date}</div>
          </Tilt>
        ))}
      </div>
    </div>
  );
}
