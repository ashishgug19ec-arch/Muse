'use client';
import { Tilt } from '@/components/ui/Tilt';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Props { night: boolean; }

const recentPoems = [
  { title: 'Between two words', form: 'Haiku', date: 'Apr 12', likes: 48 },
  { title: 'Instructions for forgetting', form: 'Free verse', date: 'Mar 28', likes: 112 },
  { title: "Selenophile's Diary", form: 'Sonnet', date: 'Mar 15', likes: 89 },
];

const stats = [
  { label: 'Poems', value: '47' },
  { label: 'Readers', value: '1.2k' },
  { label: 'Collections', value: '5' },
  { label: 'Streak', value: '12d' },
];

export function PageAuthorProfile({ night }: Props) {
  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';
  const cardBg = night ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div style={{ borderRadius: 22, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(20px)', padding: '28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🌸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 400, color: ink, marginBottom: 4 }}>Luna Ashwood</div>
            <div style={{ fontSize: 12, color: ink3, marginBottom: 12 }}>Poet · Moon enthusiast · Writing since 2021</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.7, maxWidth: 420 }}>
              "I write to find the words for things that happen in the quiet hours."
            </div>
          </div>
          <button style={{ padding: '9px 22px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Follow</button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 300, color: ink }}>{s.value}</div>
              <div style={{ fontSize: 10, color: ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent poems */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Recent Poems</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentPoems.map(p => (
              <Tilt key={p.title} style={{ borderRadius: 18, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '16px 18px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Chip label={p.form} color="purple" />
                  <span style={{ fontSize: 10, color: ink3 }}>♡ {p.likes}</span>
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: ink, fontWeight: 400 }}>{p.title}</div>
                <div style={{ fontSize: 10, color: ink3, marginTop: 4 }}>{p.date}</div>
              </Tilt>
            ))}
          </div>
        </div>

        {/* Ikigai */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3, marginBottom: 14 }}>Ikigai</div>
          <div style={{ borderRadius: 18, border: `1.5px solid ${cardBd}`, background: cardBg, backdropFilter: 'blur(18px)', padding: '20px 22px' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontStyle: 'italic', color: ink2, lineHeight: 1.8, marginBottom: 16 }}>
              "Writing the feelings that words almost miss, for the women who have felt the same thing but could not say it."
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: ink3, marginBottom: 6 }}>
                <span>Alignment</span><span>92%</span>
              </div>
              <ProgressBar pct={92} color="purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
