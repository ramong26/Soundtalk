'use client';

interface SubmitInputProps {
  className?: string;
  onSubmit?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value?: string;
}

export default function SubmitInput({
  className,
  onSubmit,
  placeholder,
  onChange,
  value,
}: SubmitInputProps) {
  return (
    <div className={`${className} w-full border-3  border-black p-2  hover:bg-gray-100 transition`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) {
            onSubmit(e.currentTarget.value);
          }
        }}
        value={value}
        className="w-full outline-none lg:text-lg md:text-md text-sm font-medium placeholder-gray-400"
      />
    </div>
  );
}
