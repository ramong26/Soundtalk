'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useUserStore from '@/stores/userStore';
import DefaultProfile from '@/public/image/default-profile-image.avif';

export default function useHeaderAuth() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery<User.Profile>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('로그인 안 됨');
      return res.json();
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      const profileImage = data.profileImageUrl ?? DefaultProfile.src;

      setUser({ ...data, id: data.id, profileImageUrl: profileImage, userType: data.userType });
    }
  }, [isSuccess, data, setUser]);

  const isLogin = !!data;
  const profile = data ? { ...data, profileImageUrl: data.profileImageUrl ?? DefaultProfile.src } : null;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { credentials: 'include' });
    queryClient.removeQueries({ queryKey: ['user'] });
    setUser(null);
    router.push('/');
  };

  return { isLogin, profile, handleLogout };
}
