// import React, { useState, useRef } from 'react';
// import AceEditor from 'react-ace';
// import { FileText, X, Code, Image, Folder, FolderOpen, File, Settings, Search, Terminal, GitBranch } from 'lucide-react';

// // Import ace modes and themes
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/mode-html';
// import 'ace-builds/src-noconflict/mode-css';
// import 'ace-builds/src-noconflict/theme-monokai';

// const getFileIcon = (filename) => {
//   const extension = filename.split('.').pop().toLowerCase();
//   switch (extension) {
//     case 'js':
//     case 'jsx':
//     case 'ts':
//     case 'tsx':
//       return <Code size={16} color="#e6a23c" />;
//     case 'css':
//     case 'scss':
//     case 'less':
//       return <Code size={16} color="#409eff" />;
//     case 'html':
//     case 'xml':
//       return <Code size={16} color="#f56c6c" />;
//     case 'png':
//     case 'jpg':
//     case 'jpeg':
//     case 'gif':
//     case 'svg':
//       return <Image size={16} color="#a972cc" />;
//     default:
//       return <FileText size={16} color="#909399" />;
//   }
// };

// const getFileMode = (filename) => {
//   const extension = filename.split('.').pop().toLowerCase();
//   switch (extension) {
//     case 'js':
//     case 'jsx':
//       return 'javascript';
//     case 'ts':
//     case 'tsx':
//       return 'typescript';
//     case 'css':
//       return 'css';
//     case 'html':
//       return 'html';
//     default:
//       return 'text';
//   }
// };

// const EditorACE = () => {
//   const [files, setFiles] = useState([
//     { id: '1', name: 'index.js', content: '// Write your JavaScript here' },
//     { id: '2', name: 'styles.css', content: '/* Add your styles here */' },
//     { id: '3', name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>' },
//   ]);
//   const [activeFileId, setActiveFileId] = useState('1');
//   const [expandedFolders, setExpandedFolders] = useState({ 'src': true });

//   const handleFileChange = (newContent) => {
//     setFiles(files.map(file =>
//       file.id === activeFileId ? { ...file, content: newContent } : file
//     ));
//   };

//   const closeFile = (fileId, e) => {
//     e.stopPropagation();
//     const newFiles = files.filter(file => file.id !== fileId);
//     if (newFiles.length > 0 && fileId === activeFileId) {
//       setActiveFileId(newFiles[0].id);
//     }
//     setFiles(newFiles);
//   };

//   const toggleFolder = (folderName) => {
//     setExpandedFolders(prev => ({
//       ...prev,
//       [folderName]: !prev[folderName]
//     }));
//   };

//   const activeFile = files.find(file => file.id === activeFileId) || files[0];

//   // Base styles
//   const styles = {
//     container: {
//       display: 'flex',
//       height: '100vh',
//       backgroundColor: '#1e1e1e',
//       color: '#d4d4d4',
//       fontFamily: 'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
//     },
//     sideBar: {
//       width: '48px',
//       backgroundColor: '#333333',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       padding: '8px 0',
//     },
//     sideBarIcon: {
//       padding: '12px',
//       cursor: 'pointer',
//       borderLeft: '2px solid transparent',
//     },
//     activeSideBarIcon: {
//       borderLeft: '2px solid #007acc',
//       backgroundColor: '#2a2d2e',
//     },
//     explorer: {
//       width: '250px',
//       backgroundColor: '#252526',
//       display: 'flex',
//       flexDirection: 'column',
//       overflowY: 'auto',
//     },
//     explorerHeader: {
//       padding: '8px 16px',
//       fontWeight: 'bold',
//       fontSize: '11px',
//       textTransform: 'uppercase',
//       letterSpacing: '1px',
//     },
//     folderItem: {
//       display: 'flex',
//       alignItems: 'center',
//       padding: '4px 8px',
//       cursor: 'pointer',
//       userSelect: 'none',
//     },
//     fileItem: {
//       display: 'flex',
//       alignItems: 'center',
//       padding: '4px 8px 4px 28px',
//       cursor: 'pointer',
//       userSelect: 'none',
//     },
//     folderName: {
//       marginLeft: '8px',
//     },
//     fileName: {
//       marginLeft: '8px',
//     },
//     main: {
//       flexGrow: 1,
//       display: 'flex',
//       flexDirection: 'column',
//     },
//     tabBar: {
//       display: 'flex',
//       overflowX: 'auto',
//       backgroundColor: '#252526',
//       borderBottom: '1px solid #333333',
//     },
//     tab: (isActive) => ({
//       display: 'flex',
//       alignItems: 'center',
//       padding: '8px 16px',
//       minWidth: 0,
//       cursor: 'pointer',
//       userSelect: 'none',
//       backgroundColor: isActive ? '#1e1e1e' : '#252526',
//     }),
//     tabContent: {
//       display: 'flex',
//       alignItems: 'center',
//       maxWidth: '200px',
//     },
//     tabFileName: {
//       marginLeft: '8px',
//       whiteSpace: 'nowrap',
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//     },
//     closeButton: {
//       marginLeft: '8px',
//       padding: '4px',
//       borderRadius: '50%',
//       border: 'none',
//       background: 'transparent',
//       cursor: 'pointer',
//       color: '#d4d4d4',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     editorContainer: {
//       flexGrow: 1,
//       position: 'relative',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Left Sidebar with Icons */}
//       <div style={styles.sideBar}>
//         <div style={{ ...styles.sideBarIcon, ...styles.activeSideBarIcon }}>
//           <FileText size={24} color="#d4d4d4" />
//         </div>
//         <div style={styles.sideBarIcon}>
//           <Search size={24} color="#d4d4d4" />
//         </div>
//         <div style={styles.sideBarIcon}>
//           <GitBranch size={24} color="#d4d4d4" />
//         </div>
//         <div style={styles.sideBarIcon}>
//           <Terminal size={24} color="#d4d4d4" />
//         </div>
//         <div style={{ marginTop: 'auto', ...styles.sideBarIcon }}>
//           <Settings size={24} color="#d4d4d4" />
//         </div>
//       </div>

