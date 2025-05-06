import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useParams } from "react-router-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { LeftUtilityButtons, PageNavigation, RightUtilityButtons } from "./UtilityButtons";
import TextEditor from "./TextEditor";
import ImgBox from "./ImgBox";
import Terminal from "./Terminal";
import CodeEditor from "./CodeEditor";
import { useNavigate } from "react-router-dom";
import { noteService } from '../services/noteService';
import { GRID_CONFIG } from '../config/gridConfig';

import "./NoteContainer.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layoutConfig = {
  ...GRID_CONFIG,
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: { lg: 42, md: 42, sm: 42, xs: 42, xxs: 42 },
  rowHeight: 20,
  margin: [0, 0],
  containerPadding: [0, 0],
  isDraggable: true,
  isResizable: true,
  useCSSTransforms: true,
  preventCollision: true,
  compactType: null,
  autoSize: false,
  verticalCompact: false,
  isBounded: true,
  allowOverlap: true,
  transformScale: 1,
  droppingItem: {
    i: "__dropping-elem__",
    h: 10,
    w: 10,
  },
};

const initialEditorContent = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const API_URL =
  import.meta.env.MODE === "production"
    ? "https://expressnote.onrender.com" // Full domain in production
    : "http://localhost:3000";
  
  export default function NoteContainer() {
    const navigate = useNavigate();
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const [editors, setEditors] = useState([]);
    const [saveStatus, setSaveStatus] = useState("saved");
    // const [currentPageId, setCurrentPageId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageBlocks, setPageBlocks] = useState({ 1: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [noteTitle, setNoteTitle] = useState("");
  // const token = localStorage.getItem("token");
  const { noteId } = useParams();


const handleTemplateDragStart = (e) => {
  const editorType = e.target
    .closest(".editor-template")
    .getAttribute("data-type");
  e.dataTransfer.setData("text/plain", editorType);
  e.dataTransfer.effectAllowed = "copy";
};

const handleTemplateDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
};

const handleTemplateDrop = (layout, layoutItem, event) => {
  if (event.dataTransfer.getData("text/plain")) {
    const editorType = event.dataTransfer.getData("text/plain");
    const dropX = layoutItem.x;
    const dropY = layoutItem.y;

    let initialContent;
    if (editorType === "text") {
      initialContent = initialEditorContent;
    } else if (editorType === "terminal") {
      initialContent = "I am a Terminal";
    } else if (editorType === "code") {
      initialContent = "I am a Code Block";
    } else {
      initialContent = "";
    }

    const newEditor = {
      id: `${editorType}-${Date.now()}`,
      noteId: null,
      blockId: null,
      type: editorType,
      layout: {
        i: `${editorType}-${Date.now()}`,
        x: dropX,
        y: dropY,
        w: 10,
        h: 10,
      },
      content: initialContent,
      title: "Untitled Note",
    };
    setEditors((prev) => [...prev, newEditor]);
    setSaveStatus("unsaved");
  }
};

const handleTitleChange = (e) => {
  const newTitle = e.target.value;
  setNoteTitle(newTitle);
  setSaveStatus("unsaved");
};

const handleContentChange = (editorId, newContent) => {
  setEditors((prev) => {
    const updatedEditors = prev.map((editor) =>
      editor.id === editorId ? { ...editor, content: newContent } : editor
    );
    setPageBlocks((prev) => ({
      ...prev,
      [currentPage]: updatedEditors,
    }));
    return updatedEditors;
  });
  setSaveStatus("unsaved");
};

const handleSave = () => {
  saveToDatabase({
    noteId: noteId,
    title: noteTitle,
    id: editors[0]?.id,
  });
};

const handleGeneratePDF = () => {
  const formattedPageBlocks = {};
 
  Object.entries(pageBlocks).forEach(([pageNum, blocks]) => {
    formattedPageBlocks[pageNum] = blocks.map((block) => ({
      id: block.id || `block-${Date.now()}`,
      type: block.type,
      content: block.content || "",
      layout: {
        i: block.layout?.i || `block-${Date.now()}`,
        x: block.layout?.x || 0,
        y: block.layout?.y || 0,
        w: block.layout?.w || 12,
        h: block.layout?.h || 2,
      },
      title: block.title || "Untitled Block",
      noteId: block.noteId || null,
      blockId: block.blockId || null,
    }));
  });

  const pdfData = {
    currentPage: currentPage,
    totalPages: totalPages,
    noteTitle: noteTitle,
    pageBlocks: formattedPageBlocks,
  };

  sessionStorage.setItem("pdfNoteData", JSON.stringify(pdfData));
  window.open("/pdf", "_blank");
};

