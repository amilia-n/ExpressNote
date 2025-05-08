import React, { useState, useEffect } from "react";
import { View, Text } from '@react-pdf/renderer';
import "./CodeEditor.css";

const CodeEditor = ({  content, onChange, isPDF = false, color, opacity  }) => {
  const [codeContent, setCodeContent] = useState(content || "npm install...");

  useEffect(() => {
    if (content) {
      setCodeContent(content);
    }
  }, [content]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setCodeContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const lineCount = codeContent.split('\n').length;

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
  if (isPDF) {
    return (
        <View style={{ 
          backgroundColor: color,
          opacity: opacity / 100, 
            padding: 15,
            fontFamily: 'Courier'
        }}>
            <Text>{content}</Text>
        </View>
    );
}
  return (
    <div className="mockup-code w-full h-full" style={{ backgroundColor: color, opacity: opacity / 100 }}>
      <pre>
        <code>
          <div className="code-editor-lines">
            <div className="line-numbers">{lineNumbers}</div>
            <textarea
              value={codeContent}
              onChange={handleContentChange}
              className="code-editor-textarea"
              spellCheck="false"
            />
          </div>
        </code>
      </pre>
    </div>
  );
};

export default CodeEditor;