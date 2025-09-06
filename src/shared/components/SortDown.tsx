import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface SortDownProps {
  className?: string;
  label: string | string[];
  onSelect?: (value: string) => void;
  title?: string;
  link?: string | string[];
  dropdownPosition?: string;
}

export default function SortDown({
  className = '',
  label,
  onSelect,
  title,
  link,
  dropdownPosition,
}: SortDownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지 후 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // 단일 label(정렬 버튼 등)일 때
  if (!Array.isArray(label)) {
    return (
      <button
        type="button"
        aria-label={title}
        className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 active:bg-gray-200 ${className}`}
        onClick={() => {
          if (onSelect) onSelect(label);
        }}
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
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-label={title || label[0]}
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 active:bg-gray-200"
      >
        <span className="lg:text-lg md:text-md text-sm font-semibold">{title || label[0]}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
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
        <ul
          className={`w-fit absolute z-10 mt-2 bg-white border rounded shadow-lg min-w-[100px] ${dropdownPosition ?? 'right-0'}`}
        >
          {label.map((item, idx) => (
            <li key={item}>
              {Array.isArray(link) && link[idx] ? (
                <Link
                  href={link[idx]}
                  className="w-fit px-6 py-2 text-left hover:bg-gray-100 block"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </Link>
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
