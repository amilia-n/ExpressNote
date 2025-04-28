import React, { useState, useCallback, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import TextEditor from "./TextEditor";
import { debounce } from "lodash";
import "./NoteContainer.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layoutConfig = {
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 100,
  margin: [10, 10],
};

const initialEditorContent = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function NoteContainer() {
  const [editors, setEditors] = useState([
    {
      id: "text-1",
      noteId: null,
      type: "text",
      layout: { i: "text-1", x: 0, y: 0, w: 3, h: 2 },
      content: initialEditorContent,
      title: "Untitled Note",
    },
  ]);
  const [saveStatus, setSaveStatus] = useState("saved");


  const handleContentChange = useCallback((editorId, newContent) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId ? { ...editor, content: newContent } : editor
      )
    );
    setSaveStatus("unsaved");
  }, []);

  const handleTitleChange = useCallback((editorId, newTitle) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId ? { ...editor, title: newTitle } : editor
      )
    );
    setSaveStatus("unsaved");
  }, []);



  const handleTemplateDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "new-editor");
    e.dataTransfer.effectAllowed = "copy";
  };

  const saveToDatabase = async (data) => {
    try {
      const noteData = {
        title: data.title,
        content: JSON.stringify(data.content),
      };

      let response;
      if (data.noteId) {
        response = await fetch(`http://localhost:3000/notes/${data.noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(noteData),
        });
      } else {
        response = await fetch("http://localhost:3000/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(noteData),
        });
      }
      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const savedNote = await response.json();
      if (!data.noteId) {
        setEditors((prev) =>
          prev.map((editor) =>
            editor.id === data.id
              ? { ...editor, noteId: savedNote.note_id }
              : editor
          )
        );
      }
      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving:", error);
      setSaveStatus("error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // AUTO SAVE
  useEffect(() => {
    const debouncedSave = debounce((data) => {
      if (saveStatus === "unsaved") {
        saveToDatabase(data);
      }
    }, 2000);

    debouncedSave(editors[0]);

    return () => {
      debouncedSave.cancel();
    };
  }, [editors, saveStatus]);

  const handleSave = () => {
    editors.forEach((editor) => {
      saveToDatabase(editor);
    });
  };

  const handleCloseEditor = (editorId) => {
    setEditors((prev) => prev.filter((editor) => editor.id !== editorId));
  };

  return (
    <div className="">
      <div id="side-col">
        <div
          className="editor-template"
          draggable
          onDragStart={handleTemplateDragStart}
        >
          <div className="template-preview">
            <h3>Text Editor</h3>
            <p>Drag to add a new text editor</p>
          </div>
        </div>
      </div>
      {/* <div
          className="flex gap-2 p-2 rounded-lg"
          style={{ margin: "50px 0 -60px 0" }}
        >
          <button
            className="btn btn-soft add-editor-button"
            onClick={handleAddEditor}
          >
            Add Text Box
          </button>
          <button className="btn btn-soft btn-info">Add Code Box</button>
          <button className="btn btn-soft btn-warning">
            Generate Flashcards
          </button>
          <button className="btn btn-soft btn-primary">Add IMG</button>
          <button className="btn btn-soft btn-error">Text Styling</button>
          <button className="btn btn-soft btn-secondary">Fonts</button>
          <button className="btn btn-soft btn-success" onClick={handleSave}>
            Save
          </button>
        </div> */}

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: editors.map((editor) => editor.layout) }}
        breakpoints={layoutConfig.breakpoints}
        cols={layoutConfig.cols}
        rowHeight={layoutConfig.rowHeight}
        margin={layoutConfig.margin}
        onLayoutChange={(layout) => {
          setEditors((prev) =>
            prev.map((editor) => ({
              ...editor,
              layout: layout.find((l) => l.i === editor.id) || editor.layout,
            }))
          );
        }}
        onDrop={(layout, layoutItem, event) => {
          if (event.dataTransfer.getData("text/plain") === "new-editor") {
            const newEditor = {
              id: `text-${Date.now()}`,
              noteId: null,
              type: "text",
              layout: {
                i: `text-${Date.now()}`,
                x: layoutItem.x,
                y: layoutItem.y,
                w: 6,
                h: 4,
              },
              content: initialEditorContent,
              title: "Untitled Note",
            };
            setEditors((prev) => [...prev, newEditor]);
          }
        }}
        isDroppable={true}
      >
        {editors.map((editor) => (
          <div key={editor.id}>
            <TextEditor
              content={editor.content}
              onChange={(content) => handleContentChange(editor.id, content)}
              onClose={() => handleCloseEditor(editor.id)}
              title={editor.title}
              onTitleChange={(title) => handleTitleChange(editor.id, title)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
