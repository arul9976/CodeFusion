// "use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, CircleX, X } from "lucide-react";
import { getFileIcon } from '../utils/GetIcon';
import MonacoIDE from './MonacoIDE';
import NewFile from './NewFile';
import NewFolder from './NewFolder';
import FileMenu from './File/FIleMenu';
import { ClientContext } from './ClientContext';
import { saveFile } from '../utils/Fetch';
import Rename from '../FileExpo/Rename';
// import Help from '../Help/Help';

const TabInterface = ({
  files,
  activeFile,
  handleFile,
  closeFile,
  showNewFile,
  showNewFolder,
  handleFileOpen,
  handleFolderOpen,
  cPath,
  unsavedFiles,
  setUnsavedFiles,
  isRename,
  handleRename
}) => {

  useEffect(() => {
    if (files)
      console.log(files);

  }, [files])


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#0F172A',
        overflow: 'hidden'
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          overflowX: 'auto',
          backgroundColor: '#1E293B',
          borderBottom: '1px solid #334155',
          minHeight: '40px',
          padding: '0 4px',
          gap: '2px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #1E293B'
        }}
      >
        <AnimatePresence mode="popLayout">
          {files.map((file, idx) => (
            <FileComp
              activeFile={activeFile}
              closeFile={closeFile}
              file={file}
              handleFile={handleFile}
              setUnsavedFiles={setUnsavedFiles}
              unsavedFiles={unsavedFiles}
              key={idx}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#0F172A'
      }}>
        <AnimatePresence mode="wait">
          {activeFile && (
            <motion.div
              key={activeFile.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0
              }}
            >
              {activeFile && <MonacoIDE activeFile={activeFile} />}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNewFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <NewFile fileOnClick={handleFileOpen} currentPath={cPath} />
            </motion.div>
          )}

          {showNewFolder &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <NewFolder fileOnClick={handleFolderOpen} currentPath={cPath} />
            </motion.div>}

          {
            isRename &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Rename isRename={isRename} fileOnClick={handleRename} currentPath={cPath} />
            </motion.div>
          }

        </AnimatePresence>
      </div>
    </motion.div>
  );
};



const FileComp = ({
  file,
  activeFile,
  unsavedFiles,
  setUnsavedFiles,
  handleFile,
  closeFile
}) => {

  const isSaved = useRef(true);
  const { code } = useContext(ClientContext);
  // const [prevActiveFile, setPrevActiveFile] = useState({ 'a': 1 });

  // useEffect(() => {
  //   console.log("Code --> " + isSaved.current, activeFile.id);

  //   if (isSaved.current && activeFile)
  //     isSaved.current = false;
  // }, [code])


  useEffect(() => {
    // console.log(activeFile, unsavedFiles, isSaved);

    if (activeFile && isSaved.current) {
      isSaved.current = false;
    }

    if (activeFile && unsavedFiles.has(activeFile.id)) {
      return;
    }

    if (activeFile) {
      // if (prevActiveFile?.id === activeFile.id) {
      //   return;
      // }
      isSaved.current = activeFile.isSaved;
      if (!unsavedFiles.has(activeFile.id) && !isSaved.current) {
        console.log("ADD ");

        console.log(activeFile);
        setUnsavedFiles((prev) => {
          const tempMap = new Map(prev);
          return tempMap.set(activeFile.id, activeFile.id);
        });
        console.log(unsavedFiles);
      }
      else {
        activeFile.isSaved = false;
      }
      // setPrevActiveFile(activeFile);

    }
    // if (activeFile && !isSaved.current) {
    //   isSaved.current = true;
    // }

  }, [code, activeFile])


  useEffect(() => {

    const handleKeyDown = (event) => {

      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        console.log("Save ");

        console.log('Custom save functionality triggered! ' + activeFile, code + " END");
        if (activeFile && unsavedFiles.has(activeFile.id)) {
          saveFile(unsavedFiles.get(activeFile.id), code)
            .then(data => {
              if (data) {
                console.log("Save Success")
                setUnsavedFiles(prev => {
                  const tempMap = new Map(prev);
                  tempMap.delete(activeFile.id);
                  console.log(tempMap);
                  return tempMap;
                });
                isSaved.current = true;
              } else {
                console.log("Save Failed")
              }
            })
        } else {
          console.log("NO Active File Found");

        }
      }

    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };



  }, [activeFile, code, unsavedFiles])

  return (
    <motion.div
      key={file.id}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, width: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => handleFile(file)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        height: '40px',
        cursor: 'pointer',
        backgroundColor: activeFile?.id === file.id ? 'rgb(45, 55, 72)' : 'rgba(31, 41, 55, 1)',
        borderRight: '1px solid #334155',
        minWidth: 0,
        flexShrink: 0,
        position: 'relative'
      }}
      whileHover={{
        backgroundColor: activeFile?.id === file.id ? 'rgb(45, 55, 72)' : 'rgba(31, 41, 55, 1)'
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '160px'
        }}
      >
        {getFileIcon(file.name)}

        {unsavedFiles.has(file.id) && (
          // <motion.div
          //   style={{
          //     position: 'absolute',
          //     top: '-2px',
          //     right: '-4px',
          //     width: '8px',
          //     height: '8px',
          //     backgroundColor: 'red',
          //     borderRadius: '50%',
          //   }}
          //   animate={{ opacity: [0.5, 1], scale: [0.8, 1] }}
          //   transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          // />
          <motion.div
            initial={false}
            animate={{
              opacity: isSaved ? 1 : 0,
              scale: isSaved ? 1 : 0.8,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <motion.div
              initial={false}
              animate={{
                rotate: isSaved ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                repeat: isSaved ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 5,
              }}
              className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center"
            >
              <AlertCircle className="text-amber-600 dark:text-amber-400" size={14} />
            </motion.div>
          </motion.div>
        )}
        <span style={{
          color: '#E2E8F0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {file.name}
        </span>
      </motion.div>

      {/* <Help/> */}

      <motion.button
        whileHover={{ backgroundColor: 'rgb(75, 85, 99)' }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => closeFile(file.id, e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          marginLeft: '8px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: 'rgb(75, 85, 99, 0)',
          cursor: 'pointer',
          color: '#94A3B8'
        }}
      >
        <X size={14} />
      </motion.button>


      {activeFile?.id === file.id && (
        <motion.div
          layoutId="activeTab"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#3B82F6'
          }}
        />
      )}
    </motion.div>
  )
}

export default TabInterface;