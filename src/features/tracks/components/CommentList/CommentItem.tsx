'use client';
import { useState } from 'react';
import Image from 'next/image';

import useUserStore from '@/stores/userStore';
import { CommentItemProps } from './types';
import { formatDate } from '@/lib/utils/date';

export default function CommentItem({ comment, onDelete, onEdit }: CommentItemProps) {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);

  const handleSave = (newText: string) => {
    onEdit(comment._id, newText);
    setIsEditing(false);
  };

  const commentUserId = typeof comment.userId === 'string' ? comment.userId : comment.userId?._id;
  const isMyComment = user?.id === commentUserId;

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
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-1 rounded flex-1"
          />
          <button onClick={() => handleSave(text)} className="text-blue-500 hover:underline cursor-pointer">
            저장
          </button>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:underline cursor-pointer">
            취소
          </button>
        </div>
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
