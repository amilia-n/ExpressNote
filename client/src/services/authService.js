
const API_URL =
import.meta.env.MODE === "production"
  ? "https://expressnote.onrender.com"
  : "http://localhost:3000";

export const authService = {
  login: async (email, password) => {
    console.log('Attempting login with:', { email, API_URL });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      console.log('Login response:', response);
      const data = await response.json();
      console.log('Login data:', data);
      if (!response.ok) throw new Error(data.error || "Login failed");
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Registration failed");
    return data;
  },

  getProfile: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch profile");
    return data;
  },

  updateProfile: async (profileData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update profile");
    return data;
  },
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error("Logout failed");
    return response.json();
  },
  googleLogin: () => {
    return `${API_URL}/auth/google`;
  }
};