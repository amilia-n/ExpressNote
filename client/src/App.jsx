import React from "react";
import NoteContainer from "./components/NoteContainer";
import Navbar from "./components/Navbar";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
// import UserProfile from "./pages/UserProfile";
// import NoPage from "./pages/NoPage";
// import "./App.css";

function App() {
  return (
    <div className="App">
      {/* <Navbar />
      <main className="flex-grow">
        <NoteContainer />

        <Home />
      </main> */}
    <Landing />
    </div>
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
