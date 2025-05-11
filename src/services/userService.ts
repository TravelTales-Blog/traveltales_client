import type { User } from "../dtos/UserDto";

const API_BASE = "http://localhost:3000/api/user";

const userService = {
  findUserById: async (userId: string): Promise<User> => {
    const url = new URL(`${API_BASE}/getUser/userId`);
    url.searchParams.append("userId", userId);

    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch user");
    }
    return data as User;
  },

};

export default userService;
