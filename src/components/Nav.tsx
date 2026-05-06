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

  const navBg     = night ? 'rgba(18,12,36,.92)'       : 'rgba(248,245,255,.9)';
  const borderCol = night ? 'rgba(167,139,200,.18)'     : 'rgba(196,181,253,.32)';
  const linkCol   = night ? 'rgba(196,181,253,.62)'     : '#8a7aa0';
  const nameCol   = night ? 'rgba(240,230,255,.92)'     : '#1e1628';
  const taglineCol= night ? 'rgba(196,181,253,.5)'      : '#bbadd0';

  function handleBeginWriting() {
    if (!isLoaded) return;
    if (isSignedIn) openPage('Sanctuary');
    else router.push('/sign-in');
  }

  function handleSignIn() { router.push('/sign-in'); }
  function handleSignOut() { signOut(() => router.push('/')); }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 56px 16px 42px',
      background: navBg,
      backdropFilter: 'blur(28px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
      borderBottom: `1px solid ${borderCol}`,
      transition: 'background .4s, border-color .4s',
    }}>

      {/* Purple shimmer line at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(196,181,253,.45),rgba(167,139,250,.6),rgba(196,181,253,.45),transparent)',
        pointerEvents: 'none',
      }} />

      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => setDrawerOpen(true)} aria-label="Menu" style={{
          width: 32, height: 32, border: 'none', background: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          justifyContent: 'center', gap: 5, cursor: 'pointer', flexShrink: 0, padding: 0,
        }}>
          {[22, 16, 22].map((w, i) => (
            <div key={i} style={{
              width: w, height: 2, borderRadius: 99,
              background: night ? 'rgba(196,181,253,.48)' : 'rgba(124,58,237,.35)',
              transition: 'width .25s ease',
            }} />
          ))}
        </button>

        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <MuseLogo />
          <div>
            <div style={{
              fontFamily: "'Playfair Display',serif", fontSize: 20,
              color: nameCol, fontWeight: 400, letterSpacing: '-.02em',
            }}>Muse</div>
            <div style={{
              fontSize: 9, color: taglineCol, letterSpacing: '.15em',
              fontWeight: 300, marginTop: 1,
            }}>garden of poetry</div>
          </div>
        </a>
      </div>

      {/* Center: links */}
      <div style={{ display: 'flex', gap: 32 }}>
        {['Discover', 'Explore', 'Fan Fiction', 'Community'].map(l => (
          <button
            key={l}
            onClick={() => openPage(l)}
            style={{
              fontSize: 13, color: linkCol, background: 'none', border: 'none',
              fontWeight: 300, letterSpacing: '.02em', cursor: 'pointer',
              fontFamily: "'DM Sans',sans-serif", transition: 'color .2s',
              position: 'relative', padding: '4px 0',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={e => (e.currentTarget.style.color = linkCol)}
          >{l}</button>
        ))}
      </div>

      {/* Right: night + auth */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          onClick={toggleNight}
          title="Toggle night mode"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `1px solid ${night ? 'rgba(167,139,250,.38)' : 'rgba(196,181,253,.48)'}`,
            background: night ? 'rgba(255,255,255,.08)' : 'rgba(245,240,255,.72)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 15,
            backdropFilter: 'blur(8px)',
            transition: 'all .25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(167,139,250,.65)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(167,139,250,.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = night ? 'rgba(167,139,250,.38)' : 'rgba(196,181,253,.48)';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          {night ? '☀️' : '🌙'}
        </button>

        {isLoaded && isSignedIn ? (
          <>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 14px 6px 6px', borderRadius: 50,
                  border: `1px solid ${night ? 'rgba(167,139,250,.3)' : 'rgba(196,181,253,.5)'}`,
                  background: night ? 'rgba(255,255,255,.06)' : 'rgba(245,240,255,.75)',
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer', transition: 'all .25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(167,139,250,.6)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = night ? 'rgba(167,139,250,.3)' : 'rgba(196,181,253,.5)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#c084fc,#7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#fff', fontWeight: 600, flexShrink: 0,
                }}>
                  {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? '✦'}
                </div>
                <span style={{
                  fontSize: 12, color: nameCol, fontWeight: 300,
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {user?.firstName ?? 'My garden'}
                </span>
                <span style={{ fontSize: 10, color: night ? 'rgba(196,181,253,.45)' : '#bbadd0' }}>▾</span>
              </button>

              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 299 }} />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 300,
                    minWidth: 188, borderRadius: 18,
                    background: night ? 'rgba(22,14,42,.98)' : 'rgba(250,248,255,.98)',
                    border: `1px solid ${night ? 'rgba(167,139,250,.22)' : 'rgba(196,181,253,.55)'}`,
                    backdropFilter: 'blur(28px)',
                    boxShadow: '0 16px 48px rgba(124,58,237,.16)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '13px 16px',
                      borderBottom: `1px solid ${night ? 'rgba(167,139,250,.15)' : 'rgba(196,181,253,.38)'}`,
                    }}>
                      <div style={{ fontSize: 12, color: nameCol, fontWeight: 400 }}>
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div style={{
                        fontSize: 10, color: night ? 'rgba(196,181,253,.5)' : '#bbadd0', marginTop: 2,
                      }}>
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </div>
                    </div>
                    {[
                      { label: 'Dashboard', page: 'dashboard', icon: '✦' },
                      { label: 'My Library', page: 'my library', icon: '⊞' },
                      { label: 'Settings',   page: 'settings',  icon: '⊟' },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => { setMenuOpen(false); openPage(item.page); }}
                        style={{
                          width: '100%', padding: '10px 16px', border: 'none',
                          background: 'transparent', display: 'flex', alignItems: 'center',
                          gap: 10, cursor: 'pointer', textAlign: 'left',
                          color: night ? 'rgba(220,210,255,.82)' : '#4a3960', fontSize: 13,
                          fontFamily: "'DM Sans',sans-serif", fontWeight: 300,
                          transition: 'background .15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = night ? 'rgba(167,139,250,.12)' : 'rgba(196,181,253,.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{
                          fontSize: 11, color: night ? 'rgba(196,181,253,.6)' : '#a78bfa',
                        }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: `1px solid ${night ? 'rgba(167,139,250,.15)' : 'rgba(196,181,253,.38)'}` }}>
                      <button
                        onClick={() => { setMenuOpen(false); handleSignOut(); }}
                        style={{
                          width: '100%', padding: '10px 16px', border: 'none',
                          background: 'transparent', display: 'flex', alignItems: 'center',
                          gap: 10, cursor: 'pointer', textAlign: 'left',
                          color: '#e05080', fontSize: 13,
                          fontFamily: "'DM Sans',sans-serif", fontWeight: 300,
                          transition: 'background .15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,80,128,.07)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ fontSize: 11 }}>↩</span>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleBeginWriting}
              style={{
                padding: '9px 22px', borderRadius: 50, border: 'none',
                background: 'linear-gradient(135deg,#b07ae8,#7c3aed)',
                color: '#fff', fontSize: 12, fontWeight: 400, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", letterSpacing: '.04em',
                boxShadow: '0 4px 18px rgba(124,58,237,.32)',
                transition: 'all .25s cubic-bezier(.34,1.4,.64,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,.46)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(124,58,237,.32)';
              }}
            >Begin writing</button>
          </>
        ) : (
          <>
            <button
              onClick={handleSignIn}
              style={{
                padding: '9px 22px', borderRadius: 50,
                border: `1px solid ${night ? 'rgba(167,139,250,.4)' : 'rgba(196,181,253,.52)'}`,
                background: night ? 'rgba(255,255,255,.06)' : 'rgba(245,240,255,.72)',
                backdropFilter: 'blur(10px)',
                color: '#a78bfa', fontSize: 12, fontWeight: 400, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", letterSpacing: '.04em',
                transition: 'all .2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(167,139,250,.65)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = night ? 'rgba(167,139,250,.4)' : 'rgba(196,181,253,.52)';
                e.currentTarget.style.boxShadow = '';
              }}
            >Sign in</button>

            <button
              onClick={() => router.push('/sign-up')}
              style={{
                padding: '9px 22px', borderRadius: 50, border: 'none',
                background: 'linear-gradient(135deg,#b07ae8,#7c3aed)',
                color: '#fff', fontSize: 12, fontWeight: 400, cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif", letterSpacing: '.04em',
                boxShadow: '0 4px 18px rgba(124,58,237,.32)',
                transition: 'all .25s cubic-bezier(.34,1.4,.64,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,.46)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(124,58,237,.32)';
              }}
            >Join Muse</button>
          </>
        )}
      </div>
    </nav>
  );
}
