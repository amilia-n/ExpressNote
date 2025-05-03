import React from "react";
import NoteContainer from "../components/NoteContainer";

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-1">
        <NoteContainer />
      </div>
    </div>
  );
};

export default Home;
