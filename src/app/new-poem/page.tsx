'use client';
import { AppShell } from '@/components/AppShell';
import { PageNewPoem } from '@/components/pages/PageNewPoem';
import { useMuseStore } from '@/lib/store';

export default function NewPoemPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="new poem">
      <PageNewPoem night={night} />
    </AppShell>
  );
}
