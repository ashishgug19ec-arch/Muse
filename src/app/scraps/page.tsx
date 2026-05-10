'use client';
import { AppShell } from '@/components/AppShell';
import { PageScraps } from '@/components/pages/PageScraps';
import { useMuseStore } from '@/lib/store';

export default function ScrapsPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="scraps">
      <PageScraps night={night} />
    </AppShell>
  );
}
