'use client';
import { useState } from 'react';

// 플레이리스트 제출 훅
export function usePlaylistSubmit() {
  const [submitUrl, setSubmitUrl] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 플레이리스트 ID를 추출하는 함수
  const extractPlaylistId = (url: string): string => {
    if (url.startsWith('https://open.spotify.com/playlist/')) {
      const regex = /(?:playlist[\/:])([a-zA-Z0-9]+)/;
      const match = url.match(regex);
      return match ? match[1] : '';
    }
    return '';
  };

  // 플레이리스트 ID를 제출하는 함수
  const handleSubmit = (input: string) => {
    const id = extractPlaylistId(input.trim());

    if (input.trim() === '') {
      setError('플레이리스트 ID가 비어있어요!');
      setShowChart(false);
      return;
    }
    if (!id) {
      setError('유효한 플레이리스트 ID를 입력해주세요!');
      setShowChart(false);
      return;
    }
    setPlaylistId(id.trim());
    setShowChart(true);
    setError(null);
  };

  return {
    submitUrl,
    setSubmitUrl,
    playlistId,
    showChart,
    handleSubmit,
    error,
  };
}
