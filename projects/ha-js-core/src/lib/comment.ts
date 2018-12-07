export interface CommentData {
  readonly authorName: string;
  readonly positive: string | null;
  readonly negative: string | null;
  readonly comment: string | null;
}

export interface Comment extends CommentData {
  readonly $id: string;
}
