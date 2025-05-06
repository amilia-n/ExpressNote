import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import NoteContainer from "../components/NoteContainer";
import { LeftUtilityButtons, RightUtilityButtons } from "../components/UtilityButtons";
// import { noteService } from '../services/noteService';

const ExistingNote = () => {
  const { noteId } = useParams();
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    import.meta.env.MODE === "production"
      ? "https://expressnote.onrender.com"
      : "http://localhost:3000";

// useEffect(() => {
//     const fetchNote = async () => {
//       try {
//         const data = await noteService.getNote(noteId);
//         setNoteData(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNote();
//   }, [noteId]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
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
    <>
      <Navbar />
      <NoteContainer
        noteData={noteData}
        LeftColButtons={<LeftUtilityButtons noteData={noteData} />}
        RightColButtons={<RightUtilityButtons noteData={noteData} />}
      />
    </>
  );
};

export default ExistingNote;