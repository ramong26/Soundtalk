import { CreateCommentBody, UpdateCommentBody } from '@/shared/types/api/CreateCommentBody';
import callApi from '@/shared/hooks/callApi';

import { Comment } from '@/shared/types/comment';

// POST: 댓글 생성
const postComments = async (body: CreateCommentBody): Promise<Comment | undefined> => {
  try {
    const response = await callApi<Comment>(`/api/comments`, {
      method: 'POST',

      body: JSON.stringify(body),
    });
    return response;
  } catch (err) {
    console.error('댓글 등록 실패:', err);
    throw new Error('로그인 상태가 아닙니다');
  }
};

// GET: 댓글 목록 조회 (무한 스크롤)
const getComments = async (trackId: number | string): Promise<Comment[] | undefined> => {
  try {
    const url = `/api/comments?trackId=${trackId}`;

    const response = await callApi<{ comments: Comment[] }>(url, {
      method: 'GET',
      credentials: 'include',
    });

    return response?.comments || [];
  } catch (err) {
    console.error('댓글 목록 조회 실패:', err);
    throw new Error('댓글 목록 조회 실패');
  }
};

// PUT: 댓글 수정
const putComments = async (commentId: number | string, body: UpdateCommentBody): Promise<Comment | undefined> => {
  try {
    const response = await callApi<Comment>(`/api/comments/${commentId}`, {
      method: 'PUT',

      body: JSON.stringify({ text: body.text }),
    });
    return response;
  } catch (err) {
    console.error('댓글 수정 실패:', err);
    throw new Error('댓글 수정 실패');
  }
};

// DELETE: 댓글 삭제
const deleteComments = async (commentId: number | string): Promise<void | undefined> => {
  try {
    const response = await callApi<void>(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });

    return response;
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
    throw new Error('댓글 삭제 실패');
  }
};

export const commentsService = {
  postComments,
  getComments,
  putComments,
  deleteComments,
};
