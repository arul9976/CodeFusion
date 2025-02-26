

import React, { useState, useEffect, useContext, useRef } from 'react';
import { FileText, X, Settings, Search, Terminal, GitBranch, ChevronUp, ChevronDown, RefreshCw, Share2, Menu, Save, Play, Moon, Sun } from 'lucide-react';
import Term from '../Terminal/Terminal';
import { themeUtil } from './IdeUtils';
// import { io } from 'socket.io-client';

import FileExplorer from '../FileExpo/FileExplorer';
import { getFileIcon, getFileMode } from '../utils/GetIcon';
import { ClientContext } from './ClientContext';
import { emptyTerminalHistory, setCurrentTheme, setInputWant, setTerminalHistory } from '../Redux/editorSlice';
import MonacoIDE from './MonacoIDE';
import { UserContext } from '../LogInPage/UserProvider';
import NewFile from './NewFile';
import { createFile, reNameFile } from '../utils/Fetch';
import SidebarWithExplorer from './SideBarWithExplorer';
import TabInterface from './TabInterface';
import MenuBar from './MenuBar';
import Chat from '../ChatComponents/Chat';
// import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';




// const socket = io('http://localhost:3000');

const EditorACE = () => {

  const {
    currentTheme, dispatch, initAndGetProvider, editorsRef,
    getBindings, providersRef, getYtext, language,
    code, setCurrentWorkSpace
  } = useContext(ClientContext);

  const { user } = useContext(UserContext);
  const { workspace } = useParams();

  const workspaces = useSelector(state => state.editor.workspaces);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isFileCreated, setIsFileCreated] = useState(false);
  const [unsavedFiles, setUnsavedFiles] = useState(new Map());
  const [isRename, setIsRename] = useState(null);

  const [terminalOutput, setTerminalOutput] = useState({});

  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);


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
    } else if (newFiles.length === 0) {
      setActiveFile(null);
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

  const renameHandle = (oldName) => {
    if (oldName) {
      if (oldName?.newName) {
        console.log(oldName.newName);
        reNameFile(oldName)
          .then(res => {
            console.log(res);
            if (res.success) {
              setIsRename(false);
              setIsFileCreated(prev => !prev);
            }
          })
      }
      else {
        console.log(""+oldName?.oldName, oldName?.type);

        setIsRename({
          oldName,
          newName: '',
          type: oldName?.type || 'file',
        });
      }
      console.log("Old name: " + oldName);
    } else
      setIsRename(false);

  }

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
    e['isSaved'] = true;
    console.log(e);
    setActiveFile(e);
    setFiles([...files, e]);


  }

  const handleFileMenuOpen = () => {
    console.log("File Menu Triggered!");
    if (!isFileMenuOpen) {
      setShowNewFile(false);
      setShowNewFolder(false);
    }
    setIsFileMenuOpen(!isFileMenuOpen);
  }

  const handleFileOpen = (val) => {
    console.log(val);

    if (typeof val == 'string') {
      console.log(user);

      console.log("Creating " + val);
      createFile(user.username, {
        fileName: val,
        fileContent: ""
      }, workspace).then((res) => {
        console.log(res);
        console.log(res.message);
        // setFiles(...files, {'name': res.fileName, 'id': res.fileName, 'url': res.url});
        setIsFileCreated(prev => !prev);

      })

    }
    console.log("handleFileOpen");
    setShowNewFile((prev) => !prev);
  }

  const handleFolderOpen = (val) => {
    console.log(val);

    createFile(user.username, {
      fileName: val,
    }, workspace).then((res) => {
      console.log(res);
      console.log(res.message);
      // setFiles(...files, {'name': res.folderName, 'id': res.folderName, 'url': res.url});
      setIsFileCreated(prev => !prev);
    })

    setShowNewFolder((prev) => !prev);
  }

  const getOutput = () => {
    if (!activeFile) {
      console.log("Please select a file");
      return;
    }
    const provider = initAndGetProvider(activeFile.url);
    // const yText = getYtext(activeFile.url);
    dispatch(emptyTerminalHistory());

    console.log(language, code);

    // [{
    //   "chatInfo": {
    //     "senderId": "ar@gmail.com",
    //     "recipientId": "All",
    //   }
    // }]

    provider.ws.send(JSON.stringify({
      "language": language,
      "code": code,
      "event": "compile"
    }));


    provider.ws.onmessage = (event) => {
      console.log(event, typeof event.data);

      if (typeof event.data === 'string') {
        const res = JSON.parse(event.data);
        console.log(res.data);
        setShowTerminal(true);
        if (res.event === 'output') {
          // inputWantRef.current = res.input;
          let data = res.data;
          console.log(data, data.length);

          if (data.length > 21) {
            data = res.data.splice(Math.max(res.data.length - 20, 0), 20);
          }
          dispatch(setInputWant({ isWant: res.input }));
          dispatch(setTerminalHistory([{ content: data.join("\n"), type: res.input ? 'input' : 'output' }]));
        }
        else if (res.event === 'error') {
          // inputWantRef.current = res.input;
          let response = res.data;
          console.log(response, response.length);
          dispatch(setInputWant({ isWant: res.input }));
          dispatch(setTerminalHistory([{ content: response, type: 'error' }]));
        }
      }
    };


    // provider.ws.on('message', (event) => {
    //   console.log(event);

    //   if (event.type === 'connected') {
    //     console.log('Connected to WebSocket server');
    //   }
    // });

  }

  // const stylesChat = {
  //   chat: {
  //     position: 'absolute',
  //     right: 0,
  //     top: 0,
  //     zIndex: 1000
  //   },
  // }

  // useEffect(() => {
  //   if (files.length === 0) {
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
  //     console.log("Current User --> " + user);
  //   }

  // }, [files]);



  useEffect(() => {
    console.log(workspace);

    if (!workspaces.some(ws => ws.workspaceName === workspace)) {
      navigate('/notfound');
    } else {
      setCurrentWorkSpace(workspace);
    }
  }, [])

  return (
    <div style={styles.container}>

      {/* <div style={styles.menuBar}>
        <div style={styles.menuItem} onClick={handleFileOpen}>
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
            <Play onClick={getOutput} size={16} />
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
      </div> */}

      <MenuBar
        handleFileOpen={handleFileOpen}
        setShowTerminal={setShowTerminal}
        getOutput={getOutput}
        handleFileMenuOpen={handleFileMenuOpen}
        isFileMenuOpen={isFileMenuOpen}
        isFileOpen={showNewFile}
        handleFolderOpen={handleFolderOpen}
      />

      <div style={{
        display: 'flex',
        height: '100%',
        position: 'relative'
      }}>
        <SidebarWithExplorer isExplorerOpen={isExplorerOpen}
          toggleExplorer={toggleExplorer}
          toggleTerminal={toggleTerminal}
          theme={currentTheme}
          files={files}
          handleFile={handleFile}
          setIsChatOpen={setIsChatOpen}
          isFileCreated={isFileCreated}
          setIsFileCreated={setIsFileCreated}
          renameHandle={renameHandle} />

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isChatOpen ? '430px' : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            ...styles.chat,
            overflow: 'hidden'
          }}
        >
          <Chat isChatOpen={isChatOpen} />
        </motion.div>
        {/* Main Editor Area */}
        {/* <div style={styles.main}>
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
          {
            showNewFile && <NewFile fileOnClick={handleFileOpen} />
          }

        </div> */}

        <TabInterface files={files}
          activeFile={activeFile}
          handleFile={handleFile}
          closeFile={closeFile}
          showNewFile={showNewFile}
          showNewFolder={showNewFolder}
          handleFileOpen={handleFileOpen}
          handleFolderOpen={handleFolderOpen}
          cPath={workspace}
          unsavedFiles={unsavedFiles}
          setUnsavedFiles={setUnsavedFiles}
          isRename={isRename}
          handleRename={renameHandle}
        />

      </div>


      <div
        style={{
          ...styles.terminalContainer,
          height: showTerminal ? 500 : 0
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

        <Term />
      </div>
    </div >
  );
};

export default EditorACE;