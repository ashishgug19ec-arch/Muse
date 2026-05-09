'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMuseStore } from '@/lib/store';

export default function SignInPage() {
  const router = useRouter();
  const { setSignInOpen } = useMuseStore();
  useEffect(() => {
    setSignInOpen(true);
    router.replace('/');
  }, [router, setSignInOpen]);
  return null;
}
