'use client';
import { MuseLogo } from './ui/MuseLogo';
import { useMuseStore } from '@/lib/store';

export function Nav() {
  const { night, toggleNight, setDrawerOpen, openPage } = useMuseStore();

  const navBg = night ? 'rgba(26,17,48,.88)' : 'rgba(250,247,255,.82)';
  const borderCol = night ? 'rgba(160,124,200,.18)' : 'rgba(160,124,200,.12)';
  const linkCol = night ? 'rgba(200,170,255,.7)' : '#8a7aa0';
  const nameCol = night ? 'rgba(240,230,255,.9)' : '#1e1628';
  const taglineCol = night ? 'rgba(200,170,255,.55)' : '#bbadd0';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 60px',
      background: navBg,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${borderCol}`,
      transition: 'background .4s, border-color .4s',
    }}>
      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => setDrawerOpen(true)} aria-label="Menu" style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid rgba(208,191,240,.52)',
          background: night ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.65)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          cursor: 'pointer', flexShrink: 0,
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 14, height: 1, background: night ? 'rgba(220,200,255,.7)' : '#4a3960' }} />
          ))}
        </button>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <MuseLogo />
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: nameCol, fontWeight: 400, letterSpacing: '-.02em' }}>Muse</div>
            <div style={{ fontSize: 10, color: taglineCol, letterSpacing: '.14em', fontWeight: 300, marginTop: 1 }}>garden of poetry</div>
          </div>
        </a>
      </div>

      {/* Center: links */}
      <div style={{ display: 'flex', gap: 32 }}>
        {['Discover', 'Sanctuary', 'Collections', 'Community'].map(l => (
          <button key={l} onClick={() => openPage(l)} style={{
            fontSize: 13, color: linkCol, background: 'none', border: 'none',
            fontWeight: 300, letterSpacing: '.02em', cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif", transition: 'color .2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c084fc')}
            onMouseLeave={e => (e.currentTarget.style.color = linkCol)}
          >{l}</button>
        ))}
      </div>

      {/* Right: night toggle + auth */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* Night mode moon */}
        <button onClick={toggleNight} title="Toggle night mode" style={{
          width: 36, height: 36, borderRadius: '50%',
          border: `1px solid ${night ? 'rgba(160,124,200,.45)' : 'rgba(208,191,240,.52)'}`,
          background: night ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.65)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, transition: 'all .2s',
        }}>
          {night ? '☀️' : '🌙'}
        </button>
        <button style={{
          padding: '9px 24px', borderRadius: 50,
          border: `1.5px solid ${night ? 'rgba(160,124,200,.45)' : '#d0bff0'}`,
          background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.7)',
          color: '#c084fc', fontSize: 12, fontWeight: 400, cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif", letterSpacing: '.03em', transition: 'all .2s',
        }}>Sign in</button>
        <button onClick={() => openPage('Sanctuary')} style={{
          padding: '9px 24px', borderRadius: 50, border: 'none',
          background: 'linear-gradient(135deg,#a07cc8,#7c3aed)', color: '#fff',
          fontSize: 12, fontWeight: 400, cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif", letterSpacing: '.03em',
          boxShadow: '0 4px 20px rgba(124,58,237,.28)', transition: 'all .2s',
        }}>Begin writing</button>
      </div>
    </nav>
  );
}
