import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { LeftUtilityButtons } from "./UtilityButtons";
import TextEditor from "./TextEditor";
import ImgBox from "./ImgBox";
import Terminal from "./Terminal";
import CodeEditor from "./CodeEditor";
import { noteService } from "../services/noteService";
import { GRID_CONFIG } from "../config/gridConfig";
import saveStatic from "../assets/save.png";
import saveIcon from "../assets/save.gif";
import recycleStatic from "../assets/recycle.png";
import recycleIcon from "../assets/recycle.gif";
import trashStatic from "../assets/delete.png";
import trashIcon from "../assets/paper.gif";
import downloadStatic from "../assets/download.png";
import downloadIcon from "../assets/download.gif";

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
    ? "https://expressnote.onrender.com" 
    : "http://localhost:3000";

export default function NoteContainer() {
  const navigate = useNavigate();
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [editors, setEditors] = useState([]);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageBlocks, setPageBlocks] = useState({ 1: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [isRecycleHovered, setIsRecycleHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [templateColor, setTemplateColor] = useState("#f0eded");
  const [templateOpacity, setTemplateOpacity] = useState(100);
  const [pageError, setPageError] = useState(null);

  const MAX_PAGES = 20;

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const { noteId } = useParams();

  useEffect(() => {
    if (pageError) {
      const timer = setTimeout(() => {
        setPageError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pageError]);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const note = await noteService.getNote(noteId);
        if (note) {
          setNoteTitle(note.title || "");

          const blocksByPage = {};
          note.pages.forEach((page, index) => {
            const pageNum = index + 1;
            blocksByPage[pageNum] = page.blocks.map((block) => {
              let parsedContent;
              try {
                parsedContent =
                  block.block_type === "text"
                    ? JSON.parse(block.content)
                    : block.content;
              } catch (e) {
                parsedContent = block.content;
              }

              return {
                id: `block-${block.block_id}`,
                blockId: block.block_id,
                type: block.block_type,
                content: parsedContent,
                layout: {
                  i: `block-${block.block_id}`,
                  x: block.x,
                  y: block.y,
                  w: 10,
                  h: 10,
                },
                color: block.color || "#ffffff",
                opacity: block.opacity || 100,
              };
            });
          });

          setPageBlocks(blocksByPage);
          setTotalPages(note.pages.length);
          setCurrentPage(1);
          setEditors(blocksByPage[1] || []);
        }
      } catch (error) {
        console.error("Error loading note:", error);
        setError(error.message);
      }
    };

    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  const handleTemplateDragStart = (e) => {
    if (e.target.closest(".editor-template")) {
      const editorType = e.target
        .closest(".editor-template")
        .getAttribute("data-type");
      e.dataTransfer.setData("text/plain", editorType);
      e.dataTransfer.setData("color", templateColor);
      e.dataTransfer.setData("opacity", templateOpacity);
      e.dataTransfer.effectAllowed = "copy";
    }
  };
  const handleBlockDragStart = (e, editorId) => {
    if (activeTab === "item4") {
      e.dataTransfer.setData("text/plain", editorId);
      e.dataTransfer.effectAllowed = "move";
    }
  };
  const handleTemplateDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleTemplateDrop = (layout, layoutItem, event) => {
    if (event.dataTransfer.getData("text/plain")) {
      const editorType = event.dataTransfer.getData("text/plain");
      const color = event.dataTransfer.getData("color");
      const opacity = event.dataTransfer.getData("opacity");
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
        color: color,
        opacity: opacity,
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
    if (!noteId) {
      saveToDatabase({
        noteId: "newnote",
        title: noteTitle || "Untitled Note",
        content: pageBlocks,
      });
    } else {
      saveToDatabase({
        noteId: noteId,
        title: noteTitle,
        content: pageBlocks,
      });
    }
  };
const handleGeneratePDF = () => {
  const updatedPageBlocks = {
    ...pageBlocks,
    [currentPage]: editors
  };

  const formattedPageBlocks = {};
  Object.entries(updatedPageBlocks).forEach(([pageNum, blocks]) => {
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
      color: block.color || "#ffffff",
      opacity: block.opacity || 100,
      noteId: block.noteId || null,
      blockId: block.blockId || null,
    }));
  });

  const pdfData = {
    currentPage: currentPage,
    totalPages: totalPages,
    pageBlocks: formattedPageBlocks,
  };

  sessionStorage.setItem("pdfNoteData", JSON.stringify(pdfData));
  const pdfWindow = window.open("", "_blank");
  pdfWindow.location.href = "/pdf";
};

  const handleAddNewPage = () => {
    if (totalPages >= MAX_PAGES) {
      setError("Maximum 20 page limit reached!");
      return;
    }
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
      setPageBlocks((prev) => ({
        ...prev,
        [currentPage]: editors,
      }));
      setCurrentPage(newPage);
      setEditors(pageBlocks[newPage] || []);
    }
  };

  const handleDeletePage = () => {
    if (totalPages <= 1) {
      setPageError("Cannot delete the only page");
      setActiveTab(null);
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this page? You cannot undo this action"
      )
    ) {
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
    setActiveTab(null);
  };

  const saveToDatabase = async (data) => {
    try {
      setIsLoading(true);
      const processedPageBlocks = {};
      Object.entries(pageBlocks).forEach(([pageNum, blocks]) => {
        processedPageBlocks[pageNum] = blocks.map((block) => ({
          ...block,
          content:
            block.type === "text"
              ? typeof block.content === "string"
                ? block.content
                : JSON.stringify(block.content)
              : block.content,
          x: block.layout?.x || 0,
          y: block.layout?.y || 0,
          position: (block.layout?.y || 0) * 10 + (block.layout?.x || 0),
        }));
      });

      console.log("Saving note with data:", {
        noteId: data.noteId,
        title: noteTitle,
        content: processedPageBlocks,
      });
      console.log(
        "First block example:",
        processedPageBlocks[Object.keys(processedPageBlocks)[0]]?.[0]
      );

      if (data.noteId === "newnote") {
        const savedNote = await noteService.createNote({
          title: noteTitle,
          content: processedPageBlocks,
        });
        setSaveStatus("saved");
        setLastSavedTime(new Date());
        navigate(`/notes/${savedNote.note_id}`);
      } else {
        await noteService.saveNote(data.noteId, {
          title: noteTitle,
          content: processedPageBlocks,
        });
        setSaveStatus("saved");
        setLastSavedTime(new Date());
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEditor = (editorId) => {
    setEditors((prev) => {
      const updatedEditors = prev.filter((editor) => editor.id !== editorId);
      setPageBlocks((prev) => ({
        ...prev,
        [currentPage]: updatedEditors,
      }));
      return updatedEditors;
    });
    setSaveStatus("unsaved");
  };

  return (
    <>
      <div className="note-page-container">
        <LeftUtilityButtons
          onTemplateDragStart={handleTemplateDragStart}
          onTemplateDragOver={handleTemplateDragOver}
          onTemplateDrop={handleTemplateDrop}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          onAddNewPage={handleAddNewPage}
          onColorChange={(color, opacity) => {
            setTemplateColor(color);
            setTemplateOpacity(opacity);
          }}
        />
        <div className="scroll-container">
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
                  layout:
                    layout.find((l) => l.i === editor.id) || editor.layout,
                }))
              );
              setSaveStatus("unsaved");
            }}
            onDragOver={handleTemplateDragOver}
            onDrop={handleTemplateDrop}
            isDroppable={true}
          >
            {editors.map((editor) => (
              <div 
              key={editor.id}
              draggable={activeTab === "item4"}
              onDragStart={(e) => handleBlockDragStart(e, editor.id)}
              >
                {editor.type === "text" && (
                  <TextEditor
                    content={editor.content}
                    onChange={(content) =>
                      handleContentChange(editor.id, content)
                    }
                    onClose={() => handleCloseEditor(editor.id)}
                    color={editor.color}
                    opacity={editor.opacity}
                  />
                )}
                {editor.type === "image" && (
                  <ImgBox
                    id={editor.id}
                    onClose={() => handleCloseEditor(editor.id)}
                    onChange={(id, content) => handleContentChange(id, content)}
                    color={editor.color}
                    opacity={editor.opacity}
                  />
                )}
                {editor.type === "terminal" && (
                  <Terminal
                    content={editor.content}
                    onChange={(content) =>
                      handleContentChange(editor.id, content)
                    }
                    onClose={() => handleCloseEditor(editor.id)}
                    color={editor.color}
                    opacity={editor.opacity}
                  />
                )}
                {editor.type === "code" && (
                  <CodeEditor
                    content={editor.content}
                    onChange={(content) =>
                      handleContentChange(editor.id, content)
                    }
                    onClose={() => handleCloseEditor(editor.id)}
                    color={editor.color}
                    opacity={editor.opacity}
                  />
                )}
              </div>
            ))}
          </ResponsiveGridLayout>
          <ul className="menu bg-base-200 side-bar">
            <li className="tooltip tooltip-right" data-tip="Save">
              <a
                className={`${
                  activeTab === "item1" ? "menu-active" : ""
                } hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent`}
                onMouseEnter={() => setIsSaveHovered(true)}
                onMouseLeave={() => setIsSaveHovered(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("item1");
                  toggleModal();
                }}
              >
                <div className="flex items-center justify-center object-contain">
                  <img
                    src={isSaveHovered ? saveIcon : saveStatic}
                    alt="save icon"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </a>
            </li>
            <li className="tooltip tooltip-right" data-tip="Download">
              <a
                className={`${
                  activeTab === "item2" ? "menu-active" : ""
                } hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent`}
                onMouseEnter={() => setIsDownloadHovered(true)}
                onMouseLeave={() => setIsDownloadHovered(false)}
                onClick={() => {
                  setActiveTab("item2");
                  handleGeneratePDF();
                  setActiveTab(null);
                }}
              >
                <div className="flex items-center justify-center object-contain">
                  <img
                    src={isDownloadHovered ? downloadIcon : downloadStatic}
                    alt="download icon"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </a>
            </li>
            <li className="tooltip tooltip-right" data-tip="Delete Page">
              <a
                className={`${
                  activeTab === "item3" ? "menu-active" : ""
                } hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent`}
                onMouseEnter={() => setIsTrashHovered(true)}
                onMouseLeave={() => setIsTrashHovered(false)}
                onClick={() => {
                  setActiveTab("item3");
                  handleDeletePage();
                  setActiveTab(null);
                }}
              >
                <div className="flex items-center justify-center object-contain">
                  <img
                    src={isTrashHovered ? trashIcon : trashStatic}
                    alt="trash icon"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </a>
            </li>
            <li
              className="tooltip tooltip-right relative"
              data-tip="Recycle Component"
            >
              <a
                className={`${
                  activeTab === "item4" ? "menu-active" : ""
                } hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent`}
                onMouseEnter={() => setIsRecycleHovered(true)}
                onMouseLeave={() => setIsRecycleHovered(false)}
                onClick={() =>
                  setActiveTab(activeTab === "item4" ? null : "item4")
                }
              >
                <div className="flex items-center justify-center object-contain">
                  <img
                    src={isRecycleHovered ? recycleIcon : recycleStatic}
                    alt="recycle icon"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </a>
              {activeTab === "item4" && (
                <div
                  className="drop-zone"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const editorId = e.dataTransfer.getData("text/plain");
                    if (editorId) {
                      handleCloseEditor(editorId);
                    }
                  }}
                >
                  <div className="drop-zone-content">
                    <p>Drop to Delete</p>
                  </div>
                </div>
              )}
            </li>
          </ul>

          {pageError && (
            <div className="cannot-delete-message">{pageError}</div>
          )}
          {isOpen && (
            <div
              className={`modal modal-open modal-middle`}
              role="dialog"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  toggleModal();
                }
              }}
            >
              <div className="modal-box">
                <input
                  type="text"
                  className="input"
                  placeholder="Document Title"
                  value={noteTitle}
                  onChange={handleTitleChange}
                />

                <div className="last-saved">
                  {isLoading
                    ? "Saving..."
                    : saveStatus === "saved"
                    ? `Last saved: ${
                        lastSavedTime
                          ? new Date(lastSavedTime).toLocaleTimeString()
                          : "Never"
                      }`
                    : saveStatus === "error"
                    ? "Error saving"
                    : "Unsaved changes"}
                </div>
                {error && <div className="error-message">{error}</div>}
                <button
                  className="btn btn-soft btn-success save-btn"
                  onClick={handleSave}
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
                  Save Note
                </button>
                <p className="close-label">Press Anywhere Outside to Close</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
