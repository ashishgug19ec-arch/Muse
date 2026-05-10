'use client';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseStore } from '@/lib/store';

const GROUPS = [
  { h: 'WRITE', auth: true, items: [
    { label: 'Begin writing',   ic: '✎', page: 'write'          },
  ]},
  { h: 'READ', auth: false, items: [
    { label: 'Dashboard',       ic: '⊞', page: 'dashboard',      auth: true  },
    { label: 'Discover',        ic: '✣', page: 'explore',        auth: false },
    { label: 'Poems',           ic: '◦', page: 'poems',          auth: true  },
    { label: 'Fan fiction',     ic: '✦', page: 'fan fiction',    auth: true  },
    { label: 'Ikigai journal',  ic: '◉', page: 'ikigai',         auth: true  },
    { label: 'Scraps',          ic: '✂', page: 'scraps',         auth: true  },
    { label: 'Collections',     ic: '▥', page: 'collections',    auth: true  },
  ]},
  { h: 'ACCOUNT', auth: true, items: [
    { label: 'My profile',      ic: '→', page: 'profile'         },
    { label: 'Notifications',   ic: '◷', page: 'notifications'   },
    { label: 'Settings',        ic: '⚙', page: 'settings'        },
  ]},
];

export function Drawer() {
  const { drawerOpen, night, setDrawerOpen, setSignInOpen, nickname } = useMuseStore();
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const n = night;

  const ink     = n ? '#f6eafd'                    : '#0c0612';
  const mono    = n ? '#b89ad8'                    : '#7a3a8a';
  const bd      = n ? 'rgba(184,154,216,.18)'      : 'rgba(122,58,138,.1)';
  const iconBg  = n ? 'rgba(184,154,216,.12)'      : 'rgba(122,58,138,.08)';
  const hoverBg = n ? 'rgba(184,154,216,.1)'       : 'rgba(122,58,138,.06)';

  const clerkName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ?? 'poet';
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const displayName = nickname ? cap(nickname) : clerkName;

  const PAGE_ROUTES: Record<string, string> = {
    write: '/write',
    'fan fiction': '/fan-fiction',
    ikigai: '/ikigai',
    scraps: '/scraps',
    explore: '/explore',
    poems: '/poems',
    collections: '/collections',
    profile: '/profile',
    notifications: '/notifications',
    settings: '/settings',
    dashboard: '/dashboard',
  };

  function handleNav(page: string) {
    setDrawerOpen(false);
    const route = PAGE_ROUTES[page];
    if (route) router.push(route);
  }

  const visibleGroups = isLoaded && isSignedIn ? GROUPS : [];

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            style={{
              position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 201,
              width: 'min(420px, 90vw)',
              background: n ? 'rgba(8,4,15,.86)' : 'rgba(255,255,255,.86)',
              backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              borderRight: `1px solid ${bd}`,
              padding: '32px 28px',
              display: 'flex', flexDirection: 'column', gap: 24,
              overflowY: 'auto', color: ink,
            }}>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="4.5" fill="#7a3a8a" />
                  <g transform="translate(18,18)">
                    {[0, 72, 144, 216, 288].map((a, i) => (
                      <ellipse key={a} rx="5.5" ry="9.5"
                        fill={i < 2 ? 'rgba(248,200,224,.95)' : 'rgba(232,212,248,.92)'}
                        stroke="rgba(160,124,200,.55)" strokeWidth=".7"
                        transform={`rotate(${a}) translate(0,-9)`} />
                    ))}
                  </g>
                </svg>
                <div style={{ lineHeight: 1.05 }}>
                  <div className="serif" style={{ fontSize: 20, fontWeight: 400, letterSpacing: '-.02em', color: ink }}>Muse</div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '.18em', opacity: .55, marginTop: 2, textTransform: 'uppercase', color: mono }}>garden of poetry</div>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'transparent', border: `1px solid ${bd}`, cursor: 'pointer', fontSize: 14, color: ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>

            {/* Welcome heading */}
            <div className="serif" style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-.025em', lineHeight: 1.1, fontStyle: 'italic', color: ink }}>
              {isLoaded && isSignedIn ? (
                <>Welcome back,<br />
                  <span style={{ background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>
                    {displayName}.
                  </span>
                </>
              ) : (
                <>Your garden<br />
                  <span style={{ background: 'linear-gradient(90deg,#7a3a8a 0%,#e89aae 25%,#b89ad8 50%,#e89aae 75%,#7a3a8a 100%)', backgroundSize: '200% 100%', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', animation: 'shimmer 8s linear infinite' }}>
                    awaits.
                  </span>
                </>
              )}
            </div>

            {/* Sign-in prompt for guests */}
            {isLoaded && !isSignedIn && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setDrawerOpen(false); setSignInOpen(true); }}
                  style={{ flex: 1, padding: '11px', borderRadius: 50, border: `1px solid ${bd}`, background: 'transparent', color: ink, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  Sign in
                </button>
                <button onClick={() => { setDrawerOpen(false); router.push('/sign-up'); }}
                  style={{ flex: 1, padding: '11px', borderRadius: 50, border: 'none', background: '#0c0612', color: '#f7f3ff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                  Begin writing
                </button>
              </div>
            )}

            {/* Nav groups — filtered by auth */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
              {visibleGroups.map(grp => (
                <div key={grp.h} style={{ marginTop: 18 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '.24em', opacity: .5, marginBottom: 8, color: mono }}>{grp.h}</div>
                  {grp.items.map((item: any) => (
                    <button key={item.label} onClick={() => handleNav(item.page)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', transition: 'background .2s', color: 'inherit', fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: iconBg, fontSize: 13, color: n ? '#e89aae' : '#7a3a8a', flexShrink: 0 }}>
                        {item.ic}
                      </span>
                      <span className="serif" style={{ fontSize: 16, fontWeight: 300, color: ink }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom: night toggle + sign-out (auth) + CTA */}
            <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: `1px solid ${bd}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => useMuseStore.getState().toggleNight()}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', transition: 'background .2s', color: 'inherit', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: iconBg, fontSize: 13, color: n ? '#e89aae' : '#7a3a8a' }}>
                  {n
  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b89ad8" strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a3a8a" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
}
                </span>
                <span className="serif" style={{ fontSize: 16, fontWeight: 300, color: ink }}>{n ? 'Night mode' : 'Day mode'}</span>
              </button>

              {isLoaded && isSignedIn && (
                <button
                  onClick={() => { setDrawerOpen(false); signOut(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', transition: 'background .2s', color: 'inherit', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: iconBg, fontSize: 13, color: n ? '#e89aae' : '#7a3a8a' }}>
                    ⎋
                  </span>
                  <span className="serif" style={{ fontSize: 16, fontWeight: 300, color: ink }}>Sign out</span>
                </button>
              )}

              {!isSignedIn && (
                <button onClick={() => { setDrawerOpen(false); router.push('/sign-up'); }}
                  style={{ padding: '14px 24px', borderRadius: 50, border: 'none', background: n ? '#f6eafd' : '#0c0612', color: n ? '#0c0612' : '#f7f3ff', fontSize: 13, fontWeight: 500, cursor: 'pointer', letterSpacing: '.04em', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 8px 28px rgba(12,6,18,.2)' }}>
                  Plant your first poem →
                </button>
              )}
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
