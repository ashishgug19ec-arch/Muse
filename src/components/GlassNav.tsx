'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { useMuseStore } from '@/lib/store';

const NAV_ROUTES: Record<string, string> = {
  'Dashboard':   '/dashboard',
  'Poems':       '/poems',
  'Fan Fiction': '/fan-fiction',
  'Collections': '/collections',
};

interface GlassNavProps {
  scrolled?: boolean;
  currentPage?: string;
  showBack?: boolean;
}

export function GlassNav({ scrolled = true, currentPage, showBack }: GlassNavProps) {
  const { night, toggleNight, setDrawerOpen, setSignInOpen } = useMuseStore();
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  const initials = user?.firstName
    ? (user.firstName[0] + (user.lastName?.[0] ?? '')).toUpperCase()
    : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '?';
  const txt = night ? 'rgba(246,234,253,.9)' : '#0c0612';

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [.16, 1, .3, 1] }}
      style={{
        position: 'fixed', top: 14, left: 14, right: 14, zIndex: 90,
        maxWidth: 1320, marginLeft: 'auto', marginRight: 'auto',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '10px 12px 10px 18px', borderRadius: 80, gap: 18,
        background: scrolled
          ? (night ? 'rgba(8,4,15,.65)' : 'rgba(255,255,255,.55)')
          : (night ? 'rgba(8,4,15,.18)' : 'rgba(255,255,255,.18)'),
        backdropFilter: `blur(${scrolled ? 28 : 14}px) saturate(160%)`,
        WebkitBackdropFilter: `blur(${scrolled ? 28 : 14}px) saturate(160%)`,
        border: `1px solid ${night
          ? (scrolled ? 'rgba(184,154,216,.22)' : 'rgba(184,154,216,.12)')
          : (scrolled ? 'rgba(255,255,255,.65)' : 'rgba(255,255,255,.3)')}`,
        boxShadow: scrolled
          ? (night
            ? '0 12px 40px rgba(0,0,0,.4),inset 0 1px 0 rgba(184,154,216,.15)'
            : '0 12px 40px rgba(120,80,180,.1),inset 0 1px 0 rgba(255,255,255,.7)')
          : 'none',
        color: txt,
        transition: 'background .35s,border-color .35s,box-shadow .35s',
      }}>

      {/* Left: back? + hamburger + logo + current page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack && (
          <button onClick={() => router.back()} aria-label="Back"
            style={{ width: 30, height: 30, borderRadius: '50%', background: 'transparent', border: `1px solid ${night ? 'rgba(184,154,216,.22)' : 'rgba(122,58,138,.18)'}`, cursor: 'pointer', fontSize: 14, color: night ? 'rgba(220,200,255,.8)' : '#7a3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            ←
          </button>
        )}
        <button onClick={() => setDrawerOpen(true)} aria-label="Menu"
          style={{ width: 34, height: 34, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, background: 'transparent', padding: 0, border: 'none', cursor: 'pointer' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 16, height: 1.4, background: night ? 'rgba(220,200,255,.85)' : '#2a1a3a', borderRadius: 2 }} />
          ))}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="4.5" fill="#7a3a8a" />
            <g transform="translate(18,18)">
              {[0, 72, 144, 216, 288].map((a, i) => (
                <ellipse key={a} rx="5.5" ry="9.5"
                  fill={i < 2 ? 'rgba(248,200,224,.95)' : 'rgba(232,212,248,.92)'}
                  stroke={i < 2 ? 'rgba(208,100,136,.55)' : 'rgba(160,124,200,.55)'} strokeWidth=".7"
                  transform={`rotate(${a}) translate(0,-9)`} />
              ))}
            </g>
          </svg>
          <div style={{ lineHeight: 1.05 }}>
            <div className="serif" style={{ fontSize: 18, fontWeight: 400, letterSpacing: '-.02em', color: txt }}>Muse</div>
            <div style={{ fontSize: 8, letterSpacing: '.18em', color: night ? '#b89ad8' : '#7a6a8a', marginTop: 2, fontWeight: 400, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>garden of poetry</div>
          </div>
        </div>
        {currentPage && (
          <>
            <div style={{ width: 1, height: 18, background: night ? 'rgba(184,154,216,.3)' : 'rgba(122,58,138,.2)', flexShrink: 0 }} />
            <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: night ? 'rgba(200,170,255,.6)' : '#8a7aa0', whiteSpace: 'nowrap' }}>
              {currentPage}
            </span>
          </>
        )}
      </div>

      {/* Center: nav links */}
      <div style={{ display: 'flex', gap: 28, justifyContent: 'center' }}>
        {['Dashboard', 'Poems', 'Fan Fiction', 'Collections'].map(l => (
          <button key={l} onClick={() => isSignedIn ? router.push(NAV_ROUTES[l]) : setSignInOpen(true)}
            style={{ fontSize: 12.5, fontWeight: 400, letterSpacing: '.01em', opacity: .82, background: 'none', border: 'none', cursor: 'pointer', color: txt, whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", transition: 'opacity .25s,color .25s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = night ? '#e89aae' : '#7a3a8a'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '.82'; e.currentTarget.style.color = 'inherit'; }}
          >{l}</button>
        ))}
      </div>

      {/* Right: night toggle + auth */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
        <button onClick={toggleNight} title="Toggle theme"
          style={{ width: 34, height: 34, borderRadius: '50%', background: night ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.5)', border: `1px solid ${night ? 'rgba(184,154,216,.25)' : 'rgba(122,58,138,.18)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer' }}>
          {night
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b89ad8" strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7a3a8a" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          }
        </button>
        {isLoaded && isSignedIn ? (
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
            onClick={() => router.push('/profile')}
            title="My profile"
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: user?.imageUrl ? 'transparent' : 'linear-gradient(135deg,#7a3a8a,#e89aae)',
              border: `2px solid ${night ? 'rgba(184,154,216,.4)' : 'rgba(122,58,138,.3)'}`,
              cursor: 'pointer', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(122,58,138,.25)',
              padding: 0,
            }}>
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: '.02em', fontFamily: "'DM Sans', sans-serif" }}>{initials}</span>
            }
          </motion.button>
        ) : isLoaded ? (
          <>
            <button onClick={() => setSignInOpen(true)}
              style={{ padding: '8px 18px', borderRadius: 50, fontSize: 12, fontWeight: 400, background: 'transparent', color: txt, border: `1px solid ${night ? 'rgba(184,154,216,.25)' : 'rgba(122,58,138,.18)'}`, whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Sign in
            </button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
              onClick={() => setSignInOpen(true)}
              style={{ padding: '9px 18px', borderRadius: 50, fontSize: 12, fontWeight: 500, letterSpacing: '.02em', background: '#0c0612', color: '#f7f3ff', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', boxShadow: '0 6px 20px rgba(12,6,18,.25)', fontFamily: "'DM Sans', sans-serif" }}>
              Begin writing
            </motion.button>
          </>
        ) : null}
      </div>
    </motion.nav>
  );
}
