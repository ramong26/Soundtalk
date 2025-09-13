'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { StaticImageData } from 'next/dist/shared/lib/image-external';

import { formatDate } from '@/lib/utils/date';
import { CustomSearchResult } from '@/features/tracks/types/custom-search';

import ComplexLogo from '@/public/image/complex-logo.png';
import BillboardLogo from '@/public/image/billboard-logo.png';
import RollingStoneLogo from '@/public/image/rollingstone-logo.png';
import YoutubeLogo from '@/public/image/youtube-logo.png';

export default function ArtistInterviewComponent({
  artistInterview,
}: {
  artistInterview: CustomSearchResult | null;
}) {
  const [interviewPageLogo, setInterviewPageLogo] = useState<StaticImageData | null>(null);
  const [interviewPageName, setInterviewPageName] = useState<string | null>(null);

  const interviewLogo = artistInterview?.displayLink;
  let publishedTime;
  if (typeof artistInterview?.snippet !== 'string') {
    publishedTime =
      artistInterview?.pagemap?.metatags?.[0]?.['article:published_time'] ||
      artistInterview?.snippet?.publishedAt;
  } else {
    publishedTime =
      artistInterview?.pagemap?.metatags?.[0]?.['article:published_time'] ||
      artistInterview?.snippet;
  }

  useEffect(() => {
    switch (interviewLogo) {
      case 'www.rollingstone.com':
        setInterviewPageLogo(RollingStoneLogo);
        setInterviewPageName('Rolling Stone');
        break;
      case 'www.billboard.com':
        setInterviewPageLogo(BillboardLogo);
        setInterviewPageName('Billboard');
        break;
      case 'www.youtube.com':
        setInterviewPageLogo(YoutubeLogo);
        setInterviewPageName('YouTube');
        break;
      case 'www.complex.com':
        setInterviewPageLogo(ComplexLogo);
        setInterviewPageName('Complex');
        break;
      default:
        setInterviewPageLogo(null);
        setInterviewPageName(null);
    }
  }, [interviewLogo]);

  if (!artistInterview) {
    return (
      <div className="text-center mt-8 p-4 border-4 border-black bg-[#fff8e1] font-bold text-red-600">
        인터뷰 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <section className="flex items-center gap-6 mb-6 p-6 bg-[#fffaf0] border-4 border-black rounded-md shadow-[4px_4px_0px_#000]">
      {/* 로고 + 출처 */}
      <Link
        href={artistInterview?.link || '#'}
        className="flex items-center justify-between w-full text-center "
      >
        <div className="flex flex-col items-center mr-4">
          <Image
            src={interviewPageLogo || '/default-logo.png'}
            alt="Artist Interview Logo"
            width={70}
            height={70}
            className="lg:w-[70px] w-[50px] lg:h-[70px] h-[50px] rounded-full border-2 border-black object-cover"
          />
          <div className="mt-2 text-xs font-bold uppercase tracking-wide text-white bg-[#D43C3C] border border-black px-2 py-1">
            {interviewPageName || 'Unknown'}
          </div>
        </div>
        {/* 인터뷰 제목 */}
        <p className="lg:text-xl md:text-lg text-base flex-1  font-extrabold text-black text-center leading-snug">
          {artistInterview?.title}
        </p>

        {/* 링크 + 날짜 */}
        <div className="md:flex flex-col items-center text-sm w-[200px] hidden">
          <div className="lg:text-md md:text-sm text-xs font-bold text-black hover:underline hover:text-blue-800 uppercase border-2 border-black px-3 py-1 bg-[#FFD460] shadow-[2px_2px_0px_#000]">
            인터뷰 보기
          </div>
          <span className="lg:text-md md:text-sm text-xs mt-2 text-gray-700 italic">
            {publishedTime ? formatDate(publishedTime) : '날짜 정보 없음'}
          </span>
        </div>
      </Link>
    </section>
  );
}
