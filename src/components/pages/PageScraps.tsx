'use client';
import { Tilt } from '@/components/ui/Tilt';
import { Chip } from '@/components/ui/Chip';

interface Props { night: boolean; }

const scraps = [
  { text: 'she keeps the moon in her left pocket for emergencies', mood: '🌙 Night', time: '2:14am', color: 'night' as const },
  { text: 'the thing about heartbreak is it always surprises you, even the third time', mood: '💔 Loss', time: '11:48pm', color: 'purple' as const },
  { text: 'dawn tastes like copper and unfinished sentences', mood: '🌅 Dawn', time: '5:32am', color: 'gold' as const },
  { text: 'i have been waiting for something i cannot name', mood: '🌙 Night', time: '1:07am', color: 'night' as const },
  { text: 'the forest does not apologise for its wildness', mood: '🌿 Nature', time: '3:45pm', color: 'sage' as const },
  { text: 'soft things are the bravest things', mood: '🌸 Spring', time: 'Apr 8', color: 'rose' as const },
  { text: "you cannot hold water and also hold everything else", mood: '💔 Loss', time: 'Mar 30', color: 'purple' as const },
  { text: 'there is a word in japanese for the way light falls through leaves — komorebi', mood: '🌿 Nature', time: 'Mar 22', color: 'sage' as const },
];

export function PageScraps({ night }: Props) {
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const ink4 = night ? 'rgba(120,100,160,.45)' : '#bbadd0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 6 }}>My Garden</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 300, color: ink }}>Scraps</div>
        </div>
        <button style={{ padding: '10px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>+ Quick note</button>
      </div>
      <div style={{ columnCount: 3, columnGap: 14 }}>
        {scraps.map((s, i) => (
          <Tilt key={i} style={{
            breakInside: 'avoid' as const, marginBottom: 14, borderRadius: 18,
            border: `1.5px solid ${cardBd}`, background: cardBg,
            backdropFilter: 'blur(18px)', padding: '18px 20px', cursor: 'pointer',
          }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontStyle: 'italic', fontWeight: 300, color: ink, lineHeight: 1.8, marginBottom: 14 }}>"{s.text}"</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Chip label={s.mood} color={s.color} />
              <span style={{ fontSize: 10, color: ink4, fontWeight: 300 }}>{s.time}</span>
            </div>
          </Tilt>
        ))}
      </div>
    </div>
  );
}
