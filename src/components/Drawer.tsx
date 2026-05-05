'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MuseLogo } from './ui/MuseLogo';
import { useMuseStore } from '@/lib/store';

const PAGES = [
  { section: 'My Works', items: [
    { icon: '✦', label: 'Dashboard'      },
    { icon: '✐', label: 'Poems'          },
    { icon: '⊞', label: 'Fan Fiction'    },
    { icon: '◈', label: 'Collections'    },
    { icon: '✦', label: 'Scraps'         },
    // { icon: '◉', label: 'Ikigai Journal' },
  ]},
  { section: 'Account', items: [
    { icon: '◉', label: 'Profile'  },
    { icon: '⊟', label: 'Settings' },
  ]},
];

export function Drawer() {
  const { drawerOpen, night, setDrawerOpen, openPage } = useMuseStore();
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const n = night;

  function handleNav(label: string) {
    setDrawerOpen(false);
    openPage(label);
  }

  const overlayBg  = n ? 'rgba(10,4,20,.6)'        : 'rgba(60,30,80,.18)';
  const panelBg    = n ? 'rgba(22,14,40,.96)'       : 'rgba(250,247,255,.96)';
  const borderCol  = n ? 'rgba(160,124,200,.22)'    : 'rgba(208,191,240,.48)';
  const nameCol    = n ? 'rgba(240,230,255,.9)'     : '#1e1628';
  const taglineCol = n ? 'rgba(200,170,255,.5)'     : '#bbadd0';
  const sectionCol = n ? 'rgba(200,170,255,.4)'     : '#bbadd0';
  const labelCol   = n ? 'rgba(230,220,255,.85)'    : '#4a3960';
  const iconCol    = n ? 'rgba(200,160,255,.7)'     : '#8a7aa0';
  const hoverBg    = n ? 'rgba(160,124,200,.15)'    : 'rgba(208,191,240,.28)';

  return (
    <>
      <div onClick={() => setDrawerOpen(false)} style={{
        position: 'fixed', inset: 0, zIndex: 199,
        background: drawerOpen ? overlayBg : 'transparent',
        backdropFilter: drawerOpen ? 'blur(3px)' : 'none',
        WebkitBackdropFilter: drawerOpen ? 'blur(3px)' : 'none',
        pointerEvents: drawerOpen ? 'all' : 'none',
        transition: 'background .35s, backdrop-filter .35s',
      }} />

      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
        width: 260,
        background: panelBg,
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        borderRight: `1px solid ${borderCol}`,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .38s cubic-bezier(.34,1.2,.64,1)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${borderCol}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MuseLogo />
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: nameCol, fontWeight: 400 }}>Muse</div>
              <div style={{ fontSize: 9, color: taglineCol, letterSpacing: '.12em', fontWeight: 300 }}>garden of poetry</div>
            </div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{
            width: 30, height: 30, borderRadius: '50%', border: `1px solid ${borderCol}`,
            background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.65)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: n ? 'rgba(200,170,255,.7)' : '#8a7aa0',
          }}>✕</button>
        </div>

        {/* User chip */}
        {isLoaded && isSignedIn && (
          <div style={{ margin: '14px 18px', padding: '12px 16px', borderRadius: 16, border: `1px solid ${n ? 'rgba(160,124,200,.22)' : 'rgba(208,191,240,.38)'}`, background: n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.58)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#fff', fontWeight: 600 }}>
              {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '🌸'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: nameCol, fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : 'My garden'}
              </div>
              <div style={{ fontSize: 10, color: n ? 'rgba(200,170,255,.6)' : '#8a7aa0', fontWeight: 300, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.emailAddresses?.[0]?.emailAddress}
              </div>
            </div>
          </div>
        )}

        {/* Sign-in prompt */}
        {isLoaded && !isSignedIn && (
          <div style={{ margin: '14px 18px', padding: '14px 16px', borderRadius: 16, border: `1px solid ${n ? 'rgba(160,124,200,.22)' : 'rgba(208,191,240,.38)'}`, background: n ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.55)' }}>
            <div style={{ fontSize: 12, color: nameCol, fontWeight: 400, marginBottom: 4 }}>Not signed in</div>
            <div style={{ fontSize: 11, color: taglineCol, fontWeight: 300, marginBottom: 12 }}>Sign in to access your garden</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setDrawerOpen(false); router.push('/sign-in'); }} style={{ flex: 1, padding: '8px', borderRadius: 50, border: `1px solid ${borderCol}`, background: 'transparent', color: '#c084fc', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Sign in</button>
              <button onClick={() => { setDrawerOpen(false); router.push('/sign-up'); }} style={{ flex: 1, padding: '8px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Join Muse</button>
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ flex: 1, padding: '4px 12px 12px' }}>
          {(isSignedIn ? PAGES : []).map(section => (
            <div key={section.section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 400, letterSpacing: '.1em', textTransform: 'uppercase', color: sectionCol, padding: '0 8px', marginBottom: 4 }}>
                {section.section}
              </div>
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
                  <span style={{ fontSize: 13, color: labelCol, fontWeight: 300 }}>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 18px 24px', borderTop: `1px solid ${borderCol}` }}>
          {isSignedIn ? (
            <button onClick={() => { setDrawerOpen(false); openPage('write'); }} style={{
              width: '100%', padding: '12px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)', color: '#fff',
              fontSize: 13, cursor: 'pointer',
              fontFamily: "'Playfair Display',serif", letterSpacing: '.05em',
              boxShadow: '0 6px 24px rgba(124,58,237,.32)',
            }}>Begin writing</button>
          ) : (
            <button onClick={() => { setDrawerOpen(false); router.push('/sign-up'); }} style={{
              width: '100%', padding: '12px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)', color: '#fff',
              fontSize: 13, cursor: 'pointer',
              fontFamily: "'Playfair Display',serif", letterSpacing: '.05em',
              boxShadow: '0 6px 24px rgba(124,58,237,.32)',
            }}>Join Muse — it&apos;s free</button>
          )}
        </div>
      </div>
    </>
  );
}
