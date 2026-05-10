'use client';
import { AppShell } from '@/components/AppShell';
import { PageCollections } from '@/components/pages/PageCollections';
import { useMuseStore } from '@/lib/store';

export default function CollectionsPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="collections">
      <PageCollections night={night} />
    </AppShell>
  );
}
