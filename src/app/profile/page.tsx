'use client';
import { AppShell } from '@/components/AppShell';
import { PageAuthorProfile } from '@/components/pages/PageAuthorProfile';
import { useMuseStore } from '@/lib/store';

export default function ProfilePage() {
  const { night } = useMuseStore();
  return (
    <AppShell title="my profile">
      <PageAuthorProfile night={night} />
    </AppShell>
  );
}
