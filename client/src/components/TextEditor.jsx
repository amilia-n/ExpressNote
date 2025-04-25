import React, { useState, useCallback } from "react";  
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import './TextEditor.css';

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }]
  }
];
;

export default function TextEditor({ content, onChange, position, onMinimize, onClose }) {
  const [editor] = useState(() => withReact(createEditor()));

  const editorValue = content || initialValue;

  const handleChange = useCallback((newValue) => {
    onChange(newValue);
  }, [onChange]);

  return (
    <div 
      className="editor-container"
      style={{
        position: 'absolute',
        left: position?.x || 0,
        top: position?.y || 0,
        cursor: 'move'
      }}
    >
      <div className="editor-header">
        <span className="editor-title">Text Editor</span>
        <div className="editor-controls">
          <button className="editor-minimize" onClick={onMinimize}>−</button>
          <button className="editor-close" onClick={onClose}>×</button>
        </div>
      </div>
      <Slate 
        editor={editor} 
        initialValue={editorValue}
        onChange={handleChange}
      >
        <Editable 
          className="editor-content"
          placeholder="Start typing..."  
        />
      </Slate>
    </div>
  );
}