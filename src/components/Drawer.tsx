'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MuseLogo } from './ui/MuseLogo';
import { useMuseStore } from '@/lib/store';

const PUBLIC_PAGES = new Set(['explore', 'fan fiction', 'story reader', 'pricing']);

const PAGES = [
  { section: 'Writing', items: [
    { icon: '✦', label: 'Dashboard', badge: '3' },
    { icon: '◎', label: 'Sanctuary', badge: null },
    { icon: '✐', label: 'New Poem', badge: null },
  ]},
  { section: 'My Garden', items: [
    { icon: '⊞', label: 'My Library', badge: '47' },
    { icon: '◈', label: 'Collections', badge: null },
    { icon: '✦', label: 'Scraps', badge: '12' },
    { icon: '◉', label: 'Ikigai Journal', badge: null },
  ]},
  { section: 'Discover', items: [
    { icon: '◎', label: 'Explore', badge: null },
    { icon: '⊞', label: 'Fan Fiction', badge: 'new' },
    { icon: '◎', label: 'Story Reader', badge: null },
    { icon: '✐', label: 'Story Upload', badge: null },
  ]},
  { section: 'Account', items: [
    { icon: '◉', label: 'Author Profile', badge: null },
    { icon: '◈', label: 'Notifications', badge: '5' },
    { icon: '⊟', label: 'Settings', badge: null },
    { icon: '✦', label: 'Pricing', badge: null },
  ]},
];

export function Drawer() {
  const { drawerOpen, night, setDrawerOpen, openPage } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const n = night;

  function handleNav(label: string) {
    setDrawerOpen(false);
    if (!isLoaded) return;
    const key = label.toLowerCase();
    if (!isSignedIn && !PUBLIC_PAGES.has(key)) {
      router.push('/sign-in');
      return;
    }
    openPage(label);
  }

  const overlayBg = n ? 'rgba(10,4,20,.6)' : 'rgba(60,30,80,.18)';
  const panelBg = n ? 'rgba(22,14,40,.96)' : 'rgba(250,247,255,.96)';
  const borderCol = n ? 'rgba(160,124,200,.22)' : 'rgba(208,191,240,.48)';
  const nameCol = n ? 'rgba(240,230,255,.9)' : '#1e1628';
  const taglineCol = n ? 'rgba(200,170,255,.5)' : '#bbadd0';
  const sectionCol = n ? 'rgba(200,170,255,.4)' : '#bbadd0';
  const labelCol = n ? 'rgba(230,220,255,.85)' : '#4a3960';
  const iconCol = n ? 'rgba(200,160,255,.7)' : '#8a7aa0';
  const hoverBg = n ? 'rgba(160,124,200,.15)' : 'rgba(208,191,240,.28)';

  return (
    <>
      {/* Overlay */}
      <div onClick={() => setDrawerOpen(false)} style={{
        position: 'fixed', inset: 0, zIndex: 199,
        background: drawerOpen ? overlayBg : 'transparent',
        backdropFilter: drawerOpen ? 'blur(3px)' : 'none',
        WebkitBackdropFilter: drawerOpen ? 'blur(3px)' : 'none',
        pointerEvents: drawerOpen ? 'all' : 'none',
        transition: 'background .35s, backdrop-filter .35s',
      }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
        width: 290,
        background: panelBg,
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        borderRight: `1px solid ${borderCol}`,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .38s cubic-bezier(.34,1.2,.64,1)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 24px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${borderCol}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MuseLogo />
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: nameCol, fontWeight: 400 }}>Muse</div>
              <div style={{ fontSize: 9, color: taglineCol, letterSpacing: '.12em', fontWeight: 300 }}>garden of poetry</div>
            </div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{
            width: 30, height: 30, borderRadius: '50%',
            border: `1px solid ${borderCol}`,
            background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.65)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: n ? 'rgba(200,170,255,.7)' : '#8a7aa0',
          }}>✕</button>
        </div>

        {/* User chip */}
        <div style={{
          margin: '14px 18px',
          padding: '12px 16px',
          borderRadius: 16,
          border: `1px solid ${n ? 'rgba(160,124,200,.22)' : 'rgba(208,191,240,.38)'}`,
          background: n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.58)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <defs><radialGradient id="dav"><stop stopColor="#f0a8c0"/><stop offset="1" stopColor="#c070a0"/></radialGradient></defs>
            <circle cx="19" cy="19" r="19" fill="url(#dav)"/>
            <circle cx="19" cy="15" r="7" fill="rgba(255,255,255,.55)"/>
            <ellipse cx="19" cy="30" rx="12" ry="7.5" fill="rgba(255,255,255,.42)"/>
          </svg>
          <div>
            <div style={{ fontSize: 13, color: nameCol, fontWeight: 400 }}>Sakura Writer</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 10, color: n ? 'rgba(200,170,255,.6)' : '#8a7aa0', fontWeight: 300 }}>Pro · Blossom</span>
              <span style={{ fontSize: 9, color: '#d06888', fontWeight: 400, background: 'rgba(240,168,192,.2)', padding: '1px 7px', borderRadius: 50, border: '1px solid rgba(240,168,192,.35)' }}>🔥 12 days</span>
            </div>
          </div>
        </div>

        {/* Nav sections */}
        <div style={{ flex: 1, padding: '0 12px' }}>
          {PAGES.map(section => (
            <div key={section.section} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9, fontWeight: 400, letterSpacing: '.1em', textTransform: 'uppercase', color: sectionCol, padding: '0 8px', marginBottom: 4 }}>{section.section}</div>
              {section.items.map(item => (
                <button key={item.label} onClick={() => handleNav(item.label)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 12,
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  textAlign: 'left', marginBottom: 2,
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 12, color: iconCol, width: 18 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, color: labelCol, fontWeight: 300 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: 9,
                      background: item.badge === 'new' ? 'rgba(124,58,237,.2)' : 'rgba(208,191,240,.42)',
                      color: item.badge === 'new' ? '#7c3aed' : '#5b21b6',
                      padding: '2px 7px', borderRadius: 50,
                      border: '1px solid rgba(208,191,240,.5)', fontWeight: 400,
                    }}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 18px 24px',
          borderTop: `1px solid ${borderCol}`,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <button onClick={() => handleNav('Sanctuary')} style={{
            padding: '12px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)', color: '#fff',
            fontSize: 13, fontWeight: 400, cursor: 'pointer',
            fontFamily: "'Playfair Display',serif", letterSpacing: '.05em',
            boxShadow: '0 6px 24px rgba(124,58,237,.32)',
          }}>Open Sanctuary</button>
          <button onClick={() => handleNav('New Poem')} style={{
            padding: '12px', borderRadius: 50,
            border: `1.5px solid rgba(208,191,240,.52)`,
            background: n ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.65)',
            color: '#c084fc', fontSize: 13, fontWeight: 400, cursor: 'pointer',
            fontFamily: "'DM Sans',sans-serif", letterSpacing: '.02em',
          }}>+ New Poem</button>
        </div>
      </div>
    </>
  );
}
