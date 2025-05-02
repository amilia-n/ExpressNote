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
        console.log("Notes data:", data.notes);

        setProfile(data.user || {});
        setNotes(data.notes || []);
        console.log("Notes state after setting:", notes);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  // Add these functions in your UserProfile component
  const handleCreateNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: "New Note" }),
      });

      if (response.ok) {
        navigate(`/notes/`);
      }
    } catch (error) {
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
          body: JSON.stringify({ display_name: newDisplayName }),
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile((prev) => ({
            ...prev,
            display_name: updatedProfile.display_name,
          }));
        }
      } catch (error) {
        setError("Failed to update profile");
      }
    }
  };

  const handleEnterNote = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Update the notes state by filtering out the deleted note
        setNotes(prevNotes => prevNotes.filter(note => note.note_id !== noteId));
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (err) {
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
                {console.log("Rendering notes:", notes)}
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading notes...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Error: {error}</p>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No notes yet. Create your first note!
                    </p>
                  </div>
                ) : (
                  <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note, index) => {
                      console.log(`Rendering note ${index}:`, note);
                      return (
                        <div
                          key={note.note_id}
                          className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 all-notes-card"
                        >
                          <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-96 pdf-cover-container">
                            <img
                              src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                              alt="Note cover"
                              className="pdf-cover"
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                                {note.title || "Untitled Note"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => handleEnterNote(note.note_id)}
                              className="enter-btn align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                              type="button"
                            >
                              Enter Note
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.note_id)}
                              className="delete-btn justify-center select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                              type="button"
                            >
                              Delete Note
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
