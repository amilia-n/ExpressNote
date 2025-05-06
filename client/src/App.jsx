import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import NewNote from "./pages/NewNote";
import UserProfile from "./pages/UserProfile";
import Page404 from "./pages/Page404";
import PDFGenerator from "./components/PDFGenerator";
import ExistingNote from "./pages/ExistingNote";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Landing />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="notes/newnote"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <NewNote />
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
                  <ExistingNote />
                </main>
              </>
            }
          />
          <Route path="*" element={<Page404 />} />
          <Route path="/pdf" element={<PDFGenerator />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
