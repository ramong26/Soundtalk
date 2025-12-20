'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import callApi from '@/shared/hooks/callApi';
import { signupSchema, SignupFormData } from '@/features/auth/schema/signupSchema';

export default function useSignupSubmit({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // 회원가입 처리 함수
  const onSubmit = async (data: SignupFormData) => {
    try {
      await callApi('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      router.push('/');
      onClose();
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  // 회원가입 필드 설정
  const signupField = {
    username: {
      name: 'username' as const,
      type: 'text',
      placeholder: 'Nickname을 입력해주세요',
      register,
    },
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
    confirmPassword: {
      name: 'confirmPassword' as const,
      type: 'password',
      placeholder: 'Confirm Password을 입력해주세요',
      register,
    },
  };

  return {
    handleSubmit,
    isSubmitting,
    onSubmit,
    signupField,
    errors,
  };
}
