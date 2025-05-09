import React, { useState, useCallback } from "react";
import "./ImgBox.css";

const ImgBox = ({ onChange, id, color, opacity }) => {
  const [image, setImage] = useState(null);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target.result;
        setImage(newImage);
        onChange(id, newImage);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange, id]);

  return (
    <div
      className="imgbox-wrapper"
      style={{ backgroundColor: color, opacity: opacity / 100 }}
    >
      <input
        id={`file-input-${id}`}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <label htmlFor={`file-input-${id}`} className="imgbox-content">
        {image ? (
          <img src={image} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="drop-area">
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
          </div>
        )}
      </label>
    </div>
  );
};

export default ImgBox;