'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { MuseLogo } from './ui/MuseLogo';
import { useMuseStore } from '@/lib/store';

const PAGES = [
  { section: 'Write', items: [
    { icon: '✦', label: 'Begin Writing',  page: 'write',           emoji: '✍️' },
    { icon: '✐', label: 'Sanctuary',      page: 'sanctuary',       emoji: '🌸' },
    { icon: '⊞', label: 'Fan Fiction',    page: 'fan fiction',     emoji: '🌙' },
  ]},
  { section: 'My Works', items: [
    { icon: '◈', label: 'Poems',          page: 'poems',           emoji: '📜' },
    { icon: '◈', label: 'Collections',    page: 'collections',     emoji: '📚' },
    { icon: '✦', label: 'Scraps',         page: 'scraps',          emoji: '🌿' },
    { icon: '◉', label: 'Ikigai Journal', page: 'ikigai',          emoji: '🔮' },
  ]},
  { section: 'Discover', items: [
    { icon: '⊞', label: 'Explore',        page: 'explore',         emoji: '✨' },
  ]},
  { section: 'Account', items: [
    { icon: '◉', label: 'Profile',        page: 'profile',         emoji: '👤' },
    { icon: '⊟', label: 'Settings',       page: 'settings',        emoji: '⚙️' },
    { icon: '🔔', label: 'Notifications',  page: 'notifications',   emoji: '🔔' },
    { icon: '◈', label: 'Pricing',        page: 'pricing',         emoji: '🌺' },
  ]},
];

