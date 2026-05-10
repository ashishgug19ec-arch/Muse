'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMuseStore } from '@/lib/store';
import { MuseLogo } from './ui/MuseLogo';

const NAV_LINKS = [
  { label: 'Dashboard',   href: '/dashboard' },
  { label: 'Poems',       href: '/poems' },
  { label: 'Explore',     href: '/explore' },
  { label: 'Fan Fiction', href: '/fan-fiction' },
  { label: 'Collections', href: '/collections' },
];

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { night, toggleNight } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  const bg = night
    ? 'linear-gradient(160deg,#1a0c2e 0%,#0f0620 100%)'
    : 'linear-gradient(160deg,rgba(248,244,255,.98) 0%,rgba(255,243,250,.97) 100%)';
  const borderCol = night ? 'rgba(160,124,200,.18)' : 'rgba(208,191,240,.4)';
  const ink3     = night ? 'rgba(160,140,200,.55)'  : '#8a7aa0';
  const nameCol  = night ? 'rgba(240,230,255,.9)'   : '#1e1628';
  const linkCol  = night ? 'rgba(200,170,255,.7)'   : '#8a7aa0';

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '14px 32px',
        borderBottom: `1px solid ${borderCol}`,
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 10,
        background: bg,
        flexShrink: 0,
      }}>
        {/* Left: back + logo + page name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => router.back()} aria-label="Back" style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${borderCol}`,
            background: 'transparent', cursor: 'pointer', fontSize: 16,
            color: night ? 'rgba(200,180,255,.7)' : '#8a7aa0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>←</button>

          <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <MuseLogo size={30} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: nameCol, fontWeight: 400, letterSpacing: '-.01em', lineHeight: 1 }}>Muse</div>
              <div style={{ fontSize: 9, color: ink3, letterSpacing: '.12em', fontWeight: 300, marginTop: 2 }}>garden of poetry</div>
            </div>
          </button>

          <div style={{ width: 1, height: 20, background: borderCol, margin: '0 4px' }} />
          <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>{title}</span>
        </div>

        {/* Center: nav links */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_LINKS.map(l => {
            const active = pathname === l.href;
            return (
              <button key={l.label} onClick={() => router.push(l.href)} style={{
                padding: '6px 14px', borderRadius: 50, fontSize: 12,
                background: active ? (night ? 'rgba(192,132,252,.15)' : 'rgba(192,132,252,.1)') : 'transparent',
                border: active ? '1px solid rgba(192,132,252,.35)' : '1px solid transparent',
                color: active ? '#c084fc' : linkCol,
                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 300, transition: 'all .15s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#c084fc'; e.currentTarget.style.background = night ? 'rgba(192,132,252,.08)' : 'rgba(192,132,252,.06)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = linkCol; e.currentTarget.style.background = 'transparent'; } }}
              >{l.label}</button>
            );
          })}
        </nav>

        {/* Right: night toggle + home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={toggleNight} title="Toggle night mode" style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${borderCol}`,
            background: night ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.65)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>{night
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b89ad8" strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7a3a8a" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
}</button>

          <button onClick={() => router.push('/')} aria-label="Home" style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${borderCol}`,
            background: 'transparent', cursor: 'pointer', fontSize: 16,
            color: night ? 'rgba(200,180,255,.6)' : '#8a7aa0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
      </header>

      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
