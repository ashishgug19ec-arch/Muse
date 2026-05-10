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

  const bg = night
    ? 'linear-gradient(160deg,#1a0c2e 0%,#0f0620 100%)'
    : 'linear-gradient(160deg,rgba(248,244,255,.98) 0%,rgba(255,243,250,.97) 100%)';

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <GlassNav scrolled currentPage={title} showBack />
      <div style={{ paddingTop: 82 }}>
        {children}
      </div>
    </div>
  );
}
