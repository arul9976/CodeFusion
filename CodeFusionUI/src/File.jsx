import React from "react";
import "./IDEFileExplorer.css";

function File({ file, level = 0, onFileSelect }) {
  const indentStyle = { paddingLeft: `${level * 20}px` };

  const handleClick = () => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div style={indentStyle} className="file-container" onClick={handleClick}>
      <div className="file-content">
        📄 {file.name}
      </div>
    </div>
  );
}

export default File;

