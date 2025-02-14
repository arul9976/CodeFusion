import React, { useEffect, useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import './FileExplorer.css'; 

const FileExplorer = () => {
  const [fileData, setFileData] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [user, setUser] = useState('arul');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:3000/list-all-files/${user}`);
        const data = await response.json();
        // const data = {
        //   "arul": [
        //     {
        //       "file": "a1.html",
        //       "url": "/codefusion/arul/a1.html"
        //     },
        //     {
        //       "project1": [
        //         {
        //           "MyFolder": [
        //             {
        //               "file": "app.css",
        //               "url": "/codefusion/arul/project1/MyFolder/app.css"
        //             },
        //             {
        //               "file": "a.css",
        //               "url": "/codefusion/arul/project1/MyFolder/a.css"
        //             }
        //           ]
        //         },
        //         {
        //           "Folder": [
        //             {
        //               "file": "app.css",
        //               "url": "/codefusion/arul/project1/Folder/app.css"
        //             },
        //             {
        //               "file": "a.css",
        //               "url": "/codefusion/arul/project1/Folder/a.css"
        //             }
        //           ]
        //         },
        //         {
        //           "file": "project1.html",
        //           "url": "/codefusion/arul/project1/project1.html"
        //         }
        //       ]
        //     }
        //   ]
        // };
        setFileData(data[user]);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [user]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const renderFiles = (files, parentPath = '') => {
    return (
      <ul className="file-list">
        {files.map((fileOrFolder, index) => {
          if (fileOrFolder.file) {
            // This is a file
            return (
              <li key={`${parentPath}/${fileOrFolder.file}`} className="file-item">
                <a
                  href={fileOrFolder.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                >
                  <File size={16} className="file-icon" />
                  <span>{fileOrFolder.file}</span>
                </a>
              </li>
            );
          } else if (typeof fileOrFolder === 'object') {
            const folderName = Object.keys(fileOrFolder)[0];
            const folderContents = Object.values(fileOrFolder)[0];
            const currentPath = `${parentPath}/${folderName}`;
            const isExpanded = expandedFolders[currentPath] !== false; // Default to expanded

            return (
              <li key={`${parentPath}/${folderName}`} className="folder-item">
                <button
                  onClick={() => toggleFolder(currentPath)}
                  className="folder-button"
                >
                  {isExpanded ?
                    <ChevronDown size={16} className="chevron-icon" /> :
                    <ChevronRight size={16} className="chevron-icon" />
                  }
                  <Folder size={16} className="folder-icon" />
                  <span>{folderName}</span>
                </button>

                {isExpanded && renderFiles(folderContents, currentPath)}
              </li>
            );
          }
          return null;
        })}
      </ul>
    );
  };

  if (!fileData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="file-explorer">
      <div className="header">
        <div className="avatar">
          {user.slice(0, 1).toUpperCase()}
        </div>
        <h1>{user}'s File Explorer</h1>
      </div>

      {fileData.length === 0 ? (
        <p className="empty-message">No files or folders found for this user.</p>
      ) : (
        <div className="explorer-content">
          {renderFiles(fileData)}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;