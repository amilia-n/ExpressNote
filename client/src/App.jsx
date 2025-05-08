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
    <div className="App">
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Landing />} />
          <Route 
          path="/profile" 
          element={
          <> 
          <Navbar />
          <UserProfile />
          </>
          } 
          />
          <Route
            path="notes/newnote"
            element={
              <>
                <Navbar />
                  <NewNote />
              </>
            }
          />
          <Route
            path="/notes/:noteId"
            element={
              <>
                <Navbar />
                  <ExistingNote />
              </>
            }
          />
          <Route path="*" element={<Page404 />} />
          <Route path="/pdf" element={<PDFGenerator />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
