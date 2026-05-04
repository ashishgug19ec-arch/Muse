'use client';
import { Tilt } from '@/components/ui/Tilt';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

const stats = [
  { label: 'Poems', val: '47', color: '#c084fc' },
  { label: 'Streak', val: '12d', color: '#f0a8c0' },
  { label: 'Collections', val: '8', color: '#90b898' },
  { label: 'Readers', val: '1.2k', color: '#c8a050' },
];
const recent = ['Between two words', "Autumn's last breath", 'Instructions for forgetting'];

export function PageDashboard({ night }: Props) {
  const { openPage: onNav } = useMuseStore();
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 8 }}>Dashboard</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 300, color: ink, letterSpacing: '-.03em' }}>
          Good evening, <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#c084fc,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sakura</em>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {stats.map(s => (
          <Tilt key={s.label} style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '20px 22px' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 300, color: ink, letterSpacing: '-.04em', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: ink3, fontWeight: 300, marginTop: 6, letterSpacing: '.06em' }}>{s.label}</div>
            <div style={{ height: 3, borderRadius: 50, background: `linear-gradient(90deg,${s.color},transparent)`, marginTop: 10, opacity: .6 }} />
          </Tilt>
        ))}
      </div>

      {/* Daily prompt + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14 }}>
        <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: night ? 'rgba(208,100,136,.1)' : 'linear-gradient(148deg,rgba(252,228,240,.9),rgba(238,230,255,.75))', padding: '24px 26px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#d06888', marginBottom: 10 }}>Daily Prompt</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: 'italic', fontWeight: 300, color: ink2, lineHeight: 1.8 }}>Write about the space<br/>between heartbeats</div>
          <button onClick={() => onNav('Sanctuary')} style={{ marginTop: 18, padding: '10px 24px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', letterSpacing: '.04em' }}>Begin writing</button>
        </div>
        <div style={{ borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '24px 26px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Recent Poems</div>
          {recent.map((t, i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < 2 ? `1px solid ${cardBd}` : 'none' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c084fc', opacity: .6, flexShrink: 0 }} />
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: ink2, flex: 1 }}>{t}</div>
              <div style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>Apr {12 + i}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Week activity */}
      <div style={{ marginTop: 14, borderRadius: 20, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '22px 26px' }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 16 }}>This Week</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: [28,44,36,52,60,20,48][i], borderRadius: 6, background: [false,true,true,true,true,false,true][i] ? 'linear-gradient(180deg,#c084fc,#7c3aed)' : (night ? 'rgba(255,255,255,.08)' : 'rgba(208,191,240,.28)') }} />
              <span style={{ fontSize: 10, color: ink3, fontWeight: 300 }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
