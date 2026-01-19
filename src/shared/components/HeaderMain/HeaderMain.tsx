'use client';
import { useState } from 'react';

import HeaderLayout from '@/shared/components/HeaderMain/HeaderLayout';
import useHeaderAuth from '@/shared/hooks/HeaderMain/useHeaderAuth';
import LoginModalMain from '@/features/auth/components/LoginModalMain';

import useSignupSubmit from '@/features/auth/hooks/useSignupSubmit';
import useLoginSubmit from '@/features/auth/hooks/useLoginSubmit';
import { LoginFormData } from '@/features/auth/schema/loginSchema';
import { SignupFormData } from '@/features/auth/schema/signupSchema';

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
