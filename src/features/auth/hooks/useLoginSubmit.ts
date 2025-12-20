'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import callApi from '@/shared/hooks/callApi';
import { loginSchema, LoginFormData } from '@/features/auth/schema/loginSchema';

export default function useLoginSubmit({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 로그인 처리 함수
  const onSubmit = async (data: LoginFormData) => {
    try {
      await callApi('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      router.push('/');
      onClose();
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

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
    handleSubmit,
    isSubmitting,
    onSubmit,
    loginField,
    errors,
  };
}
