import { z } from 'zod';

export const signupSchema = z
  .object({
    username: z.string().min(2, { message: '이름은 2자 이상이어야 합니다' }),
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요' })
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: '올바른 이메일 형식이 아닙니다 (예: user@example.com)',
      }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 8자 이상이어야 합니다' })
      .regex(/(?=.*[!@#$%^&*])/, { message: '특수문자를 포함해야 합니다' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다',
  });

export type SignupFormData = z.infer<typeof signupSchema>;
