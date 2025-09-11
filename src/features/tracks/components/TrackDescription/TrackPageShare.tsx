'use client';
import Image from 'next/image';

import ShareIcon from '@/public/image/share-icon.png';

export default function TrackPageShare() {
  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
      })
      .catch((error) => {
        console.error('링크 복사 실패:', error);
        alert('링크 복사에 실패했습니다.');
      });
  };

  return (
    <div className="cursor-pointer" onClick={handleCopyLink}>
      <Image
        src={ShareIcon}
        alt="Share"
        width={36}
        height={36}
        className="lg:w-[36px] md:w-[30px] w-[24px] lg:h-[36px] md:h-[30px] h-[24px] "
      />
    </div>
  );
}
