import React, { useState } from 'react';

interface SortDownProps {
  className?: string;
  label?: string | string[];
  onSelect?: (value: string) => void;
  title?: string;
  link?: string | string[];
}

export default function SortDown({ className, label, onSelect, title, link }: SortDownProps) {
  const [open, setOpen] = useState(false);

  if (!Array.isArray(label)) {
    // 단일 텍스트 버튼으로 사용
    return (
      <button
        type="button"
        aria-label={label}
        className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 active:bg-gray-200 ${className ?? ''}`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M5 8L10 13L15 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="lg:text-lg md:text-md text-sm font-semibold">{label}</span>
      </button>
    );
  }

  // label이 배열일 경우 드롭다운 메뉴로 사용
  return (
    <div className={`relative inline-block ${className ?? ''}`}>
      <button
        type="button"
        aria-label={label[0]}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 active:bg-gray-200"
      >
        <span className="lg:text-lg md:text-md text-sm font-semibold">{title}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="hover:rotate-0 transition-transform duration-300"
        >
          <path
            d="M5 8L10 13L15 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul className="w-fit absolute z-10 mt-2 right--29 bg-white border rounded shadow-lg">
          {label.map((item, idx) => (
            <li key={item}>
              {Array.isArray(link) && link[idx] ? (
                <a
                  href={link[idx]}
                  className="w-fit px-6 py-2 text-left hover:bg-gray-100 block"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </a>
              ) : (
                <button
                  className="w-full px-6 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setOpen(false);
                    if (onSelect) onSelect(item);
                  }}
                >
                  {item}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
