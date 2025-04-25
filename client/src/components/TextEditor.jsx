import React, { useState } from "react";
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import "./TextEditor.css";

export default function TextEditor({ content, onChange, position }) {
  const [editor] = useState(() => withReact(createEditor()));

  const handleChange = useCallback(
    (newValue) => {
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <Slate
      editor={editor}
      value={
        content || [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]
      }
      onChange={handleChange}>
      <Editable className="editor-content" placeholder="Start typing..." />
    </Slate>
  );
}
