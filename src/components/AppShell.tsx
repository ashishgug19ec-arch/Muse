'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMuseStore } from '@/lib/store';
import { GlassNav } from '@/components/GlassNav';

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { night, nickname, setNickname } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || nickname !== null) return;
    fetch('/api/profile/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.username) setNickname(data.username); })
      .catch(() => {});
  }, [isLoaded, isSignedIn, nickname, setNickname]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: night ? '#06030f' : 'linear-gradient(160deg,rgba(248,244,255,.98) 0%,rgba(255,243,250,.97) 100%)' }}>
      {night && (
        <>
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse at 15% 15%,rgba(124,58,237,.22),transparent 50%),radial-gradient(ellipse at 85% 75%,rgba(208,100,136,.18),transparent 50%),radial-gradient(ellipse at 50% 50%,rgba(92,38,180,.1),transparent 60%)' }} />
          <div style={{ position: 'fixed', top: '30%', left: '-5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,.12),transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'fixed', bottom: '10%', right: '-5%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,154,184,.1),transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
        </>
      )}
      <GlassNav scrolled currentPage={title} />
      <div style={{ paddingTop: 82, position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
