import React, { useState, useCallback } from "react";
import TextEditor from "./TextEditor";
import { debounce } from 'lodash';

export default function NoteContainer() {
  const [editors, setEditors] = useState([
    { 
      id: 'text-1', 
      type: 'text', 
      position: { x: 0, y: 0 }, 
      content: [
        {
          type: "paragraph",
          children: [{ text: "" }]
        }
      ]
    }
  ]);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [draggedEditor, setDraggedEditor] = useState(null);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  return (
    <div className="note-container">
      <TextEditor 
        initialValue={content}
        onChange={handleContentChange}
      />
    </div>
  );
}