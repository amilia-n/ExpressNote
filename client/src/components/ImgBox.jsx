import React, { useState } from "react";
import "./ImgBox.css";

const ImgBox = ({ onChange, id, color, opacity }) => { 
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="imgbox-wrapper" style={{ backgroundColor: color, opacity: opacity / 100 }}>
      <div className="imgbox-content">
        {image ? (
          <img src={image} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="drop-area">
            <button className="add-image">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }} 
              />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImgBox;