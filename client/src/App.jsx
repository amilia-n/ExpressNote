import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
// import ReactDOM from "react-dom/client";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
// import UserProfile from "./pages/UserProfile";
// import NoPage from "./pages/NoPage";
// import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

{
  /* HIDDEN FOR DEVELOPMENT 
      <> 
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route index element={<Home />} />
          <Route path="UserProfile" element={<UserProfile />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter> 
      </> */
}