export function Drawer() {
  const { drawerOpen, night, activePage, setDrawerOpen, openPage } = useMuseStore();
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const n = night;

  function handleNav(page: string) {
    setDrawerOpen(false);
    openPage(page);
  }

  const overlayBg  = n ? 'rgba(10,4,20,.62)'       : 'rgba(60,30,80,.18)';
  const panelBg    = n ? 'rgba(20,12,36,.97)'       : 'rgba(252,249,255,.97)';
  const borderCol  = n ? 'rgba(160,124,200,.2)'     : 'rgba(208,191,240,.48)';
  const nameCol    = n ? 'rgba(240,230,255,.9)'     : '#1e1628';
  const taglineCol = n ? 'rgba(200,170,255,.5)'     : '#bbadd0';
  const sectionCol = n ? 'rgba(160,130,200,.4)'     : '#c4b5d8';
  const labelCol   = n ? 'rgba(230,220,255,.82)'    : '#4a3960';
  const iconCol    = n ? 'rgba(200,160,255,.6)'     : '#a090b8';
  const hoverBg    = n ? 'rgba(160,124,200,.12)'    : 'rgba(208,191,240,.22)';
  const activeBg   = n ? 'rgba(192,132,252,.14)'    : 'rgba(192,132,252,.1)';
  const activeBd   = n ? 'rgba(192,132,252,.3)'     : 'rgba(192,132,252,.35)';

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : 'My garden';
  const initials = user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '🌸';

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: drawerOpen ? overlayBg : 'transparent',
          backdropFilter: drawerOpen ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: drawerOpen ? 'blur(4px)' : 'none',
          pointerEvents: drawerOpen ? 'all' : 'none',
          transition: 'background .35s, backdrop-filter .35s',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
        width: 268,
        background: panelBg,
        backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
        borderRight: `1px solid ${borderCol}`,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .4s cubic-bezier(.34,1.2,.64,1)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
        boxShadow: drawerOpen ? '8px 0 40px rgba(124,58,237,.1)' : 'none',
      }}>

        {/* Header */}
        <div style={{ padding: '20px 22px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${borderCol}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MuseLogo />
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: nameCol, fontWeight: 400, letterSpacing: '-.01em' }}>Muse</div>
              <div style={{ fontSize: 9, color: taglineCol, letterSpacing: '.12em', fontWeight: 300 }}>garden of poetry</div>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ width: 30, height: 30, borderRadius: '50%', border: `1px solid ${borderCol}`, background: n ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: n ? 'rgba(200,170,255,.7)' : '#8a7aa0' }}
          >✕</button>
        </div>

        {/* User chip */}
        <AnimatePresence>
          {isLoaded && isSignedIn && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ margin: '12px 16px', padding: '12px 14px', borderRadius: 16, border: `1px solid ${n ? 'rgba(160,124,200,.2)' : 'rgba(208,191,240,.4)'}`, background: n ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.62)', display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}
              onClick={() => handleNav('profile')}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#c084fc,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#fff', fontWeight: 600, boxShadow: '0 2px 10px rgba(124,58,237,.3)' }}>
                {initials}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, color: nameCol, fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                <div style={{ fontSize: 10, color: n ? 'rgba(200,170,255,.55)' : '#8a7aa0', fontWeight: 300, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.emailAddresses?.[0]?.emailAddress}
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={iconCol} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign-in prompt */}
        {isLoaded && !isSignedIn && (
          <div style={{ margin: '12px 16px', padding: '14px 16px', borderRadius: 16, border: `1px solid ${n ? 'rgba(160,124,200,.2)' : 'rgba(208,191,240,.4)'}`, background: n ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.58)' }}>
            <div style={{ fontSize: 13, color: nameCol, fontWeight: 400, marginBottom: 4 }}>Not signed in</div>
            <div style={{ fontSize: 11, color: taglineCol, fontWeight: 300, marginBottom: 12 }}>Sign in to access your garden</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setDrawerOpen(false); router.push('/sign-in'); }} style={{ flex: 1, padding: '8px', borderRadius: 50, border: `1px solid ${borderCol}`, background: 'transparent', color: '#c084fc', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Sign in</button>
              <button onClick={() => { setDrawerOpen(false); router.push('/sign-up'); }} style={{ flex: 1, padding: '8px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#7c3aed)', color: '#fff', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Join Muse</button>
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={{ flex: 1, padding: '8px 10px 12px' }}>
          {(isSignedIn ? PAGES : []).map(section => (
            <div key={section.section} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: sectionCol, padding: '0 10px', marginBottom: 4 }}>
                {section.section}
              </div>
              {section.items.map(item => {
                const isActive = activePage?.toLowerCase() === item.page || activePage?.toLowerCase() === item.label.toLowerCase();
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.page)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 12,
                      border: isActive ? `1px solid ${activeBd}` : '1px solid transparent',
                      background: isActive ? activeBg : 'transparent',
                      cursor: 'pointer', textAlign: 'left', marginBottom: 1,
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 14, width: 22, textAlign: 'center', flexShrink: 0, opacity: .8 }}>{item.emoji}</span>
                    <span style={{ fontSize: 13, color: isActive ? '#c084fc' : labelCol, fontWeight: isActive ? 400 : 300, fontFamily: "'DM Sans',sans-serif" }}>{item.label}</span>
                    {isActive && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#c084fc', opacity: .7 }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Night toggle + Footer */}
        <div style={{ padding: '12px 16px 24px', borderTop: `1px solid ${borderCol}` }}>
          {/* Night mode */}
          <button
            onClick={() => useMuseStore.getState().toggleNight()}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: 12 }}
            onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 15, width: 22, textAlign: 'center' }}>{n ? '☀️' : '🌙'}</span>
            <span style={{ fontSize: 12, color: labelCol, fontWeight: 300, fontFamily: "'DM Sans',sans-serif" }}>{n ? 'Day mode' : 'Night mode'}</span>
          </button>

          {isSignedIn ? (
            <button
              onClick={() => { setDrawerOpen(false); openPage('write'); }}
              style={{ width: '100%', padding: '12px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'Playfair Display',serif", letterSpacing: '.05em', boxShadow: '0 6px 24px rgba(124,58,237,.32)' }}
            >Begin writing</button>
          ) : (
            <button
              onClick={() => { setDrawerOpen(false); router.push('/sign-up'); }}
              style={{ width: '100%', padding: '12px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#c084fc,#9b72cf,#7c3aed)', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'Playfair Display',serif", letterSpacing: '.05em', boxShadow: '0 6px 24px rgba(124,58,237,.32)' }}
            >Join Muse — it&apos;s free</button>
          )}
        </div>
      </div>
    </>
  );
}
