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
      type: "text",
      position: { x: 20, y: 20 },
      content: initialEditorContent,
      isMinimized: false,
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
  const handleAddEditor = () => {
    const newEditor = {
      id: `text-${Date.now()}`,
      type: "text",
      position: { x: 20, y: 20 },
      content: initialEditorContent,
      isMinimized: false,
    };
    setEditors((prev) => [...prev, newEditor]);
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

  const handleMinimizeEditor = (editorId) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId
          ? { ...editor, isMinimized: !editor.isMinimized }
          : editor
      )
    );
  };

  const handleCloseEditor = (editorId) => {
    setEditors((prev) => prev.filter((editor) => editor.id !== editorId));
  };

  const saveToDatabase = async (data) => {
    try {
      // TODO: REPLACE W/ API call
      console.log("Saving to database:", data);
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving:", error);
      setSaveStatus("error");
    }
  };

  // AUTO SAVE
  useEffect(() => {
    const debouncedSave = debounce((data) => {
      if (saveStatus === "unsaved") {
        saveToDatabase(data);
      }
    }, 2000);

    debouncedSave(editors);

    return () => {
      debouncedSave.cancel();
    };
  }, [editors, saveStatus]);

  const handleSave = () => {
    saveToDatabase(editors);
  };

  return (
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
          className={`editor-wrapper ${editor.isMinimized ? "minimized" : ""}`}
        >
          <TextEditor
            content={editor.content}
            onChange={(content) => handleContentChange(editor.id, content)}
            position={editor.position}
            onMinimize={() => handleMinimizeEditor(editor.id)}
            onClose={() => handleCloseEditor(editor.id)}
          />
        </div>
      ))}
      <div className="controls">
        <button className="add-editor-button" onClick={handleAddEditor}>
          Add Editor
        </button>
        <button className={`save-button ${saveStatus}`} onClick={handleSave}>
          {saveStatus === "saved" ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
