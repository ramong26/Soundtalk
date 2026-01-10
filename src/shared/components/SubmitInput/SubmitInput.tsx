'use client';

import { useState } from 'react';
import { SubmitInputProps } from './types';

export default function SubmitInput({
  className,
  onSubmit,
  placeholder,
  onChange,
  value: controlledValue,
}: SubmitInputProps) {
  const [internalValue, setInternalValue] = useState('');

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      const inputValue = e.currentTarget.value.trim();

      if (inputValue) {
        onSubmit(inputValue);

        if (!isControlled) {
          setInternalValue('');
        }
      }
    }
  };

  return (
    <div className={`${className} w-full border-3 border-black p-2 hover:bg-gray-100 transition`}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        className="w-full outline-none lg:text-lg md:text-md text-sm font-medium placeholder-gray-400"
      />
    </div>
  );
}
