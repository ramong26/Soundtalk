import { LoginFormData } from '@/features/auth/schema/loginSchema';
import { SignupFormData } from '@/features/auth/schema/signupSchema';
import useLoginSubmit from '@/features/auth/hooks/useLoginSubmit';
import useSignupSubmit from '@/features/auth/hooks/useSignupSubmit';
import LoginModalMain from './LoginModalMain';

interface AuthModalProps {
  onClose: () => void;
  onChangeModal: (type: 'login' | 'signup') => void;
  type: 'login' | 'signup';
}

export default function AuthModal({ onClose, onChangeModal, type }: AuthModalProps) {
  const login = useLoginSubmit({ onClose });
  const signup = useSignupSubmit({ onClose });

  // 로그인 일 때
  if (type === 'login') {
    const { handleSubmit, errors, isSubmitting, loginField } = login;
    const errorMessages = errors
      ? Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.message]))
      : undefined;
    const loginFields = [loginField.email, loginField.password];

    return (
      <LoginModalMain<LoginFormData>
        key={'login-modal'}
        title="Log in to your account."
        submitLabel="Log in"
        fields={loginFields}
        onClose={onClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errors={errorMessages}
        switchLabel="Create an account"
        onSwitch={() => onChangeModal('signup')}
      />
    );
  } else {
    // 회원가입 일 때
    const { handleSubmit, errors, isSubmitting, signupField } = signup;
    const errorMessages = errors
      ? Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.message]))
      : undefined;
    const signupFields = [signupField.username, signupField.email, signupField.password, signupField.confirmPassword];

    return (
      <LoginModalMain<SignupFormData>
        key={'signup-modal'}
        title="Sign up to Soundtalk"
        submitLabel="Sign Up"
        fields={signupFields}
        onClose={onClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errors={errorMessages}
        switchLabel="Log in Here"
        onSwitch={() => onChangeModal('login')}
      />
    );
  }
}
