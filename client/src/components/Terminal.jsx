import React, { useState, useEffect } from "react";
import { View, Text } from "@react-pdf/renderer";
import "./Terminal.css";

const Terminal = ({
  content,
  onChange,
  isPDF = false,
  color,
  opacity,
}) => {
  const [terminalContent, setTerminalContent] = useState(
    content || "npm install..."
  );

  useEffect(() => {
    if (content) {
      setTerminalContent(content);
    }
  }, [content]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setTerminalContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  if (isPDF) {
    return (
      <View
        style={{
          backgroundColor: color,
          opacity: opacity / 100,
          padding: 15,
          color: "#fff",
          fontFamily: "Courier",
        }}
      >
        <Text>{content}</Text>
      </View>
    );
  }
  return (
    <div
      className="mockup-code w-full h-full"
      style={{ backgroundColor: color, opacity: opacity / 100 }}
    >
      <pre data-prefix="$">
        <code>
          <textarea
            value={terminalContent}
            onChange={handleContentChange}
            className="terminal-textarea"
            spellCheck="false"
          />
        </code>
      </pre>
    </div>
  );
};

export default Terminal;
