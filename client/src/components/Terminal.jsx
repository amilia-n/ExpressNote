import React, { useState, useEffect } from "react";
import "./Terminal.css";

const Terminal = ({ onClose, content, onChange }) => {
  const [terminalContent, setTerminalContent] = useState(content || "npm i daisyui");

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

  return (
    <div className="mockup-code w-full h-full">
      <button className="code-button close" onClick={onClose}></button>
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