const handleAddNewPage = () => {
  const newPageNumber = totalPages + 1;
  setPageBlocks((prev) => ({
    ...prev,
    [currentPage]: editors,
    [newPageNumber]: [],
  }));
  setTotalPages(newPageNumber);
  setCurrentPage(newPageNumber);
  setEditors([]);
};
const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setCurrentPage(newPage);
    setEditors(pageBlocks[newPage] || []);
  }
};
const handleDeletePage = () => {
  if (totalPages <= 1) {
    setError("Cannot delete the only page");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this page? You cannot undo this action")) {
    return;
  }

  setPageBlocks((prev) => {
    const newPageBlocks = { ...prev };
    delete newPageBlocks[currentPage];

    const reorderedBlocks = {};
    Object.keys(newPageBlocks)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach((pageNum, index) => {
        reorderedBlocks[index + 1] = newPageBlocks[pageNum];
      });

    const newCurrentPage = currentPage === 1 ? 1 : currentPage - 1;
    setCurrentPage(newCurrentPage);
    setTotalPages(Object.keys(reorderedBlocks).length);
    setEditors(reorderedBlocks[newCurrentPage] || []);
    return reorderedBlocks;
  });
};
// const saveToDatabase = async (data) => {
//   try {
//     setIsLoading(true);
//     const response = await fetch(`${API_URL}/api/notes/${data.noteId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       credentials: "include",
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       setSaveStatus("saved");
//       setLastSavedTime(new Date());
//     } else {
//       setSaveStatus("error");
//       setError("Failed to save note");
//     }
//   } catch (error) {
//     setSaveStatus("error");
//     setError("Error saving note");
//     console.error("Error saving note:", error);
//   } finally {
//     setIsLoading(false);
//   }
// };
const saveToDatabase = async (data) => {
  try {
    setIsLoading(true);
    await noteService.saveNote(data.noteId, {
      title: noteTitle,
      content: pageBlocks,
      editors: editors
    });
    setSaveStatus("saved");
    setLastSavedTime(new Date());
  } catch (error) {
    setSaveStatus("error");
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
  const handleCloseEditor = (editorId) => {
    setEditors((prev) => prev.filter((editor) => editor.id !== editorId));
  };

  return (
    <>
    <div className="note-page-container">

      <LeftUtilityButtons
        onTemplateDragStart={handleTemplateDragStart}
        onTemplateDragOver={handleTemplateDragOver}
        onTemplateDrop={handleTemplateDrop}
      />
      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: editors.map((editor) => editor.layout) }}
          breakpoints={layoutConfig.breakpoints}
          cols={layoutConfig.cols}
          rowHeight={layoutConfig.rowHeight}
          margin={layoutConfig.margin}
          containerPadding={layoutConfig.containerPadding}
          isDraggable={layoutConfig.isDraggable}
          isResizable={layoutConfig.isResizable}
          useCSSTransforms={layoutConfig.useCSSTransforms}
          preventCollision={layoutConfig.preventCollision}
          compactType={layoutConfig.compactType}
          autoSize={layoutConfig.autoSize}
          verticalCompact={layoutConfig.verticalCompact}
          isBounded={layoutConfig.isBounded}
          allowOverlap={layoutConfig.allowOverlap}
          transformScale={layoutConfig.transformScale}
          droppingItem={layoutConfig.droppingItem}
          onLayoutChange={(layout) => {
            setEditors((prev) =>
              prev.map((editor) => ({
                ...editor,
                layout: layout.find((l) => l.i === editor.id) || editor.layout,
              }))
            );
            setSaveStatus("unsaved");
          }}
          onDragOver={handleTemplateDragOver}
          onDrop={handleTemplateDrop}
          isDroppable={true}
        >
          {editors.map((editor) => (
            <div key={editor.id}>
              {editor.type === "text" && (
                <TextEditor
                  content={editor.content}
                  onChange={(content) => handleContentChange(editor.id, content)}
                  onClose={() => handleCloseEditor(editor.id)}
                />
              )}
              {editor.type === "image" && (
                <ImgBox
                  id={editor.id}
                  onClose={() => handleCloseEditor(editor.id)}
                  onChange={(id, content) => handleContentChange(id, content)}
                />
              )}
              {editor.type === "terminal" && (
                <Terminal
                  content={editor.content}
                  onChange={(content) => handleContentChange(editor.id, content)}
                  onClose={() => handleCloseEditor(editor.id)}
                />
              )}
              {editor.type === "code" && (
                <CodeEditor
                  content={editor.content}
                  onChange={(content) => handleContentChange(editor.id, content)}
                  onClose={() => handleCloseEditor(editor.id)}
                />
              )}
            </div>
          ))}
      </ResponsiveGridLayout>
  
      <RightUtilityButtons
        noteTitle={noteTitle}
        onTitleChange={handleTitleChange}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        isLoading={isLoading}
        error={error}
        onSave={handleSave}
        onGeneratePDF={handleGeneratePDF}
        onAddNewPage={handleAddNewPage}
        onDeletePage={handleDeletePage}
      />
    </div>
    </>
  );
}


