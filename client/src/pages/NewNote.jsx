import React from "react";
import NoteContainer from "../components/NoteContainer";
import {
  LeftUtilityButtons,
  RightUtilityButtons,
} from "../components/UtilityButtons";

const NewNote = () => {
  return (

      <NoteContainer
        noteData={null} 
        LeftColButtons={<LeftUtilityButtons />}
        RightColButtons={<RightUtilityButtons />}
      />
  );
};

export default NewNote;
