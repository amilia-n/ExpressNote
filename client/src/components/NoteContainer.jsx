import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useNavigate } from "react-router-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import TextEditor from "./TextEditor";
import ImgBox from "./ImgBox";
import Terminal from "./Terminal";
import CodeEditor from "./CodeEditor";
import "./NoteContainer.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layoutConfig = {
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
    h: 4,
    w: 6,
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
  const [editors, setEditors] = useState([
    {
      id: "text-1",
      noteId: null,
      blockId: null,
      type: "text",
      layout: { i: "text-1", x: 0, y: 0, w: 3, h: 2 },
      content: initialEditorContent,
      title: "Untitled Note",
    },
  ]);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [currentPageId, setCurrentPageId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageBlocks, setPageBlocks] = useState({
    1: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const token = localStorage.getItem("token");
  const { noteId } = useParams();
  const [lastSavedTime, setLastSavedTime] = useState(null);
  // useEffect(() => {
  //   if (pageBlocks[currentPage]) {
  //     setEditors(pageBlocks[currentPage]);
  //   }
  // }, [currentPage, pageBlocks]);
  // console.log("NoteContainer received noteId:", noteId);
  // useEffect(() => {
  //   if (editors.length > 0 && editors[0].title) {
  //     setNoteTitle(editors[0].title);
  //   }
  // }, [editors]);
  useEffect(() => {
    const loadNoteData = async () => {
      if (noteId) {
        try {
          const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          });
  
          if (response.ok) {
            const noteData = await response.json();
            setNoteTitle(noteData.title);
            
            const pagesResponse = await fetch(`${API_URL}/api/notes/${noteId}/pages`, {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              credentials: "include",
            });
  
            if (pagesResponse.ok) {
              const pagesData = await pagesResponse.json();
              
              const blocksByPage = {};
              pagesData.forEach(page => {
                blocksByPage[page.position + 1] = page.blocks.map(block => {
                  // Parse content based on block type
                  let parsedContent;
                  try {
                    parsedContent = block.block_type === 'text' 
                      ? JSON.parse(block.content)
                      : block.content;
                  } catch (e) {
                    parsedContent = block.content;
                  }
  
                  // Calculate proper dimensions based on saved values
                  const width = block.width || 12;
                  const height = block.height || 2;
                  const x = block.x || 0;
                  const y = block.y || 0;
  
                  return {
                    id: block.block_id,
                    noteId: noteId,
                    blockId: block.block_id,
                    type: block.block_type,
                    layout: {
                      i: block.block_id,
                      x: x,
                      y: y,
                      w: width,
                      h: height,
                      minW: 3,
                      minH: 2,
                      maxW: 42,
                      maxH: 20,
                    },
                    content: parsedContent,
                    title: block.title || "Untitled Block",
                  };
                });
              });
  
              // Set all states at once to prevent race conditions
              setPageBlocks(blocksByPage);
              setTotalPages(Object.keys(blocksByPage).length);
              setCurrentPage(1);
              setEditors(blocksByPage[1] || []);
              setSaveStatus("saved");
            }
          }
        } catch (error) {
          setError("Failed to load note data");
          console.error("Error loading note:", error);
        }
      }
    };
  
    loadNoteData();
  }, [noteId, token]);

  const handleContentChange = useCallback(
    (editorId, newContent) => {
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
    },
    [currentPage]
  );

  //GeneratePDF
  const handleGeneratePDF = () => {
    const currentPageBlocks = pageBlocks[currentPage] || [];

    const formattedBlocks = currentPageBlocks.map((block) => ({
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

    const pdfData = {
      currentPage: currentPage,
      totalPages: totalPages,
      noteTitle: noteTitle,
      pageBlocks: {
        [currentPage]: formattedBlocks,
      },
    };

    console.log("Storing PDF data:", pdfData);
    sessionStorage.setItem("pdfNoteData", JSON.stringify(pdfData));
    window.open("/pdf", "_blank");
  };

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

      // Use the exact drop position without snapping
      const dropX = layoutItem.x;
      const dropY = layoutItem.y;

      let initialContent;
      if (editorType === "text") {
        initialContent = initialEditorContent;
      } else if (editorType === "terminal") {
        initialContent = "npm i daisyui";
      } else if (editorType === "code") {
        initialContent = "npm i daisyui\ninstalling...\nError!";
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

  // Modify handleAddNewPage to maintain state
  const handleAddNewPage = () => {
    const newPageNumber = totalPages + 1;

    // Save current editors to current page before switching
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
      // Save current editors to current page before switching
      setPageBlocks((prev) => ({
        ...prev,
        [currentPage]: editors,
      }));

      setCurrentPage(newPage);
      // Load editors from pageBlocks or empty array if none exist
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

    // Remove the current page from pageBlocks
    setPageBlocks((prev) => {
      const newPageBlocks = { ...prev };
      delete newPageBlocks[currentPage];
      
      // Reorder remaining pages
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

  const saveToDatabase = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);
      try {
        let noteId = data?.noteId;
        let pageId = currentPageId;

        if (!noteId) {
          const noteResponse = await fetch(`${API_URL}/api/notes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ title: data.title }),
          });

          if (!noteResponse.ok) {
            throw new Error("Failed to create note");
          }

          const savedNote = await noteResponse.json();
          noteId = savedNote.note_id;

          const pageResponse = await fetch(`${API_URL}/api/pages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
            body: JSON.stringify({ note_id: noteId, position: 0 }),
          });

          if (!pageResponse.ok) {
            throw new Error("Failed to create page");
          }

          const savedPage = await pageResponse.json();
          pageId = savedPage.page_id;
          setCurrentPageId(pageId);

          setEditors((prev) =>
            prev.map((editor) =>
              editor.id === data.id ? { ...editor, noteId: noteId } : editor
            )
          );
        }

        for (const editor of editors) {
          const blockData = {
            page_id: pageId,
            block_type: editor.type,
            content: editor.type === 'text' 
              ? JSON.stringify(editor.content)
              : editor.content,
            position: 0,
            x: editor.layout.x,
            y: editor.layout.y,
            width: editor.layout.w,
            height: editor.layout.h,
          };

          if (editor.blockId) {
            await fetch(`${API_URL}/api/blocks/${editor.blockId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              credentials: "include",
              body: JSON.stringify(blockData),
            });
          } else {
            const createResponse = await fetch(`${API_URL}/api/blocks`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              credentials: "include",
              body: JSON.stringify(blockData),
            });

            if (createResponse.ok) {
              const savedBlock = await createResponse.json();
              setEditors((prev) =>
                prev.map((e) =>
                  e.id === editor.id
                    ? { ...e, blockId: savedBlock.block_id }
                    : e
                )
              );
            }
          }
        }

        setSaveStatus("saved");
        setLastSavedTime(new Date());
      } catch (error) {
        setError(error.message);
        setSaveStatus("error");
      } finally {
        setIsLoading(false);
      }
    },
    [editors, currentPageId, token]
  );

  // AUTO SAVE
  // useEffect(() => {
  //   const debouncedSave = debounce((data) => {
  //     if (saveStatus === "unsaved") {
  //       saveToDatabase(data);
  //     }
  //   }, 2000);

  //   debouncedSave(editors[0]);

  //   return () => {
  //     debouncedSave.cancel();
  //   };
  // }, [editors, saveStatus, saveToDatabase]);

  const handleCloseEditor = (editorId) => {
    setEditors((prev) => prev.filter((editor) => editor.id !== editorId));
  };

  const handleTitleChange = (editorId, newTitle) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId ? { ...editor, title: newTitle } : editor
      )
    );
    setSaveStatus("unsaved");
  };

  return (
    <div className="note-page-container">
      <div className="note-container-header">
        <button
          className="page-nav"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
        </button>
        <button
          className="page-nav"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <input
          type="number"
          value={currentPage}
          min={1}
          max={totalPages}
          onChange={(e) => {
            const newPage = parseInt(e.target.value);
            if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
              handlePageChange(newPage);
            }
          }}
          className="page-input"
        />
        <span className="total-pages">of {totalPages}</span>
        <button
          className="page-nav"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <button
          className="page-nav"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div id="left-side-col">
        <div
          className="editor-template"
          draggable
          onDragStart={handleTemplateDragStart}
          data-type="text"
        >
          <div className="template-preview">
            <h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Text Editor
            </h3>
            <p>Drag to add a new text editor</p>
          </div>
        </div>
        <div
          className="editor-template"
          draggable
          onDragStart={handleTemplateDragStart}
          data-type="image"
        >
          <div className="template-preview">
            <h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 img-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              Add New Image
            </h3>
            <p>Drag to add a container</p>
          </div>
        </div>
        <div
          className="editor-template"
          draggable
          onDragStart={handleTemplateDragStart}
          data-type="terminal"
        >
          <div className="template-preview">
            <h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 term-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              Terminal
            </h3>
            <p>Drag to add a new terminal</p>
          </div>
        </div>
        <div
          className="editor-template"
          draggable
          onDragStart={handleTemplateDragStart}
          data-type="code"
        >
          <div className="template-preview">
            <h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 code-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
              Code Editor
            </h3>
            <p>Drag to add a new code editor</p>
          </div>
        </div>
      </div>

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
                title={editor.title}
                onTitleChange={(title) => handleTitleChange(editor.id, title)}
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
      <div id="right-side-col">
        <input
          type="text"
          placeholder="Document Title"
          className="input note-title"
          value={noteTitle}
          onChange={(e) => {
            setNoteTitle(e.target.value);
            handleTitleChange(editors[0].id, e.target.value);
          }}
        />
        <div className="last-saved">
          {isLoading
            ? "Saving..."
            : saveStatus === "saved"
            ? `Last saved: ${lastSavedTime ? new Date(lastSavedTime).toLocaleTimeString() : "Never"}`
            : saveStatus === "error"
            ? "Error saving"
            : "Unsaved changes"}
        </div>
        {error && <div className="error-message">{error}</div>}
        <button
          className="btn btn-soft btn-success"
          onClick={() =>
            saveToDatabase({
              noteId: noteId,
              title: noteTitle,
              id: editors[0]?.id,
            })
          }
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          Save
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            style={{ transform: "rotate(180deg)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        </button>
        <span></span>
        <button
          className="btn btn-soft btn-info"
          onClick={handleAddNewPage}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          Add a New Page
        </button>
        <span></span>
        <button
          className="btn btn-soft btn-warning"
          onClick={handleGeneratePDF}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
            />
          </svg>
          Download PDF
        </button>
        <span></span>
        <button
          className="btn btn-soft add-editor-button"
          onClick={() => navigate("/profile")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
            />
          </svg>
          Back to All Notes
        </button>
        <span></span>
        <span></span>
        <button
          className="btn btn-soft btn-error"
          onClick={handleDeletePage}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          Delete Page
        </button>
      </div>
    </div>
  );
}
