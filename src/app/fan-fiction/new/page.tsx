'use client';
import { AppShell } from '@/components/AppShell';
import { PageFanFiction } from '@/components/pages/PageFanFiction';
import { useMuseStore } from '@/lib/store';

export default function NewFanFicPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="new story">
      <PageFanFiction night={night} defaultView="create-fic" />
    </AppShell>
  );
}
