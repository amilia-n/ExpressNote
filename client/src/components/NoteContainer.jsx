import React, { useState } from "react";
import TextEditor from "./TextEditor";

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