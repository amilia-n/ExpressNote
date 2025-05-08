import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react";
import { View, Text } from "@react-pdf/renderer";
import "./TextEditor.css";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
export default function TextEditor({
  content,
  onChange,
  isPDF = false,
  color,
  opacity,
}) {
  const [editor] = useState(() => withReact(createEditor()));
  const editorValue = content || initialValue;

  const handleChange = useCallback(
    (newValue) => {
      onChange(newValue);
    },
    [onChange]
  );

  if (isPDF) {
    return (
      <View
        style={{
          marginBottom: 10,
          backgroundColor: color || "#ffffff",
          opacity: (opacity || 100) / 100,
        }}
      >
        {content.map((node, i) => {
          if (node.type === "paragraph") {
            return (
              <Text key={i} style={{ marginBottom: 5 }}>
                {node.children.map((child) => child.text).join("")}
              </Text>
            );
          }
          return null;
        })}
      </View>
    );
  }

  return (
    <div
      className="editor-container"
      style={{ backgroundColor: color, opacity: opacity / 100 }}
    >
      <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
        <Editable
          className="text-template"
          placeholder="I am a Text Editor ☺︎"
        />
      </Slate>
    </div>
  );
}
