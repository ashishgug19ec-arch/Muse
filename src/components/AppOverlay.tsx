'use client';
import { useMuseStore } from '@/lib/store';
import { PageDashboard } from './pages/PageDashboard';
import { PageSanctuary } from './pages/PageSanctuary';
import { PageLibrary } from './pages/PageLibrary';
import { PageCollections } from './pages/PageCollections';
import { PageScraps } from './pages/PageScraps';
import { PageIkigai } from './pages/PageIkigai';
import { PageFanFiction } from './pages/PageFanFiction';
import { PageAuthorProfile } from './pages/PageAuthorProfile';
import { PageSettings } from './pages/PageSettings';

const PAGE_MAP: Record<string, React.ComponentType<{ night: boolean }>> = {
  dashboard: PageDashboard,
  sanctuary: PageSanctuary,
  library: PageLibrary,
  'my library': PageLibrary,
  collections: PageCollections,
  scraps: PageScraps,
  ikigai: PageIkigai,
  'ikigai journal': PageIkigai,
  'fan fiction': PageFanFiction,
  'fan-fiction': PageFanFiction,
  profile: PageAuthorProfile,
  'author profile': PageAuthorProfile,
  settings: PageSettings,
};

export function AppOverlay() {
  const { activePage, closePage, night } = useMuseStore();
  const pageKey = activePage?.toLowerCase() ?? '';
  const Page = pageKey ? PAGE_MAP[pageKey] : null;

  if (!activePage) return null;

  const bg = night
    ? 'linear-gradient(160deg,#1a0c2e 0%,#0f0620 100%)'
    : 'linear-gradient(160deg,rgba(248,244,255,.98) 0%,rgba(255,243,250,.97) 100%)';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: bg,
      animation: 'slideInRight .38s cubic-bezier(.34,1.56,.64,1)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px',
        borderBottom: `1px solid ${night ? 'rgba(160,124,200,.18)' : 'rgba(208,191,240,.4)'}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={closePage} style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${night ? 'rgba(160,124,200,.3)' : 'rgba(208,191,240,.6)'}`,
            background: 'transparent', cursor: 'pointer', fontSize: 16,
            color: night ? 'rgba(200,180,255,.7)' : '#8a7aa0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="Close">←</button>
          <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: night ? 'rgba(160,140,200,.55)' : '#8a7aa0' }}>
            {activePage?.replace(/-/g, ' ')}
          </span>
        </div>
        <button onClick={closePage} style={{
          width: 28, height: 28, borderRadius: '50%',
          border: `1px solid ${night ? 'rgba(160,124,200,.3)' : 'rgba(208,191,240,.5)'}`,
          background: 'transparent', cursor: 'pointer', fontSize: 14,
          color: night ? 'rgba(200,180,255,.6)' : '#8a7aa0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} aria-label="Close">✕</button>
      </div>

      <div style={{ flex: 1 }}>
        {Page && <Page night={night} />}
      </div>
    </div>
  );
}
