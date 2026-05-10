'use client';
import { AppShell } from '@/components/AppShell';
import { PageIkigai } from '@/components/pages/PageIkigai';
import { useMuseStore } from '@/lib/store';

export default function IkigaiPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="ikigai journal">
      <PageIkigai night={night} />
    </AppShell>
  );
}
