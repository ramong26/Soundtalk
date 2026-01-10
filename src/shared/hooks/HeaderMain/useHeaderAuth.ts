'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useUserStore from '@/stores/userStore';
import DefaultProfile from '@/public/image/default-profile-image.avif';

export default function useHeaderAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  const { data, isLoading, isError } = useQuery<User.Profile>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/profile', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Not authenticated');
      }

      return res.json();
    },
    retry: false,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data) {
      setUser({
        ...data,
        profileImageUrl: data.profileImageUrl ?? DefaultProfile.src,
      });
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
    }
  }, [isError, setUser]);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      credentials: 'include',
    });

    queryClient.removeQueries({ queryKey: ['user'] });
    setUser(null);
    router.push('/');
  }, [queryClient, router, setUser]);

  return {
    isLogin: !isLoading && !!data,
    profile: data
      ? {
          ...data,
          profileImageUrl: data.profileImageUrl ?? DefaultProfile.src,
        }
      : null,
    isLoading,
    handleLogout,
  };
}
