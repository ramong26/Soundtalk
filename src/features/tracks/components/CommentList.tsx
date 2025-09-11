'use client';
import { Comment } from '@/shared/types/comment';
import CommentItem from '@/features/tracks/components/CommentItem';
import useCommentAction from '../hooks/TrackComments/useCommentAction';

export default function CommentList({
  comments,
  setComments,
}: {
  comments: Comment[] | null;
  setComments: React.Dispatch<React.SetStateAction<Comment[] | null>>;
}) {
  // 댓글 수정과 삭제
  const { handleDelete, handleEdit } = useCommentAction({ setComments });

  return (
    <div className="mt-4">
      <h3 className="lg:text-lg md:text-md text-sm font-semibold mb-4">댓글 목록</h3>
      {comments?.length === 0 ? (
        <p className="text-center text-gray-600 text-4xl h-40 flex items-center justify-center">
          No Comments
        </p>
      ) : (
        <ul className="border-2 p-3 mb-10 space-y-4">
          {comments?.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
