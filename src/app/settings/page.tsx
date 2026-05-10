'use client';
import { AppShell } from '@/components/AppShell';
import { PageSettings } from '@/components/pages/PageSettings';
import { useMuseStore } from '@/lib/store';

export default function SettingsPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="settings">
      <PageSettings night={night} />
    </AppShell>
  );
}
