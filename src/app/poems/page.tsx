'use client';
import { AppShell } from '@/components/AppShell';
import { PageLibrary } from '@/components/pages/PageLibrary';
import { useMuseStore } from '@/lib/store';

export default function PoemsPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="poems">
      <PageLibrary night={night} />
    </AppShell>
  );
}
