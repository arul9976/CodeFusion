import React from "react";
import Folder from "./Folder";
import File  from "./File";
// Your file structure object
export const fileStructure = {
  name: "CodeFusion",
  type: "folder",
  children: [
    {
      name: "public",
      type: "folder",
      children: [
        { name: "vite.svg", type: "file" }
      ]
    },
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "assets",
          type: "folder",
          children: [
            { name: "react.svg", type: "file" }
          ]
        },
        { name: "App.css", type: "file" },
        { name: "App.jsx", type: "file" },
        { name: "Button.jsx", type: "file" },
        { name: "CodeEditor.jsx", type: "file" },
        { name: "Editor.jsx", type: "file" }
      ]
    },
    { name: ".gitignore", type: "file" },
    { name: "README.md", type: "file" },
    { name: "index.html", type: "file" }
]
};



function FileExplorer({ onFileSelect }) {
    // Recursive render function
    const renderTree = (node, level = 0) => {
      if (node.type === "folder") {
        return <Folder key={node.name} folder={node} level={level} onFileSelect={onFileSelect} />;
      } else if (node.type === "file") {
        return <File key={node.name} file={node} level={level} onFileSelect={onFileSelect} />;
      }
      return null;
    };
  
    return (
      <div className="file-explorer">
        <div className="header">
          <h2 className="explorer-title">Files</h2>
        </div>
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input type="text" className="search-input" placeholder="Go to file" />
        </div>
        <div className="fileBox">
          {renderTree(fileStructure, 0)}
        </div>
      </div>
    );
  }
  
  export default FileExplorer;
  