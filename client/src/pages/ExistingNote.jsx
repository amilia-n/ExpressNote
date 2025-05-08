import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import NoteContainer from "../components/NoteContainer";
import { LeftUtilityButtons } from "../components/UtilityButtons";

const ExistingNote = () => {
  const { noteId } = useParams();
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    import.meta.env.MODE === "production"
      ? "https://expressnote.onrender.com"
      : "http://localhost:3000";

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch note");
        const data = await response.json();
        setNoteData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();

    
  }, [API_URL, noteId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <NoteContainer
      noteData={noteData}
    />
  );
};

export default ExistingNote;