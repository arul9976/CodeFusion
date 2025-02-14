import React, { useState } from "react";
import File from "./File";
import "./IDEFileExplorer.css";


function Folder({ folder, level = 0, onFileSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const indentStyle = { paddingLeft: `${level * 20}px` };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={indentStyle} className="folder-container">
      <div className="folder-header" onClick={handleClick}>
        <div className="folder-arrow"   style={{ fontSize: "0.8rem" }}
        >{isOpen ? "▼" : "▶"}</div>
        <div className="folder-icon">📁</div>
        <div className="folder-name">{folder.name}</div>
      </div>
      {isOpen && folder.children && (
        <div className="folder-children">
          {folder.children.map((child, index) =>
            child.type === "folder" ? (
              <Folder key={index} folder={child} level={level + 1} onFileSelect={onFileSelect} />
            ) : (
              <File key={index} file={child} level={level + 1} onFileSelect={onFileSelect} />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Folder;
