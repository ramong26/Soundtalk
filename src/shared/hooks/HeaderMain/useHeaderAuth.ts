'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import useUserStore from '@/stores/userStore';
import DefaultProfile from '@/public/image/default-profile-image.avif';

interface Profile {
  id: string;
  displayName: string;
  profileImageUrl?: string | null;
}
export default function useHeaderAuth() {
  const { setUser, user } = useUserStore();
  const [isLogin, setIsLogin] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { data, isSuccess, isError } = useQuery<Profile>({
    queryKey: user ? ['user', user._id] : ['user'],
    queryFn: async () => {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('로그인 안 됨');
      return res.json();
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      const profileImage = data.profileImageUrl ?? DefaultProfile.src;

      setProfile({ ...data, profileImageUrl: profileImage });
      setIsLogin(true);
      setUser({ ...data, _id: data.id, profileImageUrl: profileImage });
    }
  }, [isSuccess, data, setUser]);

  useEffect(() => {
    if (isError) {
      setProfile(null);
      setIsLogin(false);
    }
  }, [isError]);
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { credentials: 'include' });
    window.location.href = '/';
  };

  return { isLogin, profile, handleLogout };
}
