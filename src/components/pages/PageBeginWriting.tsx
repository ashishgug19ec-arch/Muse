'use client';
import { useMuseStore } from '@/lib/store';

interface Props { night: boolean; }

export function PageBeginWriting({ night }: Props) {
  const { openPage } = useMuseStore();

  const ink  = night ? 'rgba(230,220,255,.9)'  : '#1e1628';
  const ink2 = night ? 'rgba(200,180,255,.7)'  : '#4a3960';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const cardBd = night ? 'rgba(160,124,200,.2)'  : 'rgba(208,191,240,.52)';

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 40px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#c084fc', marginBottom: 14, opacity: .85 }}>
        Begin writing
      </div>
      <h2 style={{
        fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 300,
        color: ink, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: 12,
      }}>
        What would you like to write?
      </h2>
      <p style={{ fontSize: 14, color: ink3, fontWeight: 300, marginBottom: 56, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>
        Choose your sanctuary for today.
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 720 }}>

        {/* Poem */}
        <button
          onClick={() => openPage('sanctuary')}
          style={{
            flex: 1, minWidth: 280, maxWidth: 340,
            padding: '48px 36px', borderRadius: 28, cursor: 'pointer',
            border: `1.5px solid ${cardBd}`,
            background: night
              ? 'linear-gradient(160deg,rgba(208,191,240,.1),rgba(252,228,240,.06))'
              : 'linear-gradient(160deg,rgba(238,230,255,.9),rgba(252,228,240,.8))',
            backdropFilter: 'blur(20px)',
            textAlign: 'left', transition: 'transform .2s, box-shadow .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(124,58,237,.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ fontSize: 44, marginBottom: 20 }}>✍️</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 400, color: ink, marginBottom: 10 }}>Poem</div>
          <div style={{ fontSize: 13, color: ink2, fontWeight: 300, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 28 }}>
            A distraction-free sanctuary where your words bloom in silence.
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 20px', borderRadius: 50,
            background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
            color: '#fff', fontSize: 12, fontFamily: "'DM Sans',sans-serif",
          }}>Write a poem →</div>
        </button>

        {/* Fan Fiction */}
        <button
          onClick={() => openPage('fan fiction')}
          style={{
            flex: 1, minWidth: 280, maxWidth: 340,
            padding: '48px 36px', borderRadius: 28, cursor: 'pointer',
            border: `1.5px solid ${night ? 'rgba(160,124,200,.3)' : 'rgba(160,124,200,.25)'}`,
            background: night
              ? 'linear-gradient(160deg,#1a1130,#2c1825)'
              : 'linear-gradient(160deg,rgba(26,17,48,.92),rgba(44,24,37,.88))',
            backdropFilter: 'blur(20px)',
            textAlign: 'left', transition: 'transform .2s, box-shadow .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(124,58,237,.28)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ fontSize: 44, marginBottom: 20 }}>🌙</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 400, color: 'rgba(230,220,255,.9)', marginBottom: 10 }}>Fan Fiction</div>
          <div style={{ fontSize: 13, color: 'rgba(200,170,255,.65)', fontWeight: 300, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 28 }}>
            Poetic reimaginings of the worlds and characters you love.
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 20px', borderRadius: 50,
            background: 'rgba(192,132,252,.2)',
            border: '1px solid rgba(192,132,252,.4)',
            color: '#c084fc', fontSize: 12, fontFamily: "'DM Sans',sans-serif",
          }}>Write fan fiction →</div>
        </button>

      </div>
    </div>
  );
}
