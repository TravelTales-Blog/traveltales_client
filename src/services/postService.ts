import { Post } from "../dtos/PostDto";

const API_BASE = "http://localhost:3000/api/post";

export const postService = {
  getAllPosts: async (): Promise<Post[]> => {

    const response = await fetch(`${API_BASE}/getAllPosts`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch posts");
    }
    return data;
  },

  getPostByPostId: async (postId: string): Promise<Post> => {
    const jwt = sessionStorage.getItem("jwtToken");
    if (!jwt) {
      throw new Error("JWT token not found");
    }

    const response = await fetch(
      `${API_BASE}/getPostByPostId?postId=${encodeURIComponent(postId)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch post");
    }
    return data;
  },

  filterPosts: async (opts: {
    country?: string;
    author?: string;
    page?: number;
    limit?: number;
  }): Promise<{ posts: Post[]; page: number }> => {

    const params = new URLSearchParams();
    if (opts.country) params.append("country", opts.country);
    if (opts.author)  params.append("author", opts.author);
    if (opts.page  !== undefined) params.append("page",  opts.page.toString());
    if (opts.limit !== undefined) params.append("limit", opts.limit.toString());

    const response = await fetch(
      `${API_BASE}/filterPost?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to filter posts");
    }
    return data;
  },

  createPost: async (post: Post): Promise<Post> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const response = await fetch(`${API_BASE}/createPost`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(post),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to create post");
    }
    return data;
  },

  updatePost: async (post: Post): Promise<Post> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const response = await fetch(`${API_BASE}/updatePost`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(post),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update post");
    }
    return data;
  },

  deletePost: async (postId: string): Promise<{ message: string }> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const response = await fetch(
      `${API_BASE}/deletePost?postId=${encodeURIComponent(postId)}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "X-CSRF-Token": csrfToken,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to delete post");
    }
    return data;
  },

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    const url = new URL(`${API_BASE}/getPostByUserId`);
    url.searchParams.append("userId", userId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user's posts");
    }
    return data as Post[];
  },

  getPostOfFollows: async (userId: string): Promise<Post[]> => {
    const url = new URL(`${API_BASE}/getPostOfFollows`);
    url.searchParams.append("userId", userId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user's posts");
    }
    return data as Post[];
  },
};
