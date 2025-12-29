'use client';
import { useState } from 'react';
import Image from 'next/image';

import { Comment } from '@/shared/types/comment';

import { formatDate } from '@/lib/utils/date';
import CommentEditInput from '@/features/tracks/components/CommentEditInput';
import useUserStore from '@/stores/userStore';

interface Props {
  comment: Comment;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export default function CommentItem({ comment, onDelete, onEdit }: Props) {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newText: string) => {
    onEdit(comment._id, newText);
    setIsEditing(false);
  };

  const commentUserId = typeof comment.userId === 'string' ? comment.userId : comment.userId?._id;
  const isMyComment = user?._id === commentUserId;

  return (
    <li className="border-2 border-black rounded-lg bg-white shadow-[4px_4px_0px_#FFD460] p-4 mb-4 ">
      {/* 유저 영역 */}
      <div className="flex items-center gap-3 border-b-2 border-black/20 pb-2">
        <Image
          width={40}
          height={40}
          src={
            typeof comment.userId === 'object' && comment.userId?.profileImageUrl
              ? comment.userId.profileImageUrl
              : user?.profileImageUrl || '/default-profile.png'
          }
          alt="사용자 프로필 이미지"
          className="w-10 h-10 rounded-full border-2 border-black"
        />
        <span className="lg:text-lg md:text-md text-base font-bold ">
          {comment?.userId?.displayName || 'Anonymous'}
        </span>
      </div>

      {/* 댓글 내용 */}
      {!isEditing ? (
        <p className="lg:text-base md:text-sm text-xs mt-3 text-gray-800">{comment.text}</p>
      ) : (
        <CommentEditInput initialValue={comment.text} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      )}

      {/* 푸터 */}
      <div className="md:text-sm text-xs text-gray-600 mt-3 flex items-center justify-between">
        <span>{formatDate(comment.createdAt)}</span>
        {isMyComment && !isEditing && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 rounded-md bg-[#FFD460] text-black font-bold hover:bg-black hover:text-white transition"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(comment._id)}
              className="px-2 py-1 rounded-md bg-[#D65361] text-white font-bold hover:bg-black hover:text-white transition"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
