import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState({});

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

        const notesWithDescriptions = data.notes.map((note) => ({
          ...note,
          description: note.description || "",
        }));

        setProfile(data.user || {});
        setNotes(notesWithDescriptions);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [API_URL]);

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
        credentials: "include",
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

  const handleDescriptionChange = async (noteId, description) => {
    try {
      const token = localStorage.getItem("token");
      console.log('Saving description:', { noteId, description, token });
      
      const response = await fetch(
        `${API_URL}/api/notes/${noteId}/description`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ description }),
        }
      );
  
      console.log('Save response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        setUnsavedChanges((prev) => ({
          ...prev,
          [noteId]: "error",
        }));
        return;
      }
  
      const data = await response.json();
      console.log('Save response data:', data);
      
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.note_id === noteId
            ? { ...note, description: data.description }
            : note
        )
      );
      setUnsavedChanges((prev) => ({
        ...prev,
        [noteId]: "saved",
      }));
    } catch (err) {
      console.error('Save error:', err);
      setUnsavedChanges((prev) => ({
        ...prev,
        [noteId]: "error",
      }));
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
      <div className="absolute profile-container">
        <div>
          <div className="bg-white shadow rounded-lg p-6 profile-box">
            <div className="flex flex-col items-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>
              <div className="inline-flex m-2">
                <h1 className="text-xl font-bold">
                  {profile?.display_name || "User"}
                </h1>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4.5 m-1 edit-name"
                  onClick={handleEditProfile}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>
              <div className="mt-6 flex flex-wrap gap-4"></div>
              <p className="text-gray-700">{profile?.email}</p>
              <p className="text-gray-700">
                Joined{" "}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>
          <button
            className="btn creation-btn place-items-center"
            onClick={handleCreateNote}
          >
            CREATE A NEW NOTE
          </button>
        </div>

        <div className="flex relative all-notes-container">
          <div className="flex w-full flex-col">
            <div>
              {isLoading && <div>Loading...</div>}
              {error && <div>Error: {error}</div>}
              {!isLoading && !error && (
                <div>
                  {notes.length === 0 ? (
                    <div>No notes found.</div>
                  ) : (
                    <div className="flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 all-notes-card">
                      {notes.map((note) => (
                        <ul key={note.note_id}>
                          <div className="flex-row">
                            <div className="flex-col bg-base-300 rounded-box justify-start p-3">
                              {note.title}
                              <div className="text-xs uppercase font-semibold opacity-60 descript">
                                <div className="flex justify-end mb-1">
                                  <button
                                    onClick={() =>
                                      handleDescriptionChange(
                                        note.note_id,
                                        note.description || ""
                                      )
                                    }
                                    className={`save-description-btn ${
                                      unsavedChanges[note.note_id] === true
                                        ? "unsaved"
                                        : unsavedChanges[note.note_id] ===
                                          "saved"
                                        ? "saved"
                                        : unsavedChanges[note.note_id] ===
                                          "error"
                                        ? "error"
                                        : ""
                                    }`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m4.5 12.75 6 6 9-13.5"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <textarea
                                  className="textarea textarea-bordered w-full min-h-[2rem] resize-none overflow-hidden"
                                  placeholder="Add a description..."
                                  value={note.description || ""}
                                  onChange={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                      e.target.scrollHeight + "px";
                                    setNotes((prevNotes) =>
                                      prevNotes.map((n) =>
                                        n.note_id === note.note_id
                                          ? {
                                              ...n,
                                              description: e.target.value,
                                            }
                                          : n
                                      )
                                    );
                                    setUnsavedChanges((prev) => ({
                                      ...prev,
                                      [note.note_id]: true,
                                    }));
                                  }}
                                  onInput={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                      e.target.scrollHeight + "px";
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between m-5">
                              <button
                                onClick={() => handleDeleteNote(note.note_id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6 delete-btn"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/notes/${note.note_id}`)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6 enter-btn"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="divider"></div>
                        </ul>
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
  );
};

export default UserProfile;
