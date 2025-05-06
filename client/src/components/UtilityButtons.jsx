import React from "react";
import "./UtilityButtons.css";


export const LeftUtilityButtons = ({
  onTemplateDragStart,
  onTemplateDragOver,
  onTemplateDrop,
}) => (
  <div
    id="left-side-col"
    onDragOver={onTemplateDragOver}
    onDrop={onTemplateDrop}
  >
    <div
      className="editor-template"
      draggable
      onDragStart={onTemplateDragStart}
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
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
          Text Editor
        </h3>
        <p>Drag to add a text editor</p>
      </div>
    </div>
    <div
      className="editor-template"
      draggable
      onDragStart={onTemplateDragStart}
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
      onDragStart={onTemplateDragStart}
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
              d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
            />
          </svg>
          Code Editor
        </h3>
        <p>Drag to add a code editor</p>
      </div>
    </div>
    
    <div
      className="editor-template"
      draggable
      onDragStart={onTemplateDragStart}
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
  </div>
);

export const RightUtilityButtons = ({
  noteTitle,
  onTitleChange,
  saveStatus,
  lastSavedTime,
  isLoading,
  error,
  onSave,
  onGeneratePDF,
  onAddNewPage,
  onDeletePage,
}) => (
  <div id="right-side-col">
    <input
      type="text"
      placeholder="Document Title"
      className="input note-title"
      value={noteTitle}
      onChange={onTitleChange}
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
      className="btn btn-soft btn-success"
      onClick={onSave}
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
    <span></span>
    <button
      className="btn btn-soft btn-warning"
      onClick={onGeneratePDF}
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
      className="btn btn-soft btn-info"
      onClick={onAddNewPage}
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
          d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
        />
      </svg>
      Add New Page
    </button>
    <span></span>
    <span></span>
    <button
      className="btn btn-soft btn-error"
      onClick={onDeletePage}
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
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
      Delete Page
    </button>
  </div>
);

export const PageNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="note-container-header">
    <button
      className="page-nav"
      onClick={() => onPageChange(1)}
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
      onClick={() => onPageChange(currentPage - 1)}
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
          onPageChange(newPage);
        }
      }}
      className="page-input"
    />
    <span className="total-pages">of {totalPages}</span>
    <button
      className="page-nav"
      onClick={() => onPageChange(currentPage + 1)}
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
      onClick={() => onPageChange(totalPages)}
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
);

export function UtilityButtons({
  noteTitle,
  onTitleChange,
  saveStatus,
  lastSavedTime,
  isLoading,
  error,
  onSave,
  onGeneratePDF,
  onAddNewPage,
  onDeletePage,
  onTemplateDragStart,
  onTemplateDragOver,
  onTemplateDrop,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <>
      <LeftUtilityButtons
        onTemplateDragStart={onTemplateDragStart}
        onTemplateDragOver={onTemplateDragOver}
        onTemplateDrop={onTemplateDrop}
      />
      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <RightUtilityButtons
        noteTitle={noteTitle}
        onTitleChange={onTitleChange}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        isLoading={isLoading}
        error={error}
        onSave={onSave}
        onGeneratePDF={onGeneratePDF}
        onAddNewPage={onAddNewPage}
        onDeletePage={onDeletePage}
      />
    </>
  );
}
