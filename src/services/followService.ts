import { User } from "../dtos/UserDto";

const API_BASE = "http://localhost:3000/api/follow";

export const followService = {
  getNotFollowing: async (userId: string): Promise<User[]> => {
    const response = await fetch(
      `${API_BASE}/getNotFollowing?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch suggested users");
    }
    return data;
  },

  followUser: async (
    followerId: string,
    followeeId: string
  ): Promise<{ message: string }> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const url = new URL(`${API_BASE}/follow`);
    url.searchParams.append("followerId", followerId);
    url.searchParams.append("followeeId", followeeId);

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
      throw new Error(data.error || "Failed to follow user");
    }
    return data;
  },

  unfollowUser: async (
    followerId: string,
    followeeId: string
  ): Promise<{ message: string }> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const url = new URL(`${API_BASE}/unfollow`);
    url.searchParams.append("followerId", followerId);
    url.searchParams.append("followeeId", followeeId);

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
      throw new Error(data.error || "Failed to unfollow user");
    }
    return data;
  },

  getAllFollowers: async (userId: string): Promise<User[]> => {
    const response = await fetch(
      `${API_BASE}/getAllFollowers?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch followers");
    }
    return data;
  },

  getAllFollowing: async (userId: string): Promise<User[]> => {
    const response = await fetch(
      `${API_BASE}/getAllFollowees?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch following");
    }
    return data;
  },

  getCounts: async (
    userId: string
  ): Promise<{ followersCount: number; followingCount: number }> => {
    const response = await fetch(
      `${API_BASE}/getCounts?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch counts");
    }
    return data;
  },
};
