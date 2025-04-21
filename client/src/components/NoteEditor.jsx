import React, { useState } from "react";
import { createEditor} from "slate";
import { Slate, withReact, Editable } from "slate-react";

export default function NoteEditor() {
  const [editor] = useState(() => withReact(createEditor()));
  const initialValue = [
    {
      type: "paragraph",
      children: [{ text: "Hello World" }]
    }
  ];
  return (
    <div className="NoteEditor">
      <Slate editor={editor} initialValue={initialValue}>
        <Editable />
      </Slate>
    </div>
  );
}