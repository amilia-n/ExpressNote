import React, { useState, useEffect } from "react";
import { View, Text } from '@react-pdf/renderer';
import "./CodeEditor.css";

const CodeEditor = ({ onClose, content, onChange, isPDF = false  }) => {
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
            backgroundColor: '#f5f5f5', 
            padding: 10,
            fontFamily: 'Courier'
        }}>
            <Text>{content}</Text>
        </View>
    );
}
  return (
    <div className="mockup-code w-full h-full">
          <button className="code-button close" onClick={onClose}></button>
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