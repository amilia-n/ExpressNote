import React, { useState, useCallback } from "react";
import TextEditor from "./TextEditor";
import { debounce } from 'lodash';

export default function NoteContainer() {
  const [editors, setEditors] = useState([
    { 
      id: 'text-1', 
      type: 'text', 
      position: { x: 0, y: 0 }, 
      content: [
        {
          type: "paragraph",
          children: [{ text: "" }]
        }
      ],
      isMinimized: false
    }
  ]);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [draggedEditor, setDraggedEditor] = useState(null);

  const handleContentChange = (newContent) => {
    const handleContentChange = useCallback((editorId, newContent) => {
      setEditors(prev => prev.map(editor => 
        editor.id === editorId ? { ...editor, content: newContent } : editor
      ));
      setSaveStatus('unsaved');
    }, []);

    const handleDragStart = (e, editorId) => {
      setDraggedEditor(editorId);
      e.dataTransfer.setData('text/plain', editorId);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      const editorId = e.dataTransfer.getData('text/plain');
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      setEditors(prev => prev.map(editor => 
        editor.id === editorId 
          ? { ...editor, position: { x, y } }
          : editor
      ));
      setDraggedEditor(null);
    };

const handleAddEditor = () => {
    const newEditor = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: 20, y: 20 },
      content: [
        {
          type: "paragraph",
          children: [{ text: "" }]
        }
      ],
      isMinimized: false
    };
    setEditors(prev => [...prev, newEditor]);
  };
  
 const handleMinimizeEditor = (editorId) => {
    setEditors(prev => prev.map(editor =>
      editor.id === editorId
        ? { ...editor, isMinimized: !editor.isMinimized }
        : editor
    ));
  };

  const handleCloseEditor = (editorId) => {
    setEditors(prev => prev.filter(editor => editor.id !== editorId));
  };

    const saveToDatabase = async (data) => {
      try {
        // TODO: ADD API CALL TO SAVE
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
      }
    };
  const handleSave = () => {
    saveToDatabase(editors);
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