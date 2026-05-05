'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { MuseLogo } from './ui/MuseLogo';
import { useMuseStore } from '@/lib/store';

export function Nav() {
  const { night, toggleNight, setDrawerOpen, openPage } = useMuseStore();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navBg    = night ? 'rgba(26,17,48,.88)'         : 'rgba(250,247,255,.82)';
  const borderCol= night ? 'rgba(160,124,200,.18)'       : 'rgba(160,124,200,.12)';
  const linkCol  = night ? 'rgba(200,170,255,.7)'        : '#8a7aa0';
  const nameCol  = night ? 'rgba(240,230,255,.9)'        : '#1e1628';
  const taglineCol=night ? 'rgba(200,170,255,.55)'       : '#bbadd0';

  function handleBeginWriting() {
    if (!isLoaded) return;
    if (isSignedIn) {
      openPage('Sanctuary');
    } else {
      router.push('/sign-in');
    }
  }

  function handleSignIn() {
    router.push('/sign-in');
  }

  function handleSignOut() {
    signOut(() => router.push('/'));
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 60px 18px 44px',
      background: navBg,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${borderCol}`,
      transition: 'background .4s, border-color .4s',
    }}>
      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => setDrawerOpen(true)} aria-label="Menu" style={{
          width: 32, height: 32, borderRadius: 0,
          border: 'none', background: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 5,
          cursor: 'pointer', flexShrink: 0, padding: 0,
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 22, height: 2.5, background: night ? 'rgba(200,160,255,.5)' : 'rgba(138,112,160,.45)', borderRadius: 99 }} />
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
        {['Discover', 'Explore', 'Fan Fiction', 'Community'].map(l => (
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
        <button onClick={toggleNight} title="Toggle night mode" style={{
          width: 36, height: 36, borderRadius: '50%',
          border: `1px solid ${night ? 'rgba(160,124,200,.45)' : 'rgba(208,191,240,.52)'}`,
          background: night ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.65)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, transition: 'all .2s',
        }}>
          {night ? '☀️' : '🌙'}
        </button>

        {isLoaded && isSignedIn ? (
          /* Signed-in state */
          <>
            {/* Avatar + dropdown */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(v => !v)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px 6px 6px', borderRadius: 50,
                border: `1px solid ${night ? 'rgba(160,124,200,.35)' : '#d0bff0'}`,
                background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.7)',
                cursor: 'pointer', transition: 'all .2s',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#fff', fontWeight: 600, flexShrink: 0,
                }}>
                  {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '🌸'}
                </div>
                <span style={{ fontSize: 12, color: nameCol, fontWeight: 300, fontFamily: "'DM Sans',sans-serif" }}>
                  {user?.firstName ?? 'My garden'}
                </span>
                <span style={{ fontSize: 10, color: night ? 'rgba(200,170,255,.5)' : '#bbadd0' }}>▾</span>
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 299 }} />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 300,
                    minWidth: 180, borderRadius: 16,
                    background: night ? 'rgba(22,14,40,.98)' : 'rgba(252,250,255,.98)',
                    border: `1px solid ${night ? 'rgba(160,124,200,.25)' : 'rgba(208,191,240,.6)'}`,
                    backdropFilter: 'blur(20px)', boxShadow: '0 16px 40px rgba(124,58,237,.15)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${night ? 'rgba(160,124,200,.15)' : 'rgba(208,191,240,.4)'}` }}>
                      <div style={{ fontSize: 12, color: nameCol, fontWeight: 400 }}>{user?.firstName} {user?.lastName}</div>
                      <div style={{ fontSize: 10, color: night ? 'rgba(200,170,255,.5)' : '#bbadd0', marginTop: 2 }}>{user?.emailAddresses?.[0]?.emailAddress}</div>
                    </div>
                    {[
                      { label: 'Dashboard', page: 'dashboard', icon: '✦' },
                      { label: 'My Library', page: 'my library', icon: '⊞' },
                      { label: 'Settings', page: 'settings', icon: '⊟' },
                    ].map(item => (
                      <button key={item.label} onClick={() => { setMenuOpen(false); openPage(item.page); }} style={{
                        width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
                        color: night ? 'rgba(220,210,255,.8)' : '#4a3960', fontSize: 13,
                        fontFamily: "'DM Sans',sans-serif", fontWeight: 300,
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = night ? 'rgba(160,124,200,.12)' : 'rgba(208,191,240,.22)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: 11, color: night ? 'rgba(200,160,255,.6)' : '#8a7aa0' }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: `1px solid ${night ? 'rgba(160,124,200,.15)' : 'rgba(208,191,240,.4)'}` }}>
                      <button onClick={() => { setMenuOpen(false); handleSignOut(); }} style={{
                        width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
                        color: '#e05080', fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 300,
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,80,128,.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: 11 }}>↩</span>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button onClick={handleBeginWriting} style={{
              padding: '9px 24px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#a07cc8,#7c3aed)', color: '#fff',
              fontSize: 12, fontWeight: 400, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif", letterSpacing: '.03em',
              boxShadow: '0 4px 20px rgba(124,58,237,.28)', transition: 'all .2s',
            }}>Begin writing</button>
          </>
        ) : (
          /* Signed-out state */
          <>
            <button onClick={handleSignIn} style={{
              padding: '9px 24px', borderRadius: 50,
              border: `1.5px solid ${night ? 'rgba(160,124,200,.45)' : '#d0bff0'}`,
              background: night ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.7)',
              color: '#c084fc', fontSize: 12, fontWeight: 400, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif", letterSpacing: '.03em', transition: 'all .2s',
            }}>Sign in</button>
            <button onClick={() => router.push('/sign-up')} style={{
              padding: '9px 24px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg,#a07cc8,#7c3aed)', color: '#fff',
              fontSize: 12, fontWeight: 400, cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif", letterSpacing: '.03em',
              boxShadow: '0 4px 20px rgba(124,58,237,.28)', transition: 'all .2s',
            }}>Join Muse</button>
          </>
        )}
      </div>
    </nav>
  );
}
