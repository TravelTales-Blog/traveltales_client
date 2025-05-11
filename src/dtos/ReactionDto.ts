export interface ReactionResult {
  action: "added" | "removed" | "updated";
  type: "like" | "dislike";
}

export type ReactionType = 'like' | 'dislike';

export interface Counts {
  like: number;
  dislike: number;
}
