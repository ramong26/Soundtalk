import { Comment } from '@/shared/types/comment';

export interface CommentListProps {
  comments: Comment[] | null;
  setComments: React.Dispatch<React.SetStateAction<Comment[] | null>>;
}

export interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => Promise<void>;
  onEdit: (commentId: string, newText: string) => Promise<void>;
}
