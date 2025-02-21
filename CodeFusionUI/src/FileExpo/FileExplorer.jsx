import React, { useContext, useEffect, useRef, useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

import '../CSS/FileExplorer.css';
import { getFileIcon } from '../utils/GetIcon';
import { ClientContext } from '../Editor/ClientContext';

const FileExplorer = ({ isExplorerOpen, files, handleFile }) => {
  const { fileOpenAndDocCreate, dispatch, getBindings, initAndGetProvider } = useContext(ClientContext);
  const [fileData, setFileData] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [user, setUser] = useState('arul');
  const idxRef = useRef(0);

  // const handleFile = (e) => {

  //   if (activeFile) {
  //     const bind = getBindings(activeFile.url);
  //     console.log(bind);

  //     if (bind) {
  //       const provider = initAndGetProvider(activeFile.url);
  //       console.log(provider);

  //       bind.destroy();
  //       if (provider) {
  //         provider.destroy();
  //       }
  //     }
  //     console.log(activeFile);
  //   }


  //   let curFile = files.find(f => f.id === e.id);
  //   if (curFile) {
  //     setActiveFile(curFile);
  //     return;
  //   }
  //   e['name'] = e.file;
  //   e['binding'] = null;
  //   console.log(e);
  //   setActiveFile(e);
  //   setFiles([...files, e]);

   
  // }

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://172.17.22.225:3000/list-all-files/${user}`);
        // const response = await fetch(`http://localhost:3000/list-all-files/${user}`);
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
        // setTimeout(() => {
        // console.log(data[user]);

        setFileData(data[user]);
        // }, 2000);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [user, isExplorerOpen]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };


  useEffect(() => {
    if (!isExplorerOpen) {
      setFileData(null);
    }

  }, [isExplorerOpen])

  const renderFiles = (files, parentPath = '', id = 0) => {
    return (
      <ul className="file-list">
        {files.map((fileOrFolder) => {
          if (fileOrFolder.file) {
            // console.log(fileOrFolder);
            if (!fileOrFolder.id)
              fileOrFolder['id'] = fileOrFolder.url;
            // console.log("---> " + Object.entries(fileOrFolder));

            return (
              <li key={fileOrFolder.id} className="file-item" onClick={() => handleFile(fileOrFolder)}>

                <p className='file-link'>
                  {getFileIcon(fileOrFolder.file)}
                  <span>{fileOrFolder.file}</span>
                </p>
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

                {isExpanded && renderFiles(folderContents, currentPath, id)}
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
    <div className={'file-explorer'}>
      <div className="header">
        <div className="avatar">
          {user.slice(0, 1).toUpperCase()}
        </div>
        <h1 className='myclass'>{user}'s File Explorer</h1>
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






