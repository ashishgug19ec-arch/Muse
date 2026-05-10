'use client';
import { AppShell } from '@/components/AppShell';
import { PageSanctuary } from '@/components/pages/PageSanctuary';
import { useMuseStore } from '@/lib/store';

export default function SanctuaryPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="sanctuary">
      <PageSanctuary night={night} />
    </AppShell>
  );
}
