import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import NewNotes from "./pages/NewNotes";
import UserProfile from "./pages/UserProfile";
import NoPage from "./pages/NoPage";
import NoteContainer from "./components/NoteContainer";
import PDFGenerator from "./components/PDFGenerator";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Landing />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/notes"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <NewNotes />
                </main>
              </>
            }
          />
          <Route
            path="/notes/:noteId"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <NoteContainer />
                </main>
              </>
            }
          />
          <Route path="*" element={<NoPage />} />
          <Route path="/pdf" element={<PDFGenerator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
