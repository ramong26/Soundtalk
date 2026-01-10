'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Comment } from '@/shared/types/comment';
import { TrackItem } from '@/shared/types/spotifyTrack';
import { commentsService } from '@/service/commentService';
import { TrackClientProps } from './types';

import SubmitInput from '@/shared/components/SubmitInput';
import ImportTrack from '@/features/playlist/components/ImportTrack';
import TrackCommentsSkeleton from '@/features/tracks/components/TrackClient/TrackCommentsSkeleton';
import CommentItem from '@/features/tracks/components/CommentItem';

export default function TrackClient({ album, trackId }: TrackClientProps) {
  const trackItems: TrackItem[] = album.tracks.items.map((item) => ({
    track: {
      ...item,
      album: album,
    },
  }));

  // 댓글 목록 조회
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['track-comments', trackId],
    queryFn: async () => {
      const res = await commentsService.getComments(trackId);
      return res || [];
    },
  });

  // 댓글 SubmitInput 및 댓글 목록 상태 관리
  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState('');

  const handleSubmit = useCallback(
    async (value: string) => {
      if (!value.trim()) {
        console.error('댓글 내용이 비어있습니다');
        return;
      }
      const tempId = 'temp-' + Date.now();
      const tempComment: Comment = {
        _id: tempId,
        trackId,
        text: value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: {
          _id: user?.id ?? 'temp-user',
          displayName: user?.displayName ?? '익명',
          profileImageUrl: user?.profileImageUrl ?? '',
        },
      };
      queryClient.setQueryData<Comment[]>(['track-comments', trackId], (oldComments) => [
        tempComment,
        ...(oldComments ?? []),
      ]);

      setCommentInput('');

      try {
        const res = await commentsService.postComments({
          trackId,
          text: value.trim(),
        });

        if (!res) throw new Error('댓글 저장 실패');

        const savedComment: Comment = res as Comment;
        queryClient.setQueryData<Comment[]>(['track-comments', trackId], (oldComments) =>
          (oldComments ?? []).map((comment) => (comment._id === tempId ? savedComment : comment))
        );
      } catch (err) {
        console.error('댓글 등록 실패:', err);
        queryClient.setQueryData<Comment[]>(['track-comments', trackId], (oldComments) =>
          (oldComments ?? []).filter((comment) => comment._id !== tempId)
        );
      }
    },
    [trackId, queryClient]
  );

  // CommentItem 삭제 및 수정 핸들러
  const handleDelete = useCallback(
    async (commentId: string) => {
      queryClient.setQueryData<Comment[]>(['track-comments', trackId], (oldComments) =>
        (oldComments ?? []).filter((c) => c._id !== commentId)
      );

      try {
        await commentsService.deleteComments(commentId);
      } catch (err) {
        questionClient.setQueryData<Comment[]>(['track-comments', trackId], (oldComments) => {
          if (deletedComment) {
            return [...(oldComments ?? []), deletedComment];
          }
          return oldComments ?? [];
        });
        console.error(err);
        queryClient.invalidateQueries({ queryKey: ['track-comments', trackId] });
      }
    },
    [queryClient, trackId]
  );

  const handleEdit = useCallback(
    async (commentId: string, newText: string) => {
      queryClient.setQueryData<Comment[]>(['track-comments', trackId], (old: Comment[] = []) =>
        old.map((c) => (c._id === commentId ? { ...c, text: newText, updatedAt: new Date().toISOString() } : c))
      );

      try {
        await commentsService.putComments(commentId, { text: newText });
      } catch (err) {
        queryClient.setQueryData<Comment[]>(['track-comments', trackId], (old = []) =>
          prevComment ? old.map((c) => (c._id === commentId ? prevComment! : c)) : old
        );
        console.error(err);
        queryClient.invalidateQueries({ queryKey: ['track-comments', trackId] });
      }
    },
    [queryClient, trackId]
  );

  return (
    <>
      <ImportTrack tracksList={trackItems} link={true} />

      {/* 댓글 */}
      <div className="relative border-4 border-black bg-[#FFFDF6] rounded-xl shadow-[6px_6px_0px_#D65361] p-6 mt-12">
        <span className="lg:text-xl md:text-lg text-base lg:w-[250px] md:w-[200px] w-[180px] flex items-center justify-center absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-1 rounded-md border-2 border-white font-bold shadow-[3px_3px_0px_#FFD460]">
          TRACK COMMENTS
        </span>

        <div className="flex flex-col gap-2 mb-6 text-center">
          <Link
            href={`/tracks/${trackId}/interview`}
            className="lg:text-lg md:text-md text-sm text-[#D65361] hover:underline font-bold"
          >
            🎤 해당 아티스트 인터뷰 페이지로 이동
          </Link>
        </div>

        <div className="mb-6">
          <SubmitInput
            placeholder="댓글을 입력하세요"
            onSubmit={handleSubmit}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
        </div>

        <div className="border-t-2 border-black">
          {isLoading ? (
            <TrackCommentsSkeleton />
          ) : (
            <div className="mt-4">
              <h3 className="lg:text-lg md:text-md text-sm font-semibold mb-4">댓글 목록</h3>
              {commentsData && commentsData.length > 0 ? (
                <ul className="border-2 p-3 mb-10 space-y-4">
                  {commentsData.map((comment: Comment) => (
                    <CommentItem key={comment._id} comment={comment} onDelete={handleDelete} onEdit={handleEdit} />
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600 text-4xl h-40 flex items-center justify-center">
                  아직 등록된 댓글이 없습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
