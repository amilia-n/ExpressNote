const API_URL =
import.meta.env.MODE === "production"
  ? "https://expressnote.onrender.com"
  : "http://localhost:3000";

export const noteService = {
  getNote: async (noteId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch note");
    return response.json();
  },

  saveNote: async (noteId, data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save note");
    return response.json();
  },

  deleteNote: async (noteId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete note");
    return response.json();
  }
};