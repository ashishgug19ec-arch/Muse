'use client';
import { AppShell } from '@/components/AppShell';
import { PageNotifications } from '@/components/pages/PageNotifications';
import { useMuseStore } from '@/lib/store';

export default function NotificationsPage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="notifications">
      <PageNotifications night={night} />
    </AppShell>
  );
}
