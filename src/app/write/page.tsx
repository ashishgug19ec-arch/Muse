'use client';
import { AppShell } from '@/components/AppShell';
import { PageBeginWriting } from '@/components/pages/PageBeginWriting';
import { useMuseStore } from '@/lib/store';

export default function WritePage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="begin writing">
      <PageBeginWriting night={night} />
    </AppShell>
  );
}
