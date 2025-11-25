'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">TaskFlow</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
