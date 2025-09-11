'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import SubmitInput from '@/shared/components/SubmitInput';
import useTrackComments from '@/features/tracks/hooks/TrackComments/useTrackComments';
import TrackCommentsSkeleton from './TrackCommentsSkeleton';
import { useTrackStore } from '@/stores/trackStore';

const CommentList = dynamic(() => import('@/features/tracks/components/CommentList'), {
  ssr: false,
  loading: () => <TrackCommentsSkeleton />,
});

export default function TrackComments() {
  const { trackId } = useTrackStore();
  const { comments, setComments, submitComment, setSubmitComment, handleSubmit } = useTrackComments(
    trackId ?? ''
  );
  // console.log('comments', comments);
  return (
    <div className="relative border-4 border-black bg-[#FFFDF6] rounded-xl shadow-[6px_6px_0px_#D65361] p-6 mt-12">
      {/* 플로팅 라벨 */}
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-1 rounded-md border-2 border-white font-bold text-xl shadow-[3px_3px_0px_#FFD460]">
        TRACK COMMENTS
      </span>

      {/* 헤더 */}
      <div className="flex flex-col gap-2 mb-6 text-center">
        <h2 className="text-2xl font-extrabold uppercase">트랙 댓글</h2>
        <Link
          href={`/tracks/${trackId}/interview`}
          className="text-[#D65361] hover:underline font-bold"
        >
          🎤 인터뷰 페이지로 이동
        </Link>
      </div>

      {/* 입력창 */}
      <div className="mb-6">
        <SubmitInput
          placeholder="댓글을 입력하세요"
          onChange={(e) => setSubmitComment(e.target.value)}
          onSubmit={handleSubmit}
          value={submitComment}
        />
      </div>

      {/* 댓글 리스트 */}
      <div className="border-t-2 border-black pt-4">
        {!comments ? (
          <TrackCommentsSkeleton />
        ) : (
          <CommentList comments={comments} setComments={setComments} />
        )}
      </div>
    </div>
  );
}
