'use client';
import Image from 'next/image';

import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import LoginModalLayout from '@/features/auth/components/LoginModalLayout';

type FieldName<T extends FieldValues> = Path<T>;

interface FieldProps<T extends FieldValues> {
  name: FieldName<T>;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  error?: string;
}

interface LoginModalMainProps<T extends FieldValues> {
  onClose: () => void;
  title: string;
  fields: FieldProps<T>[];
  isSubmitting?: boolean;
  submitLabel: string;
  switchLabel: string;
  onSwitch: () => void;
  errors?: { [key: string]: string | undefined };
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function LoginModalMain<T extends FieldValues>({
  onClose,
  title,
  onSubmit,
  fields,
  isSubmitting,
  submitLabel,
  switchLabel,
  onSwitch,
  errors,
}: LoginModalMainProps<T>) {
  // Spotify 로그인 함수
  // TODO: 배포 후 도메인으로 변경 필요
  const signWithSpotify = () => {
    window.location.href = 'https://music-charts.vercel.app/api/auth/spotify/login';
  };

  // Google 로그인 함수
  const signWithGoogle = () => {
    window.location.href = 'https://music-charts.vercel.app/api/auth/google/login';
  };
  // const signWithSpotify = () => {
  //   window.location.href = '/api/auth/spotify/login';
  // };

  // // Google 로그인 함수
  // const signWithGoogle = () => {
  //   window.location.href = '/api/auth/google/login';
  // };

  // OAuth 버튼 설정
  const oauthButtons = [
    {
      label: 'Continue with Spotify',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      alt: 'Spotify',
      onClick: signWithSpotify,
    },
    {
      label: 'Continue with Google',
      icon: 'https://www.svgrepo.com/show/355037/google.svg',
      alt: 'Google',
      onClick: signWithGoogle,
    },
  ];

  return (
    <LoginModalLayout onClose={onClose}>
      <div className="mb-6 flex items-center justify-center">
        <span className="text-3xl font-extrabold text-black">Soundtalk</span>
      </div>
      <h2 className="text-lg font-bold mb-4 text-center text-black">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4 w-full">
        {fields.map((field) => (
          <div key={field.name} className="w-full mb-3">
            <label className=" flex items-center border rounded px-3 py-2 bg-white">
              <span className="mr-2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" aria-hidden="true">
                  <path d="M2 6l8 6 8-6" />
                </svg>
              </span>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full outline-none bg-transparent"
                {...field.register(field.name)}
              />
              {errors?.[field.name] && <span className="text-red-500 text-sm block mt-1">{errors[field.name]}</span>}
            </label>
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-beige-light hover:bg-beige-medium border  text-black font-bold py-2 rounded mb-4 transition-colors duration-200"
        >
          {isSubmitting ? `${submitLabel}...` : submitLabel}
        </button>
      </form>
      {/* OR 구분선 */}
      <div className="flex items-center w-full my-2">
        <hr className="flex-1 border-gray-300" />
        <span className="mx-2 text-gray-500 font-bold">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>
      {oauthButtons?.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          className="cursor-pointer w-full flex items-center justify-center border rounded py-2 mb-4 bg-white hover:bg-gray-100"
        >
          <Image src={btn.icon} alt={btn.alt} width={24} height={24} className="w-6 h-6 mr-2" />
          <span className="font-semibold text-black">{btn.label}</span>
        </button>
      ))}
      <button
        onClick={onSwitch}
        className="cursor-pointer w-full flex items-center justify-center border rounded py-2 mb-4 bg-white hover:bg-gray-100"
      >
        <span className="font-semibold text-black">{switchLabel}</span>
      </button>
    </LoginModalLayout>
  );
}
