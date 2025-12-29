'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import callApi from '@/shared/hooks/callApi';
import { loginSchema, LoginFormData } from '@/features/auth/schema/loginSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useLoginSubmit({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 로그인 처리 함수
  // TODO: 로그인시 paylaod 안 보이게 처리
  const { mutate: loginMutationFn, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      await callApi('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/');
      onClose();
    },
    onError: (error) => {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const loginField = {
    email: {
      name: 'email' as const,
      type: 'email',
      placeholder: 'Email을 입력해주세요',
      register,
    },
    password: {
      name: 'password' as const,
      type: 'password',
      placeholder: 'Password을 입력해주세요',
      register,
    },
  };

  return {
    handleSubmit: handleSubmit((data) => loginMutationFn(data)),
    isSubmitting: isPending,
    loginField,
    errors,
  };
}
