'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMuseStore } from '@/lib/store';
import { MuseLogo } from './ui/MuseLogo';
import { PageDashboard } from './pages/PageDashboard';
import { PageBeginWriting } from './pages/PageBeginWriting';
import { PageSanctuary } from './pages/PageSanctuary';
import { PageLibrary } from './pages/PageLibrary';
import { PageCollections } from './pages/PageCollections';
import { PageScraps } from './pages/PageScraps';
import { PageIkigai } from './pages/PageIkigai';
import { PageFanFiction } from './pages/PageFanFiction';
import { PageExplore } from './pages/PageExplore';
import { PageAuthorProfile } from './pages/PageAuthorProfile';
import { PageSettings } from './pages/PageSettings';
import { PageNotifications } from './pages/PageNotifications';
import { PageStoryUpload } from './pages/PageStoryUpload';
import { PageStoryReader } from './pages/PageStoryReader';
import { PageNewPoem } from './pages/PageNewPoem';

const PAGE_MAP: Record<string, React.ComponentType<{ night: boolean }>> = {
  dashboard: PageDashboard,
  write: PageBeginWriting,
  'begin writing': PageBeginWriting,
  BeginWriting: PageBeginWriting,
  sanctuary: PageSanctuary,
  Sanctuary: PageSanctuary,
  poems: PageLibrary,
  library: PageLibrary,
  'my library': PageLibrary,
  Library: PageLibrary,
  collections: PageCollections,
  Collections: PageCollections,
  scraps: PageScraps,
  Scraps: PageScraps,
  ikigai: PageIkigai,
  'ikigai journal': PageIkigai,
  Ikigai: PageIkigai,
  'fan fiction': PageFanFiction,
  'fan-fiction': PageFanFiction,
  FanFiction: PageFanFiction,
  explore: PageExplore,
  Explore: PageExplore,
  profile: PageAuthorProfile,
  'author profile': PageAuthorProfile,
  AuthorProfile: PageAuthorProfile,
  settings: PageSettings,
  Settings: PageSettings,
  notifications: PageNotifications,
  Notifications: PageNotifications,
  'story upload': PageStoryUpload,
  StoryUpload: PageStoryUpload,
  'story reader': PageStoryReader,
  StoryReader: PageStoryReader,
  'new poem': PageNewPoem,
  NewPoem: PageNewPoem,
};

const NAV_LINKS = [
  { label: 'Dashboard',   page: 'dashboard' },
  { label: 'Poems',       page: 'poems' },
  { label: 'Explore',     page: 'explore' },
  { label: 'Fan Fiction', page: 'fan fiction' },
  { label: 'Collections', page: 'collections' },
];

export function AppOverlay() {
  const { activePage, closePage, night, toggleNight, openPage } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pageKey = activePage?.toLowerCase() ?? '';
  const Page = pageKey ? PAGE_MAP[pageKey] : null;

  useEffect(() => {
    if (isLoaded && !isSignedIn && activePage) {
      closePage();
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, activePage, closePage, router]);

  if (!activePage) return null;
  if (isLoaded && !isSignedIn) return null;

  const bg = night
    ? 'linear-gradient(160deg,#1a0c2e 0%,#0f0620 100%)'
    : 'linear-gradient(160deg,rgba(248,244,255,.98) 0%,rgba(255,243,250,.97) 100%)';

  const borderCol = night ? 'rgba(160,124,200,.18)' : 'rgba(208,191,240,.4)';
  const ink3 = night ? 'rgba(160,140,200,.55)' : '#8a7aa0';
  const nameCol = night ? 'rgba(240,230,255,.9)' : '#1e1628';
  const linkCol = night ? 'rgba(200,170,255,.7)' : '#8a7aa0';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: bg,
      animation: 'slideInRight .38s cubic-bezier(.34,1.56,.64,1)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '14px 32px',
        borderBottom: `1px solid ${borderCol}`,
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 10,
        background: bg,
      }}>
        {/* Left: back + logo + page name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={closePage} style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${borderCol}`,
            background: 'transparent', cursor: 'pointer', fontSize: 16,
            color: night ? 'rgba(200,180,255,.7)' : '#8a7aa0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }} aria-label="Back">←</button>

          <button onClick={() => openPage('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <MuseLogo size={30} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: nameCol, fontWeight: 400, letterSpacing: '-.01em', lineHeight: 1 }}>Muse</div>
              <div style={{ fontSize: 9, color: ink3, letterSpacing: '.12em', fontWeight: 300, marginTop: 2 }}>garden of poetry</div>
            </div>
          </button>

          <div style={{ width: 1, height: 20, background: borderCol, margin: '0 4px' }} />

          <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: ink3 }}>
            {activePage.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Center: quick nav links */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_LINKS.map(l => {
            const isActive = pageKey === l.page || pageKey === l.label.toLowerCase();
            return (
              <button key={l.label} onClick={() => openPage(l.page)} style={{
                padding: '6px 14px', borderRadius: 50, fontSize: 12,
                background: isActive ? (night ? 'rgba(192,132,252,.15)' : 'rgba(192,132,252,.1)') : 'transparent',
                border: isActive ? `1px solid rgba(192,132,252,.35)` : '1px solid transparent',
                color: isActive ? '#c084fc' : linkCol,
                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 300,
                transition: 'all .15s',
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#c084fc'; e.currentTarget.style.background = night ? 'rgba(192,132,252,.08)' : 'rgba(192,132,252,.06)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = linkCol; e.currentTarget.style.background = 'transparent'; } }}
              >{l.label}</button>
            );
          })}
        </nav>

        {/* Right: night toggle + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={toggleNight} title="Toggle night mode" style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${borderCol}`,
            background: night ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.65)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>{night ? '☀️' : '🌙'}</button>

          <button onClick={closePage} style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${borderCol}`,
            background: 'transparent', cursor: 'pointer', fontSize: 16,
            color: night ? 'rgba(200,180,255,.6)' : '#8a7aa0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="Close">✕</button>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────── */}
      <div style={{ flex: 1 }}>
        {Page && <Page night={night} />}
      </div>

    </div>
  );
}
