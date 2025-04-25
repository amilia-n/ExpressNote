import React, { useState, useCallback } from "react";  
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import './TextEditor.css';

export default function TextEditor({ content, onChange, position }) {
  const [editor] = useState(() => withReact(createEditor()));
  
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
          <button className="editor-minimize">−</button>
          <button className="editor-close">×</button>
        </div>
      </div>
      <Slate 
        editor={editor} 
        value={content || [
          {
            type: "paragraph",
            children: [{ text: "" }]
          }
        ]}
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