export interface Comment {
  _id: string;
  userId: {
    _id: string;
    displayName: string;
    profileImageUrl: string;
  };
  trackId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateRequest {
  trackId: string;
  text: string;
}
