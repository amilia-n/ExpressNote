import React, { useState, useCallback, useEffect } from "react";
import TextEditor from "./TextEditor";
import { debounce } from "lodash";
import "./NoteContainer.css";

const initialEditorContent = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function NoteContainer() {
  const [editors, setEditors] = useState([
    {
      id: "text-1",
      noteId: null,
      type: "text",
      position: { x: 20, y: 20 },
      content: initialEditorContent,
      title: "Untitled Note",
    },
  ]);
  const [saveStatus, setSaveStatus] = useState("saved");


  const handleContentChange = useCallback((editorId, newContent) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId ? { ...editor, content: newContent } : editor
      )
    );
    setSaveStatus("unsaved");
  }, []);

  const handleTitleChange = useCallback((editorId, newTitle) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId ? { ...editor, title: newTitle } : editor
      )
    );
    setSaveStatus("unsaved");
  }, []);

  const handleAddEditor = () => {
    const newEditor = {
      id: `text-${Date.now()}`,
      noteId: null,
      type: "text",
      position: { x: 20, y: 20 },
      content: initialEditorContent,
      title: "Untitled Note",
    };
    setEditors((prev) => [...prev, newEditor]);
  };

  const saveToDatabase = async (data) => {
    try {
      const noteData = {
        title: data.title,
        content: JSON.stringify(data.content),
      };

      let response;
      if (data.noteId) {
        response = await fetch(`http://localhost:3000/notes/${data.noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(noteData),
        });
      } else {
        response = await fetch("http://localhost:3000/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(noteData),
        });
      }
      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const savedNote = await response.json();
      if (!data.noteId) {
        setEditors((prev) =>
          prev.map((editor) =>
            editor.id === data.id
              ? { ...editor, noteId: savedNote.note_id }
              : editor
          )
        );
      }
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving:", error);
      setSaveStatus("error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // AUTO SAVE
  useEffect(() => {
    const debouncedSave = debounce((data) => {
      if (saveStatus === "unsaved") {
        saveToDatabase(data);
      }
    }, 2000);

    debouncedSave(editors[0]);

    return () => {
      debouncedSave.cancel();
    };
  }, [editors, saveStatus]);

  const handleSave = () => {
    editors.forEach((editor) => {
      saveToDatabase(editor);
    });
  };

  const handleDragStart = (e, editorId) => {
    e.dataTransfer.setData("text/plain", editorId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const editorId = e.dataTransfer.getData("text/plain");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId ? { ...editor, position: { x, y } } : editor
      )
    );
  };



  const handleCloseEditor = (editorId) => {
    setEditors((prev) => prev.filter((editor) => editor.id !== editorId));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 p-2 rounded-lg" style={{ margin: '50px 0 -60px 0' }}>
        <button
          className="btn btn-soft add-editor-button"
          onClick={handleAddEditor}
        >
          Add Text Box
        </button>
        <button className="btn btn-soft btn-info">Add Code Box</button>
        <button className="btn btn-soft btn-warning">Generate Flashcards</button>
        <button className="btn btn-soft btn-primary">Add IMG</button>
        <button className="btn btn-soft btn-error">Text Styling</button>
        <button className="btn btn-soft btn-secondary">Fonts</button>
        <button className="btn btn-soft btn-success" onClick={handleSave}>Save</button>
      </div>
      <div
        className="note-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {editors.map((editor) => (
          <div
            key={editor.id}
            draggable
            onDragStart={(e) => handleDragStart(e, editor.id)}
            className={`editor-wrapper`}
          >
            <TextEditor
              content={editor.content}
              onChange={(content) => handleContentChange(editor.id, content)}
              position={editor.position}
              onClose={() => handleCloseEditor(editor.id)}
              title={editor.title}
              onTitleChange={(title) => handleTitleChange(editor.id, title)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
