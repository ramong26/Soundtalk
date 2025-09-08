'use client';
import { useState } from 'react';

// 페이지네이션 훅
export default function usePagination(limit: number) {
  const [page, setPage] = useState(0);

  const offset = page * limit;

  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const nextPage = () => setPage((prev) => prev + 1);

  return {
    page,
    setPage,
    offset,
    nextPage,
    prevPage,
  };
}
