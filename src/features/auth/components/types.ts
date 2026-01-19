import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type FieldName<T extends FieldValues> = Path<T>;

export interface FieldProps<T extends FieldValues> {
  name: FieldName<T>;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  error?: string;
}

export interface LoginModalMainProps<T extends FieldValues> {
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
