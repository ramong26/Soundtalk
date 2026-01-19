'use client';
import { useEffect, useState } from 'react';

import HeaderLayout from '@/shared/components/HeaderMain/HeaderLayout';
import useHeaderAuth from '@/shared/hooks/HeaderMain/useHeaderAuth';
import LoginModalMain from '@/features/auth/components/LoginModalMain';

import useSignupSubmit from '@/features/auth/hooks/useSignupSubmit';
import useLoginSubmit from '@/features/auth/hooks/useLoginSubmit';
import type { LoginFormData } from '@/features/auth/schema/loginSchema';
import type { SignupFormData } from '@/features/auth/schema/signupSchema';

/**
 * TODO: useLoginSubmit과 useSignupSubmit 훅이 HeaderMain 컴포넌트가 렌더링될 때마다 항상 호출되므로,
 * 분리하여 모달이 열릴 때만 훅이 호출되도록 최적화 필요.
 */
type AuthModalType = 'login' | 'signup' | null;

export default function HeaderMain() {
  const [modalType, setModalType] = useState<AuthModalType>(null);
  const { isLogin, profile, handleLogout } = useHeaderAuth();

  // Login form submit hook
  const login = useLoginSubmit({
    onClose: () => {
      setModalType(null);
    },
  });
  const { handleSubmit: handleLoginSubmit, errors: loginErrors, isSubmitting: isLoginSubmitting, loginField } = login;
  const loginErrorMessages = loginErrors
    ? Object.fromEntries(Object.entries(loginErrors).map(([key, value]) => [key, value?.message]))
    : undefined;
  const loginFields = [loginField.email, loginField.password];

  const signup = useSignupSubmit({
    onClose: () => {
      setModalType(null);
    },
  });

  // Signup form submit hook
  const { handleSubmit, errors, isSubmitting, signupField } = signup;
  const errorMessages = errors
    ? Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.message]))
    : undefined;
  const signupFields = [signupField.username, signupField.email, signupField.password, signupField.confirmPassword];

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // 컴포넌트 언마운트 시 스크롤을 다시 활성화합니다.
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalType]);

  return (
    <>
      <HeaderLayout handleOpenModal={setModalType} handleLogout={handleLogout} profile={profile} isLogin={isLogin} />
      {modalType === 'login' ? (
        <LoginModalMain<LoginFormData>
          key={'login-modal'}
          title="Log in to your account."
          submitLabel="Log in"
          fields={loginFields}
          onClose={() => setModalType(null)}
          onSubmit={handleLoginSubmit}
          isSubmitting={isLoginSubmitting}
          errors={loginErrorMessages}
          switchLabel="Create an account"
          onSwitch={() => setModalType('signup')}
        />
      ) : modalType === 'signup' ? (
        <LoginModalMain<SignupFormData>
          key={'signup-modal'}
          title="Sign up to Soundtalk"
          submitLabel="Sign Up"
          fields={signupFields}
          onClose={() => setModalType(null)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          errors={errorMessages}
          switchLabel="Log in Here"
          onSwitch={() => setModalType('login')}
        />
      ) : null}
    </>
  );
}
