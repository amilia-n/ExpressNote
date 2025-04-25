import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import NoPage from "./pages/NoPage";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Landing />} />
          <Route index element={<Home />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="UserProfile" element={<UserProfile />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
