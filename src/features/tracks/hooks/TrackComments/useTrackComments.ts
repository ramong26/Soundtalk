import { useEffect, useState } from 'react';

import { commentsService } from '@/service/commentService';
import { Comment } from '@/shared/types/comment';

export default function useTrackComments(trackId: string) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [submitComment, setSubmitComment] = useState('');

  // 트랙 ID가 바뀔 때마다 댓글 목록을 불러옴
  useEffect(() => {
    (async () => {
      try {
        const res = await commentsService.getComments(trackId);

        if (res && Array.isArray(res)) {
          setComments(res);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error('댓글 목록 조회 실패:', error);
      }
    })();
  }, [trackId]);

  console.log('useTrackComments comments', comments);

  // 댓글 제출 핸들러
  const handleSubmit = async (value: string) => {
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
        _id: 'temp-user',
        displayName: '익명',
        profileImageUrl: '',
      },
    };
    setComments((prev) => [...(prev ?? []), tempComment]);
    setSubmitComment('');

    try {
      const res = await commentsService.postComments({
        trackId,
        text: value.trim(),
      });

      if (!res) throw new Error('댓글 저장 실패');

      const savedComment: Comment = res as Comment;

      setComments((prev) => (prev ?? []).map((c) => (c._id === tempId ? savedComment : c)));
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      setComments((prev) => (prev ?? []).filter((c) => c._id !== tempId));
    }
  };

  return {
    comments,
    setComments,
    submitComment,
    setSubmitComment,
    handleSubmit,
  };
}
