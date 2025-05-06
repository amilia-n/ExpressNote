import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL =
    import.meta.env.MODE === "production"
      ? "https://expressnote.onrender.com"
      : "http://localhost:3000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching profile with token:", token);

        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Raw response data:", data);

        setProfile(data.user || {});
        if (data.notes) {
          console.log("Setting notes:", data.notes);
          setNotes(data.notes);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [API_URL]); // Remove notes from dependencies

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleCreateNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/notes/newnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ title: "New Note" }),
      });

      if (response.ok) {
        navigate(`/notes/newnote`);
      }
    } catch {
      setError("Failed to create note");
    }
  };

  const handleEditProfile = async () => {
    const newDisplayName = prompt("Enter new display name:");
    if (newDisplayName) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/auth/profile/display-name`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ display_name: newDisplayName }),
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile((prev) => ({
            ...prev,
            display_name: updatedProfile.display_name,
          }));
        }
      } catch {
        setError("Failed to update profile");
      }
    }
  };



  const handleDeleteNote = async (noteId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this note? You cannot undo this action"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Deleting note:", noteId);
      console.log("Token:", token);

      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to delete note: ${errorData.error || response.status}`
        );
      }

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.note_id !== noteId)
      );
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex-wrap profile-container">
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3 place-items-center">
              <div className="bg-white shadow rounded-lg p-6 profile-box">
                <div className="flex flex-col items-center">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                    </div>
                  </div>
                  <h1 className="text-xl font-bold">
                    {profile?.display_name || "User"}
                  </h1>
                  <p className="text-gray-700">{profile?.email}</p>
                  <p className="text-gray-700">
                    Joined{" "}
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : ""}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <a
                      href="#"
                      className="py-2 px-4 edit-profile"
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </a>
                  </div>
                </div>
              </div>
              <button
                className="btn creation-btn place-items-center"
                onClick={handleCreateNote}
              >
                CREATE A NEW NOTE
              </button>
            </div>

            <div className="col-span-4 sm:col-span-9 ">
              <div className="absolute bg-white shadow rounded-lg p-6 flex-wrap all-notes-container">
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    {isLoading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    {!isLoading && !error && (
                      <div>
                        {notes.length === 0 ? (
                          <div>No notes found.</div>
                        ) : (
                          <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 all-notes-card">
                            {notes.map((note) => (
                              <li key={note.note_id}>
                                {/* Display note info and link to open it */}
                                <span>{note.title}</span>
                                <button
                                  onClick={() =>
                                    navigate(`/notes/${note.note_id}`)
                                  }
                                >
                                  Open
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.note_id)}
                                >
                                  Delete Note
                                </button>
                              </li>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
