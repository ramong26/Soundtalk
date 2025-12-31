'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TrackItem } from '@/shared/types/spotifyTrack';

interface Props {
  tracksList: TrackItem[];
}

export default function IframeYoutube({ tracksList }: Props) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      if (!tracksList || tracksList.length === 0) return;

      const track = tracksList[0].track;
      const params = new URLSearchParams({
        artist: track.artists[0].name,
        track: track.name,
        album: track.album.name,
      });

      try {
        const res = await fetch(`/api/google-api/youtube/check-embeddable?${params.toString()}`);
        const data = await res.json();
        if (res.ok && data.videoId) {
          setVideoId(data.videoId);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('YouTube API 요청 실패:', err);
        setError(true);
      }
    }

    fetchVideo();
  }, [tracksList]);

  if (error || !videoId) {
    if (!tracksList || tracksList.length === 0) {
      return <div>⚠️ 트랙 정보가 없습니다.</div>;
    }
    return (
      <div>
        ⚠️ 유튜브에서 영상이 재생되지 않습니다. <br />
        <Link
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
            tracksList[0].track.artists[0].name + ' ' + tracksList[0].track.name + ' official music video'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          YouTube에서 직접 보기
        </Link>
      </div>
    );
  }

  return (
    <iframe
      width="100%"
      height="600"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="lg:h-[600px] md:h-[300px] h-[200px]  "
    />
  );
}
