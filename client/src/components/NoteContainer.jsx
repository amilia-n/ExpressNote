import React, { useState, useCallback } from "react";
import TextEditor from "./TextEditor";
import { debounce } from 'lodash';

export default function NoteContainer() {
  const [content, setContent] = useState("");

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