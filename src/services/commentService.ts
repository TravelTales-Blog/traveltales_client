import type { Comment } from "../dtos/CommentDto";

const API_BASE = "http://localhost:3000/api/comment";

export const commentService = {
  createComment: async (
    userId: string,
    postId: string,
    comment: string
  ): Promise<Comment> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const response = await fetch(`${API_BASE}/createComment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ userId, postId, comment }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to create comment");
    }
    return data as Comment;
  },

  getCommentById: async (commentId: string): Promise<Comment> => {
    const jwt = sessionStorage.getItem("jwtToken");
    if (!jwt) throw new Error("Missing authentication token.");
    const url = new URL(`${API_BASE}/getCommentById`);
    url.searchParams.append("commentId", commentId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch comment");
    }
    return data as Comment;
  },

  updateComment: async (
    commentId: string,
    comment: string
  ): Promise<Comment> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const response = await fetch(`${API_BASE}/updateComment`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ commentId, comment }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update comment");
    }
    return data as Comment;
  },

  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const url = new URL(`${API_BASE}/deleteComment`);
    url.searchParams.append("commentId", commentId);

    const response = await fetch(url.toString(), {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "X-CSRF-Token": csrfToken,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to delete comment");
    }
    return data;
  },

  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    const jwt = sessionStorage.getItem("jwtToken");
    if (!jwt) throw new Error("Missing authentication token.");
    const url = new URL(`${API_BASE}/getCommentsByPostId`);
    url.searchParams.append("postId", postId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch comments");
    }
    return data as Comment[];
  },

  getCommentCount: async (postId: string): Promise<number> => {
    const jwt = sessionStorage.getItem("jwtToken");
    if (!jwt) throw new Error("Missing authentication token.");
    const url = new URL(`${API_BASE}/getCount`);
    url.searchParams.append("postId", postId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch comment count");
    }
    return data.count ?? 0;
  },
};
