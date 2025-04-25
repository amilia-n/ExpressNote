import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import './App.css'

function App() {


  return (
    <>
  <BrowserRouter>
  <Routes>
  <Home />
  <Landing />
  <UserProfile />
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
