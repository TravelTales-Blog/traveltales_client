const API_BASE = "http://localhost:3000/api/upload";

export const imageService = {
  uploadImage: async (file: File): Promise<string> => {
    const jwt = sessionStorage.getItem("jwtToken");
    const csrfToken = sessionStorage.getItem("csrfToken");
    if (!jwt || !csrfToken) {
      throw new Error("Missing authentication token or CSRF token.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE}/image`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "X-CSRF-Token": csrfToken,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to upload image");
    }
    return data.image_url as string;
  },
};
