import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Landing />} />
          <Route 
            path="/notes" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
              </>
            } 
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
