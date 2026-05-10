'use client';
import { AppShell } from '@/components/AppShell';
import { PageExplore } from '@/components/pages/PageExplore';
import { useMuseStore } from '@/lib/store';

export default function ExplorePage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="explore">
      <PageExplore night={night} />
    </AppShell>
  );
}
