'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useMuseStore } from '@/lib/store';
import { GlassNav } from '@/components/GlassNav';

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { night } = useMuseStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/sign-in');
  }, [isLoaded, isSignedIn, router]);

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
