'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Signin from '@/components/Auth/Signin';

export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/users');
    }
  }, [isAuthenticated, isLoading]);

  if (!isLoading && isAuthenticated) {
    return null; // Prevent flicker
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="w-full p-4 sm:p-8 xl:p-12">
          <Signin />
        </div>
      </div>
    </div>
  );
}
