import { ReactionResult, Counts, ReactionType } from "../dtos/ReactionDto";

const API_BASE = "http://localhost:3000/api/react";

export const reactionService = {
  react: async (
    userId: string,
    postId: string,
    type: "like" | "dislike"
  ): Promise<ReactionResult> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const url = new URL(`${API_BASE}/react`);
    url.searchParams.append("userId", userId);
    url.searchParams.append("postId", postId);
    url.searchParams.append("type", type);

    const response = await fetch(url.toString(), {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "X-CSRF-Token": csrfToken,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to submit reaction");
    }
    return data;
  },

  undoReact: async (
    userId: string,
    postId: string
  ): Promise<{ message: string }> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const url = new URL(`${API_BASE}/undoReact`);
    url.searchParams.append("userId", userId);
    url.searchParams.append("postId", postId);

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
      throw new Error(data.error || "Failed to undo reaction");
    }
    return data;
  },

  getCount: async (postId: string): Promise<Counts> => {
    const url = new URL(`${API_BASE}/getCount`);
    url.searchParams.append("postId", postId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch reaction counts");
    }
    return data;
  },

  getUserReaction: async (userId: string, postId: string): Promise<ReactionType | null> => {
    const jwt = sessionStorage.getItem("jwtToken");
    if (!jwt) throw new Error("Missing JWT");
    const url = new URL(`${API_BASE}/getUserReaction`);
    url.searchParams.append("userId", userId);
    url.searchParams.append("postId", postId);

    const resp = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || "Failed to fetch user reaction");
    return data.reaction;
  },
};
