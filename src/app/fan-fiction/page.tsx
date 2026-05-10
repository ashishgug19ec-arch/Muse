'use client';
import { AppShell } from '@/components/AppShell';
import { PageFanFiction } from '@/components/pages/PageFanFiction';
import { useMuseStore } from '@/lib/store';

export default function FanFictionPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="fan fiction">
      <PageFanFiction night={night} />
    </AppShell>
  );
}
