'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

import { Track } from '@/shared/types/spotifyTrack';
import { getSpotifyUserAccessToken } from '@/shared/hooks/getSpotifyUserToken';

export default function Miniplayer({ track }: { track: Track }) {
  const [paused, setPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(track);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Spotify Player 핸들
  const initializePlayer = async () => {
    const accessToken = await getSpotifyUserAccessToken();

    if (!accessToken) {
      alert('Spotify 프리미엄 계정이 필요합니다.');
      return;
    }

    if (!window.Spotify && !document.getElementById('spotify-sdk')) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);

      await new Promise<void>((resolve) => {
        window.onSpotifyWebPlaybackSDKReady = () => resolve();
      });
    }

    const spotifyPlayer = new Spotify.Player({
      name: 'Web Playback SDK',
      getOAuthToken: (cb) => cb(accessToken),
      volume: 0.5,
    });

    spotifyPlayer.addListener('ready', ({ device_id }) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [`spotify:track:${track.id}`],
        }),
      }).catch(console.error);
    });

    spotifyPlayer.addListener('player_state_changed', (state) => {
      if (!state) return;
      setPaused(state.paused);
      setCurrentTrack(state.track_window.current_track as unknown as Track);
    });

    spotifyPlayer.connect();
    setPlayer(spotifyPlayer);
    setInitialized(true);
  };

  // 재생/일시정지 핸들
  const handlePlayClick = () => {
    if (!initialized) {
      initializePlayer();
    } else {
      player?.togglePlay();
    }
  };

  // 컴포넌트 언마운트 시 플레이어 연결 해제
  useEffect(() => {
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [player]);

  return (
    <div className="w-full flex items-center justify-between bg-[#F0EADC] border-[2px] border-[#111] shadow-[2px_2px_0_#e2c781] px-5 py-4">
      <div className="flex items-center">
        <div className="rounded-[6px] border-[2px] border-[#111] bg-white mr-3 overflow-hidden w-[50px] h-[44px] flex items-center justify-center">
          <Image
            src={currentTrack?.album?.images[1]?.url}
            alt="Album Art"
            width={50}
            height={50}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center ml-2">
          <span className="text-[1.06rem] font-extrabold uppercase tracking-wide leading-tight text-[#111] font-['Oswald','Arial','sans-serif']">
            {currentTrack?.name}
          </span>
          <span className="text-[0.93rem] text-[#c9a13a] font-semibold leading-tight font-['Oswald','Arial','sans-serif']">
            {currentTrack?.artists[0]?.name}
          </span>
        </div>
      </div>
      <button
        onClick={handlePlayClick}
        className="mr-[8px] cursor-pointer w-10 h-10 flex items-center justify-center text-[#111] bg-[#FFD460] border-[2px] border-[#111] rounded-full shadow-[1px_1px_0_#e2c781] hover:bg-[#d5ac3d] transition-all"
        aria-label={paused ? '재생' : '일시정지'}
      >
        {paused ? <FaPlay className="w-5 h-5" /> : <FaPause className="w-5 h-5" />}
      </button>
    </div>
  );
}
