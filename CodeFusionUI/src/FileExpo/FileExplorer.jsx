
import React, { useContext, useEffect, useState } from 'react';
import { Folder, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"
import { getFileIcon } from '../utils/GetIcon';
import { UserContext } from '../LogInPage/UserProvider';
import Profile from '../WorkSpace/Profile';
import { useParams } from 'react-router-dom';
const FileExplorer = ({ isExplorerOpen, files, handleFile, isFileCreated }) => {
  const { user } = useContext(UserContext);
  const [fileData, setFileData] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const { workspace } = useParams();
  useEffect(() => {
    const fetchFiles = async () => {
      console.log(workspace);
      
      try {
        // const response = await fetch(`http://172.17.22.225:3000/list-all-files/${user.username}`);
        const response = await fetch(`${import.meta.env.VITE_RUNNER_URL}/list-all-files/${user.username}/${workspace}`);

        if (response.status === 200) {
          const data = await response?.json();
          setFileData(data[user.username]);
        } else {
          setFileData([]);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [user, isExplorerOpen, isFileCreated]);

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
  }, [isExplorerOpen]);

  useEffect(() => {
    console.log("In File Explorer");

  }, [files])

  const renderFiles = (files, parentPath = '', id = 0) => {
    return (
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          marginLeft: parentPath ? '20px' : 0
        }}
      >
        {files.map((fileOrFolder) => {
          if (fileOrFolder.file) {
            if (!fileOrFolder.id) {
              fileOrFolder['id'] = fileOrFolder.url;
            }

            return (
              <motion.li
                key={fileOrFolder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ backgroundColor: "#2D3748" }}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  marginBottom: "2px"
                }}
                onClick={() => handleFile(fileOrFolder)}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#E2E8F0"
                }}>
                  {getFileIcon(fileOrFolder.file)}
                  <span>{fileOrFolder.file}</span>
                </div>
              </motion.li>
            );
          } else if (typeof fileOrFolder === 'object') {
            const folderName = Object.keys(fileOrFolder)[0];
            const folderContents = Object.values(fileOrFolder)[0];
            const currentPath = `${parentPath}/${folderName}`;
            const isExpanded = expandedFolders[currentPath] !== false;

            return (
              <motion.li
                key={`${parentPath}/${folderName}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: "2px" }}
              >
                <motion.button
                  whileHover={{ backgroundColor: "#2D3748" }}
                  onClick={() => toggleFolder(currentPath)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#E2E8F0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                  <Folder size={16} style={{ color: "#3B82F6" }} />
                  <span>{folderName}</span>
                </motion.button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      {renderFiles(folderContents, currentPath, id)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          }
          return null;
        })}
      </motion.ul>
    );
  };

  if (!fileData) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        color: "#E2E8F0"
      }}>
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: "24px",
            height: "24px",
            border: "3px solid #3B82F6",
            borderTopColor: "transparent",
            borderRadius: "50%"
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        backgroundColor: "#1E293B",
        borderRadius: "16px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{
        padding: "20px",
        backgroundColor: "#0F172A",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <div style={{
          width: "32px",
          height: "32px",
          backgroundColor: "#3B82F6",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold"
        }}>
          {(user.profilePic && <Profile />) || user.username.slice(0, 1).toUpperCase()}
        </div>
        <h1 style={{
          margin: 0,
          fontSize: "1.25rem",
          color: "#E2E8F0",
          fontWeight: "bold"
        }}>
          {user.username.length > 9 ? user.username.substring(0, 9) + "..." : user.username}'s Files
        </h1>
      </div>

      <div style={{
        padding: "20px",
        overflow: "auto",
        flex: 1
      }}>
        {fileData.length === 0 ? (
          <p style={{
            textAlign: "center",
            color: "#94A3B8",
            fontSize: "0.875rem"
          }}>
            No files or folders found for this user.
          </p>
        ) : (
          renderFiles(fileData)
        )}
      </div>
    </motion.div>
  );
};

export default FileExplorer;