//       {/* Explorer Panel */}
//       <div style={styles.explorer}>
//         <div style={styles.explorerHeader}>Explorer</div>

//         {/* Folder structure */}
//         <div style={styles.folderItem} onClick={() => toggleFolder('src')}>
//           {expandedFolders['src'] ?
//             <FolderOpen size={16} color="#dcb67a" /> :
//             <Folder size={16} color="#dcb67a" />
//           }
//           <span style={styles.folderName}>src</span>
//         </div>

//         {expandedFolders['src'] && files.map(file => (
//           <div
//             key={file.id}
//             style={{
//               ...styles.fileItem,
//               backgroundColor: activeFileId === file.id ? '#37373d' : 'transparent'
//             }}
//             onClick={() => setActiveFileId(file.id)}
//           >
//             {getFileIcon(file.name)}
//             <span style={styles.fileName}>{file.name}</span>
//           </div>
//         ))}

//         <div style={styles.folderItem} onClick={() => toggleFolder('public')}>
//           {expandedFolders['public'] ?
//             <FolderOpen size={16} color="#dcb67a" /> :
//             <Folder size={16} color="#dcb67a" />
//           }
//           <span style={styles.folderName}>public</span>
//         </div>

//         {expandedFolders['public'] && (
//           <div style={styles.fileItem}>
//             <File size={16} color="#909399" />
//             <span style={styles.fileName}>index.html</span>
//           </div>
//         )}
//       </div>

//       {/* Main Editor Area */}
//       <div style={styles.main}>
//         <div style={styles.tabBar}>
//           {files.map(file => (
//             <div
//               key={file.id}
//               onClick={() => setActiveFileId(file.id)}
//               style={styles.tab(activeFileId === file.id)}
//             >
//               <div style={styles.tabContent}>
//                 {getFileIcon(file.name)}
//                 <span style={styles.tabFileName}>{file.name}</span>
//               </div>
//               <button
//                 onClick={(e) => closeFile(file.id, e)}
//                 style={styles.closeButton}
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>

//         {activeFile && (
//           <div style={styles.editorContainer}>
//             <AceEditor
//               mode={getFileMode(activeFile.name)}
//               theme="monokai"
//               onChange={handleFileChange}
//               value={activeFile.content}
//               name="ace-editor"
//               width="100%"
//               height="100%"
//               fontSize={14}
//               showPrintMargin={false}
//               showGutter={true}
//               highlightActiveLine={true}
//               setOptions={{
//                 enableBasicAutocompletion: true,
//                 enableLiveAutocompletion: true,
//                 enableSnippets: true,
//                 showLineNumbers: true,
//                 tabSize: 2,
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditorACE;


import React, { useState, useEffect, useContext } from 'react';
import AceEditor from 'react-ace';
import { FileText, X, Settings, Search, Terminal, GitBranch, ChevronUp, ChevronDown, RefreshCw, Share2, Menu, Save, Play, Moon, Sun } from 'lucide-react';
import Term from '../Terminal/Terminal';
import { themeUtil } from './IdeUtils';
// import { io } from 'socket.io-client';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-twilight';




import FileExplorer from '../FileExpo/FileExplorer';
import { getFileIcon, getFileMode } from '../utils/GetIcon';
import { ClientContext } from './ClientContext';
import { setCurrentTheme } from '../Redux/editorSlice';
import MonacoIDE from './MonacoIDE';
// import { useSelector } from 'react-redux';



// const socket = io('http://localhost:3000');




