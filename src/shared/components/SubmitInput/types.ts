export interface SubmitInputProps {
  className?: string;
  onSubmit?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value?: string;
}