const EditorACE = () => {

  const { currentTheme, dispatch, initAndGetProvider, editorsRef, getBindings, providersRef } = useContext(ClientContext);

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);

  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showFileExplorer, setShowFileExplorer] = useState(false);

  const { theme, styles } = themeUtil(currentTheme, isExplorerOpen, showTerminal);

  const toggleTheme = () => {
    if (currentTheme === 'dark') {
      getYtext(activeFile.url);
      dispatch(setCurrentTheme('black'));
      dispatch(setEditorTheme('twilight'));
    } else {
      dispatch(setCurrentTheme('dark'));
      dispatch(setEditorTheme('monokai'));
    }
  };

  const handleFileChange = (newContent) => {
    setFiles(files.map(file =>
      file.id === activeFileId ? { ...file, content: newContent } : file
    ));
  };

  const closeFile = (fileId, e) => {
    e.stopPropagation();
    let fileIdx = files.findIndex(file => file.id === fileId);
    const newFiles = files.filter(file => file.id !== fileId);
    if (newFiles.length > 0 && fileId === activeFile.id) {
      setActiveFile(files[fileIdx - 1]);
    }
    setFiles(newFiles);
  };

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  const toggleExplorer = () => {
    setIsExplorerOpen(!isExplorerOpen);
  };

  const toggleFileExplorer = () => {
    setShowFileExplorer(!showFileExplorer);
  };

  const simulateSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFile = (e) => {

    if (activeFile) {
      const bind = getBindings(activeFile.url);
      console.log(bind);

      if (bind) {
        const provider = initAndGetProvider(activeFile.url);
        console.log(provider);

        bind.destroy();
        if (provider) {
          providersRef.current.delete(activeFile.url);
          provider.destroy();
        }
      }
      console.log(activeFile);
    }

    if (e.name) {

    }

    let curFile = files.find(f => f.id === e.id);
    if (curFile) {
      console.log("Active file Setted");

      setActiveFile(curFile);
      return;
    }
    e['name'] = e.file;
    e['binding'] = null;
    console.log(e);
    setActiveFile(e);
    setFiles([...files, e]);


  }

  useEffect(() => {
    // if (activeFile) {
    //   const bind = getBindings(activeFile.url);
    //   console.log(bind);

    //   if (bind) {
    //     const provider = initAndGetProvider(activeFile.url);
    //     console.log(provider);

    //     bind.destroy();
    //     if (provider) {
    //       provider.destroy();
    //     }
    //   }
    console.log(activeFile);
    // }

  }, [activeFile]);


  return (
    <div style={styles.container}>
      <div style={styles.menuBar}>
        <div style={styles.menuItem}>
          <Menu size={16} style={{ marginRight: '8px' }} />
          File
        </div>
        <div style={styles.menuItem}>Edit</div>
        <div style={styles.menuItem}>View</div>
        <div style={styles.menuItem}>Project</div>
        <div style={styles.menuItem} onClick={toggleTerminal}>Terminal</div>
        <div style={styles.menuItem}>Help</div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <div
            style={styles.actionButton}
            onClick={simulateSave}
          >
            <div>
              {isSaving ? <RefreshCw size={16} /> : <Save size={16} />}
            </div>
          </div>

          <div
            style={{ ...styles.actionButton, marginLeft: '4px' }}
          >
            <Play size={16} />
          </div>

          <div
            style={{ ...styles.actionButton, marginLeft: '4px' }}
          >
            <Share2 size={16} />
          </div>

          <div
            style={styles.themeToggle}
            onClick={toggleTheme}
          >
            {currentTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.sideBar}>
          <div
            style={{
              ...styles.sideBarIcon,
              ...(isExplorerOpen ? styles.activeSideBarIcon : {})
            }}
            onClick={toggleExplorer}
          >
            <FileText size={24} color={theme.text} />
          </div>
          {/* <div
            style={{
              ...styles.sideBarIcon,
              ...(showFileExplorer ? styles.activeSideBarIcon : {})
            }}
            onClick={toggleFileExplorer}
          >
            <Folder size={24} color={theme.text} />
          </div> */}
          <div
            style={styles.sideBarIcon}
          >
            <Search size={24} color={theme.text} />
          </div>
          <div
            style={styles.sideBarIcon}
          >
            <GitBranch size={24} color={theme.text} />
          </div>
          <div
            style={styles.sideBarIcon}
            onClick={toggleTerminal}
          >
            <Terminal size={24} color={theme.text} />
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div
              style={styles.sideBarIcon}
            >
              <Settings size={24} color={theme.text} />
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.explorer,
            width: isExplorerOpen ? 280 : 0
          }}
        >
          <FileExplorer isExplorerOpen={isExplorerOpen} files={files} handleFile={handleFile} />
        </div>


        {/* Main Editor Area */}
        <div style={styles.main}>
          <div style={styles.tabBar}>
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => handleFile(file)}
                style={styles.tab(activeFile.id === file.id)}
              >
                <div style={styles.tabContent}>
                  {getFileIcon(file.name)}
                  <span style={styles.tabFileName}>{file.name}</span>
                </div>
                <button
                  onClick={(e) => closeFile(file.id, e)}
                  style={styles.closeButton}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {

            activeFile && <MonacoIDE activeFile={activeFile} />
          }

        </div>
      </div>

      {/* Terminal Panel */}
      <div
        style={{
          ...styles.terminalContainer,
          height: showTerminal ? 250 : 0
        }}
      >
        <div style={styles.terminalHeader}>
          <div style={styles.terminalTitle}>Terminal</div>
          <div
            style={styles.terminalToggle}
            onClick={toggleTerminal}
          >
            {showTerminal ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </div>
        <div style={styles.terminalContent}>
          {/* <Term /> */}
        </div>
      </div>
    </div>
  );
};

export default EditorACE;