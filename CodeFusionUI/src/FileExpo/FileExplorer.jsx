
// import React, { useContext, useEffect, useState } from 'react';
// import { Folder, ChevronRight } from 'lucide-react';
// import { motion, AnimatePresence } from "framer-motion"
// import { getFileIcon } from '../utils/GetIcon';
// import { UserContext } from '../LogInPage/UserProvider';
// import Profile from '../WorkSpace/Profile';
// import { useParams } from 'react-router-dom';
// const FileExplorer = ({ isExplorerOpen, files, handleFile, isFileCreated }) => {
//   const { user } = useContext(UserContext);
//   const [fileData, setFileData] = useState(null);
//   const [expandedFolders, setExpandedFolders] = useState({});
//   const { workspace } = useParams();

//   const [isFileRightClick, setIsFileRightClick] = useState(false);

//   const handleRightClick = () => {
//     console.log("Right Clicked");
//     setIsFileRightClick((prev) => !prev);
//   }

//   useEffect(() => {
//     const fetchFiles = async () => {
//       console.log(workspace);

//       try {
//         // const response = await fetch(`http://172.17.22.225:3000/list-all-files/${user.username}`);
//         const response = await fetch(`${import.meta.env.VITE_RUNNER_URL}/list-all-files/${user.username}/${workspace}`);

//         if (response.status === 200) {
//           const data = await response?.json();
//           setFileData(data[user.username]);
//         } else {
//           setFileData([]);
//         }
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };
//     fetchFiles();
//   }, [user, isExplorerOpen, isFileCreated]);

//   const toggleFolder = (folderPath) => {
//     setExpandedFolders(prev => ({
//       ...prev,
//       [folderPath]: !prev[folderPath]
//     }));
//   };

//   useEffect(() => {
//     if (!isExplorerOpen) {
//       setFileData(null);
//     }
//   }, [isExplorerOpen]);

//   useEffect(() => {
//     console.log("In File Explorer");

//   }, [files])

//   const renderFiles = (files, parentPath = '', id = 0) => {
//     return (
//       <motion.ul
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         style={{
//           listStyle: 'none',
//           padding: 0,
//           margin: 0,
//           marginLeft: parentPath ? '20px' : 0
//         }}
//       >
//         {files.map((fileOrFolder) => {
//           if (fileOrFolder.file) {
//             if (!fileOrFolder.id) {
//               fileOrFolder['id'] = fileOrFolder.url;
//             }

//             return (

//               <>
//                 <motion.li
//                   key={fileOrFolder.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   whileHover={{ backgroundColor: "#2D3748" }}
//                   style={{
//                     padding: "8px 12px",
//                     cursor: "pointer",
//                     borderRadius: "6px",
//                     marginBottom: "2px",
//                     position: 'relative'
//                   }}
//                   onClick={() => handleFile(fileOrFolder)}
//                 >
//                   <div style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     color: "#E2E8F0"
//                   }}>
//                     {getFileIcon(fileOrFolder.file)}
//                     <span>{fileOrFolder.file}</span>

//                   </div>


//                 </motion.li>


//               </>

//             );
//           } else if (typeof fileOrFolder === 'object') {
//             const folderName = Object.keys(fileOrFolder)[0];
//             const folderContents = Object.values(fileOrFolder)[0];
//             const currentPath = `${parentPath}/${folderName}`;
//             const isExpanded = expandedFolders[currentPath] !== false;

//             return (
//               <motion.li
//                 key={`${parentPath}/${folderName}`}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 style={{ marginBottom: "2px" }}
//               >
//                 <motion.button
//                   whileHover={{ backgroundColor: "#2D3748" }}
//                   onClick={() => toggleFolder(currentPath)}
//                   style={{
//                     width: "100%",
//                     padding: "8px 12px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#E2E8F0",
//                     borderRadius: "6px",
//                     fontSize: "14px"
//                   }}
//                 >
//                   <motion.div
//                     animate={{ rotate: isExpanded ? 90 : 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <ChevronRight size={16} />
//                   </motion.div>
//                   <Folder size={16} style={{ color: "#3B82F6" }} />
//                   <span>{folderName}</span>
//                 </motion.button>
//                 <AnimatePresence>
//                   {isExpanded && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.2 }}
//                       style={{ overflow: "hidden" }}
//                     >
//                       {renderFiles(folderContents, currentPath, id)}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.li>
//             );
//           }
//           return null;
//         })}
//       </motion.ul>
//     );
//   };

//   if (!fileData) {
//     return (
//       <div style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "200px",
//         color: "#E2E8F0"
//       }}>
//         <motion.div
//           animate={{
//             rotate: 360
//           }}
//           transition={{
//             duration: 1,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//           style={{
//             width: "24px",
//             height: "24px",
//             border: "3px solid #3B82F6",
//             borderTopColor: "transparent",
//             borderRadius: "50%"
//           }}
//         />
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       style={{
//         backgroundColor: "#1E293B",
//         borderRadius: "16px",
//         overflow: "hidden",
//         height: "100%",
//         display: "flex",
//         flexDirection: "column"
//       }}
//     >
//       <div style={{
//         padding: "20px",
//         backgroundColor: "#0F172A",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px"
//       }}>
//         <div style={{
//           width: "32px",
//           height: "32px",
//           backgroundColor: "#3B82F6",
//           borderRadius: "50%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "white",
//           fontWeight: "bold"
//         }}>
//           {(user.profilePic && <Profile />) || user.username.slice(0, 1).toUpperCase()}
//         </div>
//         <h1 style={{
//           margin: 0,
//           fontSize: "1.25rem",
//           color: "#E2E8F0",
//           fontWeight: "bold"
//         }}>
//           {user.username.length > 9 ? user.username.substring(0, 9) + "..." : user.username}'s Files
//         </h1>
//       </div>

//       <div style={{
//         padding: "20px",
//         overflow: "auto",
//         flex: 1
//       }}>
//         {fileData.length === 0 ? (
//           <p style={{
//             textAlign: "center",
//             color: "#94A3B8",
//             fontSize: "0.875rem"
//           }}>
//             No files or folders found for this user.
//           </p>
//         ) : (
//           renderFiles(fileData)
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default FileExplorer;


import React, { useContext, useEffect, useState, useRef } from 'react';
import { Folder, ChevronRight, Copy, Trash, Edit2, Scissors, Clipboard, X, MoreHorizontal, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { getFileIcon } from '../utils/GetIcon';
import { UserContext } from '../LogInPage/UserProvider';
import Profile from '../WorkSpace/Profile';
import { useParams } from 'react-router-dom';
import { deleteFileOrFolder, pasteFileToPath } from '../utils/Fetch';
import { MdPreview } from 'react-icons/md';
import { usePopup } from '../PopupIndication/PopUpContext';
import { useWebSocket } from '../Websocket/WebSocketProvider';

const FileExplorer = ({ isExplorerOpen, renameHandle, handleFile, isFileCreated, setIsFileCreated }) => {

  const { ownername } = useParams();

  const { user } = useContext(UserContext);
  const [fileData, setFileData] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const { workspace } = useParams();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, type: null });
  const [activeAction, setActiveAction] = useState(null);
  const explorerRef = useRef(null);
  const menuRef = useRef(null);

  const [copy, setCopy] = useState(null);

  const { showPopup } = usePopup();
  const { socket } = useWebSocket();

  const handlePaste = (pathToCopy) => {
    if (copy?.url) {
      console.log("Paste", pathToCopy);

      pasteFileToPath({ pastePath: pathToCopy, file: copy.url, type: copy.type, fileType: copy.fileType })
        .then(res => {
          console.log(res);
          setIsFileCreated(prev => !prev);
          if (res.success) {
            showPopup(`${pathToCopy.type == 'file' ? 'File' : 'Folder'} Pasted Successfully`, 'success', 3000);
            socket.send(JSON.stringify({
              event: 'file_system',
              message: `${user.username} ${copy.type} a ${copy.fileType} from ${copy.url} to ${pathToCopy}`,
              roomId: `${ownername}$${workspace}`
            }));
          } else {
            showPopup(res.message, 'warning', 3000);
          }
        }).catch(e => {
          showPopup('Paste Failed', 'error', 3000);
        })

    } else {
      console.error("No file to paste.");
    }
  }


  useEffect(() => {
    console.log("COPY --> " + copy?.url, copy?.type);

  }, [copy])
  useEffect(() => {
    const fetchFiles = async () => {
      console.log(workspace);

      try {
        const response = await fetch(`${import.meta.env.VITE_RUNNER_URL}/list-all-files/${ownername}/${workspace}`);

        if (response.status === 200) {
          const data = await response?.json();
          setFileData(data[ownername]);
        } else {
          setFileData([]);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [isFileCreated, user, isExplorerOpen]);

  const toggleFolder = (folderPath, e) => {
    if (e && e.target.closest('.context-menu-trigger')) {
      return;
    }

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
    const handleClickOutside = (event) => {
      if (contextMenu.visible && menuRef.current && !menuRef.current.contains(event.target)) {
        closeContextMenu();
      }
    };

    const handleScroll = () => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && contextMenu.visible) {
        closeContextMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu]);

  const handleRightClick = (e, item, type = 'file') => {
    e.preventDefault();
    e.stopPropagation();

    if (type === 'folder')
      item = `${ownername}/${workspace}${item}`
    console.log("Path --> " + item);

    const explorerRect = explorerRef.current.getBoundingClientRect();
    const x = e.clientX - explorerRect.left;
    const y = e.clientY - explorerRect.top;

    if (contextMenu.visible) {
      closeContextMenu();
      setTimeout(() => {
        setContextMenu({
          visible: true,
          x,
          y,
          item,
          type
        });
      }, 150);
    } else {
      setContextMenu({
        visible: true,
        x,
        y,
        item,
        type
      });
    }
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleContextMenuAction = (action) => {
    setActiveAction(action);

    setTimeout(() => {
      console.log(`${action} action triggered for ${contextMenu.item + ""}:`,
        contextMenu.type === 'file' ? contextMenu.item?.file : Object.keys(contextMenu.item)[0]);

      switch (action) {
        case 'preview':
          window.open(import.meta.env.VITE_RUNNER_URL + contextMenu.item.url, '_blank')
          break;
        case 'copy':
          const furl = contextMenu.item?.url ? contextMenu.item.url : '/codefusion/' + contextMenu.item;
          console.log("Foder Url " + furl);

          setCopy({
            type: 'copy',
            url: furl,
            fileType: contextMenu.item?.url ? 'file' : 'folder'

          });
          break;
        case 'delete':
          const fileUrl = contextMenu.item?.url ? contextMenu.item.url : '/codefusion/' + contextMenu.item
          deleteFileOrFolder({ 'url': fileUrl, 'type': ((contextMenu.item?.url) ? 'file' : 'folder') })
            .then(res => {
              console.log(res);
              setIsFileCreated(prev => !prev);
              if (res.success) {
                showPopup(`${((contextMenu.item?.url) ? 'File' : 'Folder')} Deleted Successfully`, 'success', 3000)
                socket.send(JSON.stringify({
                  event: 'file_system',
                  message: `${user.username} Deleted a ${((contextMenu.item?.url) ? 'File ' + contextMenu.item.file : 'Folder ' + contextMenu.item)}`,
                  roomId: `${ownername}$${workspace}`
                }));
              }else {
                showPopup(res.message, 'error', 3000);
              }
            })
          break;
        case 'rename':
          if (contextMenu.item?.url) {
            renameHandle({ ...contextMenu.item, type: 'file' });

          } else {
            renameHandle({
              type: 'folder',
              file: contextMenu.item.split('/').at(-1),
              url: '/codefusion/' + contextMenu.item
            });
          }
          console.log(contextMenu.item);

          break;
        case 'cut':
          const curl = contextMenu.item?.url ? contextMenu.item.url : '/codefusion/' + contextMenu.item;
          console.log("Foder Url " + curl);

          setCopy({
            type: 'cut',
            url: curl,
            fileType: contextMenu.item?.url ? 'file' : 'folder'
          });
          break;
        case 'paste':
          console.log(contextMenu.item);
          handlePaste(contextMenu.item);
          break;

        default:
          break;
      }

      setActiveAction(null);
      closeContextMenu();
    }, 500);
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };

  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;

    let menuItems = [];

    const commonActions = [
      { icon: <Copy size={16} />, label: 'Copy', action: 'copy' },
      { icon: <Edit2 size={16} />, label: 'Rename', action: 'rename' },
      { icon: <Scissors size={16} />, label: 'Cut', action: 'cut' },
      { icon: <Trash size={16} />, label: 'Delete', action: 'delete' },
    ];

    if (contextMenu.type === 'file') {
      menuItems = [
        ...commonActions
      ];
      if (contextMenu.item.file.split('.')[1] === 'html') {

        menuItems = [
          {
            icon: <MdPreview size={16} />, label: 'Preview', action: 'preview'
          },
          ...commonActions,
        ];
      }
    } else if (contextMenu.type === 'folder') {
      menuItems = [
        ...commonActions,
        { icon: <Clipboard size={16} />, label: 'Paste', action: 'paste' },
      ];
    }

    const maxWidth = explorerRef.current?.clientWidth || 400;
    const maxHeight = explorerRef.current?.clientHeight || 600;
    const menuWidth = 220;
    const menuHeight = contextMenu.type === 'folder' ? 340 : 280;

    let xPos = contextMenu.x;
    let yPos = contextMenu.y;

    if (xPos + menuWidth > maxWidth) {
      xPos = maxWidth - menuWidth - 10;
    }

    if (yPos + menuHeight > maxHeight) {
      yPos = maxHeight - menuHeight - 10;
    }

    const itemName = contextMenu.type === 'file'
      ? contextMenu.item?.file
      : contextMenu.item?.split("/").at(-1);

    return (
      <motion.div
        ref={menuRef}
        className="context-menu"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: 'absolute',
          top: `${yPos}px`,
          left: `${xPos}px`,
          backgroundColor: 'rgba(20, 30, 50, 0.98)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          zIndex: 1000,
          width: menuWidth,
          transformOrigin: 'top left'
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            backgroundColor: 'rgba(10, 20, 40, 0.7)'
          }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {contextMenu.type === 'file'
                ? getFileIcon(contextMenu.item?.file)
                : <Folder size={16} style={{ color: "#3B82F6" }} />
              }
            </motion.div>
            <motion.span
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                color: '#E2E8F0',
                fontSize: '14px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '140px'
              }}
            >
              {itemName}
            </motion.span>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'none',
              border: 'none',
              borderRadius: '4px',
              padding: '4px',
              cursor: 'pointer',
              color: '#94A3B8'
            }}
            onClick={closeContextMenu}
          >
            <X size={14} />
          </motion.button>
        </motion.div>
        <div style={{ padding: '6px' }}>
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              custom={index}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                x: 5,
                transition: { duration: 0.1 }
              }}
              whileTap={{ scale: 0.97 }}
              disabled={activeAction !== null}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: activeAction === item.action ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: activeAction === null ? 'pointer' : 'default',
                color: '#E2E8F0',
                textAlign: 'left',
                fontSize: '14px',
                margin: '2px 0',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => handleContextMenuAction(item.action)}
            >
              <span style={{
                color: activeAction === item.action ? '#60A5FA' : '#6B7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.icon}
              </span>
              {item.label}

              {activeAction === item.action && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#3B82F6',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  const fileItemVariants = {
    hover: {
      backgroundColor: '#2D3748',
      x: 5,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const fileIconVariants = {
    initial: { scale: 0, rotate: -20 },
    animate: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 400 } }
  };

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
        {files.map((fileOrFolder, index) => {
          if (fileOrFolder.file) {
            if (!fileOrFolder.id) {
              fileOrFolder['id'] = fileOrFolder.url;
            }

            return (
              <motion.li
                key={fileOrFolder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: index * 0.03 }
                }}
                variants={fileItemVariants}
                whileHover="hover"
                whileTap="tap"
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  position: 'relative',
                  backgroundColor: contextMenu.type === 'file' && contextMenu.item?.id === fileOrFolder.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  border: contextMenu.type === 'file' && contextMenu.item?.id === fileOrFolder.id ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
                }}
                onClick={() => handleFile(fileOrFolder)}
                onContextMenu={(e) => handleRightClick(e, fileOrFolder, 'file')}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#E2E8F0"
                }}>
                  <motion.div
                    variants={fileIconVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {getFileIcon(fileOrFolder.file)}
                  </motion.div>
                  <span style={{ flex: 1 }}>{fileOrFolder.file}</span>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{ opacity: 0.5, cursor: 'pointer' }}
                    className="context-menu-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRightClick(e, fileOrFolder, 'file');
                    }}
                  >
                    <MoreHorizontal size={16} color="#94A3B8" />
                  </motion.div>
                </div>

                {contextMenu.type === 'file' && contextMenu.item?.id === fileOrFolder.id && (
                  <motion.div
                    layoutId="activeItemIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '70%',
                      backgroundColor: '#3B82F6',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}
              </motion.li>
            );
          } else if (typeof fileOrFolder === 'object') {
            const folderName = Object.keys(fileOrFolder)[0];
            const folderContents = Object.values(fileOrFolder)[0];
            const currentPath = `${parentPath}/${folderName}`;
            const isExpanded = expandedFolders[currentPath] !== false;
            const folderId = `folder-${parentPath}-${folderName}`;
            const isActive = contextMenu.type === 'folder' &&
              contextMenu.item &&
              Object.keys(contextMenu.item)[0] === folderName;
            // console.log(Object.entries(fileOrFolder));

            return (
              <motion.li
                key={folderId}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: index * 0.03 }
                }}
                style={{
                  marginBottom: "4px",
                  position: 'relative',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  borderRadius: "8px",
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
                }}
                onContextMenu={(e) => handleRightClick(e, currentPath, 'folder')}
              >
                <motion.div
                  whileHover={{ backgroundColor: "#2D3748", x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => toggleFolder(currentPath, e)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#E2E8F0",
                    borderRadius: "8px",
                    fontSize: "14px"
                  }}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Folder size={16} style={{ color: "#3B82F6" }} />
                  </motion.div>
                  <span style={{ flex: 1 }}>{folderName}</span>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{ opacity: 0.5, cursor: 'pointer' }}
                    className="context-menu-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRightClick(e, currentPath, 'folder');
                    }}
                  >
                    <MoreHorizontal size={16} color="#94A3B8" />
                  </motion.div>
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="activeItemIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: '70%',
                      backgroundColor: '#3B82F6',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, type: "spring", stiffness: 200, damping: 25 },
                          opacity: { duration: 0.5 }
                        }
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2 },
                          opacity: { duration: 0.1 }
                        }
                      }}
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
      ref={explorerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        backgroundColor: "#1E293B",
        borderRadius: "16px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div style={{
        padding: "20px",
        backgroundColor: "#0F172A",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
      }}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#3B82F6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
          }}
        >
          {(user.profilePic && <Profile />) || user.username.slice(0, 1).toUpperCase()}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            margin: 0,
            fontSize: "1.25rem",
            color: "#E2E8F0",
            fontWeight: "bold"
          }}
        >
          {ownername.length > 9 ? ownername.substring(0, 9) + "..." : ownername}'s Files
        </motion.h1>
      </div>

      <div style={{
        padding: "20px",
        overflow: "auto",
        flex: 1
      }}>
        {fileData.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              textAlign: "center",
              color: "#94A3B8",
              fontSize: "0.875rem",
              padding: "40px 20px"
            }}
          >
            No files or folders found for this user.
          </motion.p>
        ) : (
          renderFiles(fileData)
        )}
      </div>

      <AnimatePresence>
        {contextMenu.visible && renderContextMenu()}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileExplorer;



// import React, { useContext, useEffect, useState, useRef } from 'react';
// import { Folder, ChevronRight, Copy, Trash, Edit2, Scissors, Clipboard, X, MoreHorizontal } from 'lucide-react';
// import { motion, AnimatePresence } from "framer-motion";
// import { getFileIcon } from '../utils/GetIcon';
// import { UserContext } from '../LogInPage/UserProvider';
// import Profile from '../WorkSpace/Profile';
// import { useParams } from 'react-router-dom';

// const FileExplorer = ({ isExplorerOpen, files, handleFile, isFileCreated }) => {
//   const { user } = useContext(UserContext);
//   const [fileData, setFileData] = useState(null);
//   const [expandedFolders, setExpandedFolders] = useState({});
//   const { workspace } = useParams();
//   const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });
//   const [activeAction, setActiveAction] = useState(null);
//   const explorerRef = useRef(null);
//   const menuRef = useRef(null);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       console.log(workspace);

//       try {
//         const response = await fetch(`${import.meta.env.VITE_RUNNER_URL}/list-all-files/${user.username}/${workspace}`);

//         if (response.status === 200) {
//           const data = await response?.json();
//           setFileData(data[user.username]);
//         } else {
//           setFileData([]);
//         }
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };
//     fetchFiles();
//   }, [user, isExplorerOpen, isFileCreated]);

//   const toggleFolder = (folderPath) => {
//     setExpandedFolders(prev => ({
//       ...prev,
//       [folderPath]: !prev[folderPath]
//     }));
//   };

//   useEffect(() => {
//     if (!isExplorerOpen) {
//       setFileData(null);
//     }
//   }, [isExplorerOpen]);

//   useEffect(() => {
//     // Close context menu when clicking outside
//     const handleClickOutside = (event) => {
//       if (contextMenu.visible && menuRef.current && !menuRef.current.contains(event.target)) {
//         closeContextMenu();
//       }
//     };

//     // Handle scroll to close context menu
//     const handleScroll = () => {
//       if (contextMenu.visible) {
//         closeContextMenu();
//       }
//     };

//     // Handle escape key
//     const handleKeyDown = (event) => {
//       if (event.key === 'Escape' && contextMenu.visible) {
//         closeContextMenu();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('scroll', handleScroll);
//     document.addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('scroll', handleScroll);
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [contextMenu]);

//   const handleRightClick = (e, file) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // Calculate position relative to the explorer container
//     const explorerRect = explorerRef.current.getBoundingClientRect();
//     const x = e.clientX - explorerRect.left;
//     const y = e.clientY - explorerRect.top;

//     // Close existing menu with animation before opening new one
//     if (contextMenu.visible) {
//       closeContextMenu();
//       setTimeout(() => {
//         setContextMenu({
//           visible: true,
//           x,
//           y,
//           file
//         });
//       }, 150);
//     } else {
//       setContextMenu({
//         visible: true,
//         x,
//         y,
//         file
//       });
//     }
//   };

//   const closeContextMenu = () => {
//     setContextMenu({ ...contextMenu, visible: false });
//   };

//   const handleContextMenuAction = (action) => {
//     // Set active action for animation
//     setActiveAction(action);

//     // Simulate action processing
//     setTimeout(() => {
//       console.log(`${action} action triggered for file:`, contextMenu.file);

//       // You would implement the actual functionality here
//       switch (action) {
//         case 'copy':
//           // Copy file logic
//           break;
//         case 'delete':
//           // Delete file logic
//           break;
//         case 'rename':
//           // Rename file logic
//           break;
//         case 'cut':
//           // Cut file logic
//           break;
//         case 'paste':
//           // Paste file logic
//           break;
//         default:
//           break;
//       }

//       // Reset active action and close menu
//       setActiveAction(null);
//       closeContextMenu();
//     }, 500);
//   };

//   // Animation variants for menu items
//   const menuItemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: i => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.05,
//         duration: 0.2,
//         ease: [0.4, 0, 0.2, 1]
//       }
//     }),
//     exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
//   };

//   const renderContextMenu = () => {
//     if (!contextMenu.visible) return null;

//     const menuItems = [
//       { icon: <Copy size={16} />, label: 'Copy', action: 'copy' },
//       { icon: <Edit2 size={16} />, label: 'Rename', action: 'rename' },
//       { icon: <Scissors size={16} />, label: 'Cut', action: 'cut' },
//       { icon: <Clipboard size={16} />, label: 'Paste', action: 'paste' },
//       { icon: <Trash size={16} />, label: 'Delete', action: 'delete' },
//     ];

//     // Ensure menu stays within bounds
//     const maxWidth = explorerRef.current?.clientWidth || 400;
//     const maxHeight = explorerRef.current?.clientHeight || 600;
//     const menuWidth = 220;
//     const menuHeight = 280;

//     let xPos = contextMenu.x;
//     let yPos = contextMenu.y;

//     if (xPos + menuWidth > maxWidth) {
//       xPos = maxWidth - menuWidth - 10;
//     }

//     if (yPos + menuHeight > maxHeight) {
//       yPos = maxHeight - menuHeight - 10;
//     }

//     return (
//       <motion.div
//         ref={menuRef}
//         className="context-menu"
//         initial={{ opacity: 0, scale: 0.9, y: 10 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.9, y: 10 }}
//         transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
//         style={{
//           position: 'absolute',
//           top: `${yPos}px`,
//           left: `${xPos}px`,
//           backgroundColor: 'rgba(20, 30, 50, 0.98)',
//           backdropFilter: 'blur(10px)',
//           borderRadius: '12px',
//           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
//           overflow: 'hidden',
//           zIndex: 1000,
//           width: menuWidth,
//           transformOrigin: 'top left'
//         }}
//       >
//         <motion.div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             padding: '12px 16px',
//             borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
//             backgroundColor: 'rgba(10, 20, 40, 0.7)'
//           }}
//           initial={{ y: -10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.05 }}
//         >
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
//             <motion.div
//               initial={{ scale: 0.8, rotate: -10 }}
//               animate={{ scale: 1, rotate: 0 }}
//               transition={{ type: "spring", stiffness: 400, damping: 20 }}
//             >
//               {getFileIcon(contextMenu.file?.file)}
//             </motion.div>
//             <motion.span
//               initial={{ x: -5, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.1 }}
//               style={{
//                 color: '#E2E8F0',
//                 fontSize: '14px',
//                 fontWeight: '500',
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 maxWidth: '140px'
//               }}
//             >
//               {contextMenu.file?.file}
//             </motion.span>
//           </div>
//           <motion.button
//             whileHover={{ rotate: 90, scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             transition={{ duration: 0.2 }}
//             style={{
//               background: 'none',
//               border: 'none',
//               borderRadius: '4px',
//               padding: '4px',
//               cursor: 'pointer',
//               color: '#94A3B8'
//             }}
//             onClick={closeContextMenu}
//           >
//             <X size={14} />
//           </motion.button>
//         </motion.div>
//         <div style={{ padding: '6px' }}>
//           {menuItems.map((item, index) => (
//             <motion.button
//               key={index}
//               custom={index}
//               variants={menuItemVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               whileHover={{
//                 backgroundColor: 'rgba(59, 130, 246, 0.2)',
//                 x: 5,
//                 transition: { duration: 0.1 }
//               }}
//               whileTap={{ scale: 0.97 }}
//               disabled={activeAction !== null}
//               style={{
//                 width: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 padding: '12px 16px',
//                 backgroundColor: activeAction === item.action ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
//                 border: 'none',
//                 borderRadius: '8px',
//                 cursor: activeAction === null ? 'pointer' : 'default',
//                 color: '#E2E8F0',
//                 textAlign: 'left',
//                 fontSize: '14px',
//                 margin: '2px 0',
//                 position: 'relative',
//                 overflow: 'hidden'
//               }}
//               onClick={() => handleContextMenuAction(item.action)}
//             >
//               <span style={{
//                 color: activeAction === item.action ? '#60A5FA' : '#6B7280',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 {item.icon}
//               </span>
//               {item.label}

//               {/* Ripple effect */}
//               {activeAction === item.action && (
//                 <motion.div
//                   initial={{ scale: 0, opacity: 0.8 }}
//                   animate={{ scale: 3, opacity: 0 }}
//                   transition={{ duration: 0.8 }}
//                   style={{
//                     position: 'absolute',
//                     width: '20px',
//                     height: '20px',
//                     borderRadius: '50%',
//                     backgroundColor: '#3B82F6',
//                     left: '50%',
//                     top: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     pointerEvents: 'none'
//                   }}
//                 />
//               )}
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>
//     );
//   };

//   // File item hover effect
//   const fileItemVariants = {
//     hover: {
//       backgroundColor: '#2D3748',
//       x: 5,
//       transition: { duration: 0.2 }
//     },
//     tap: { scale: 0.98 }
//   };

//   // File icon animation
//   const fileIconVariants = {
//     initial: { scale: 0, rotate: -20 },
//     animate: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 400 } }
//   };

//   const renderFiles = (files, parentPath = '', id = 0) => {
//     return (
//       <motion.ul
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         style={{
//           listStyle: 'none',
//           padding: 0,
//           margin: 0,
//           marginLeft: parentPath ? '20px' : 0
//         }}
//       >
//         {files.map((fileOrFolder, index) => {
//           if (fileOrFolder.file) {
//             if (!fileOrFolder.id) {
//               fileOrFolder['id'] = fileOrFolder.url;
//             }

//             return (
//               <motion.li
//                 key={fileOrFolder.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{
//                   opacity: 1,
//                   x: 0,
//                   transition: { delay: index * 0.03 }
//                 }}
//                 variants={fileItemVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//                 style={{
//                   padding: "10px 12px",
//                   cursor: "pointer",
//                   borderRadius: "8px",
//                   marginBottom: "4px",
//                   position: 'relative',
//                   backgroundColor: contextMenu.file?.id === fileOrFolder.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
//                   border: contextMenu.file?.id === fileOrFolder.id ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
//                 }}
//                 onClick={() => handleFile(fileOrFolder)}
//                 onContextMenu={(e) => handleRightClick(e, fileOrFolder)}
//               >
//                 <div style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                   color: "#E2E8F0"
//                 }}>
//                   <motion.div
//                     variants={fileIconVariants}
//                     initial="initial"
//                     animate="animate"
//                   >
//                     {getFileIcon(fileOrFolder.file)}
//                   </motion.div>
//                   <span style={{ flex: 1 }}>{fileOrFolder.file}</span>

//                   {/* Context menu indicator */}
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     whileHover={{ opacity: 1 }}
//                     style={{ opacity: 0.5, cursor: 'pointer' }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRightClick(e, fileOrFolder);
//                     }}
//                   >
//                     <MoreHorizontal size={16} color="#94A3B8" />
//                   </motion.div>
//                 </div>

//                 {/* Selection indicator */}
//                 {contextMenu.file?.id === fileOrFolder.id && (
//                   <motion.div
//                     layoutId="activeFileIndicator"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     style={{
//                       position: 'absolute',
//                       left: 0,
//                       top: '15%',
//                       transform: 'translateY(-50%)',
//                       width: '3px',
//                       height: '70%',
//                       backgroundColor: '#3B82F6',
//                       borderRadius: '0 4px 4px 0'
//                     }}
//                   />
//                 )}
//               </motion.li>
//             );
//           } else if (typeof fileOrFolder === 'object') {
//             const folderName = Object.keys(fileOrFolder)[0];
//             const folderContents = Object.values(fileOrFolder)[0];
//             const currentPath = `${parentPath}/${folderName}`;
//             const isExpanded = expandedFolders[currentPath] !== false;

//             return (
//               <motion.li
//                 key={`${parentPath}/${folderName}`}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{
//                   opacity: 1,
//                   x: 0,
//                   transition: { delay: index * 0.03 }
//                 }}
//                 style={{ marginBottom: "4px" }}
//               >
//                 <motion.button
//                   whileHover={{ backgroundColor: "#2D3748", x: 5 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => toggleFolder(currentPath)}
//                   style={{
//                     width: "100%",
//                     padding: "10px 12px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "#E2E8F0",
//                     borderRadius: "8px",
//                     fontSize: "14px"
//                   }}
//                 >
//                   <motion.div
//                     animate={{ rotate: isExpanded ? 90 : 0 }}
//                     transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
//                   >
//                     <ChevronRight size={16} />
//                   </motion.div>
//                   <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <Folder size={16} style={{ color: "#3B82F6" }} />
//                   </motion.div>
//                   <span>{folderName}</span>
//                 </motion.button>
//                 <AnimatePresence>
//                   {isExpanded && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{
//                         height: "auto",
//                         opacity: 1,
//                         transition: {
//                           height: { duration: 0.3, type: "spring", stiffness: 200, damping: 25 },
//                           opacity: { duration: 0.5 }
//                         }
//                       }}
//                       exit={{
//                         height: 0,
//                         opacity: 0,
//                         transition: {
//                           height: { duration: 0.2 },
//                           opacity: { duration: 0.1 }
//                         }
//                       }}
//                       style={{ overflow: "hidden" }}
//                     >
//                       {renderFiles(folderContents, currentPath, id)}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.li>
//             );
//           }
//           return null;
//         })}
//       </motion.ul>
//     );
//   };

//   if (!fileData) {
//     return (
//       <div style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "200px",
//         color: "#E2E8F0"
//       }}>
//         <motion.div
//           animate={{
//             rotate: 360
//           }}
//           transition={{
//             duration: 1,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//           style={{
//             width: "24px",
//             height: "24px",
//             border: "3px solid #3B82F6",
//             borderTopColor: "transparent",
//             borderRadius: "50%"
//           }}
//         />
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       ref={explorerRef}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       style={{
//         backgroundColor: "#1E293B",
//         borderRadius: "16px",
//         overflow: "hidden",
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         position: "relative",
//         boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//       }}
//     >
//       <div style={{
//         padding: "20px",
//         backgroundColor: "#0F172A",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//         borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
//       }}>
//         <motion.div
//           whileHover={{ scale: 1.05, rotate: 5 }}
//           whileTap={{ scale: 0.95 }}
//           style={{
//             width: "40px",
//             height: "40px",
//             backgroundColor: "#3B82F6",
//             borderRadius: "50%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "white",
//             fontWeight: "bold",
//             boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
//           }}
//         >
//           {(user.profilePic && <Profile />) || user.username.slice(0, 1).toUpperCase()}
//         </motion.div>
//         <motion.h1
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//           style={{
//             margin: 0,
//             fontSize: "1.25rem",
//             color: "#E2E8F0",
//             fontWeight: "bold"
//           }}
//         >
//           {user.username.length > 9 ? user.username.substring(0, 9) + "..." : user.username}'s Files
//         </motion.h1>
//       </div>

//       <div style={{
//         padding: "20px",
//         overflow: "auto",
//         flex: 1
//       }}>
//         {fileData.length === 0 ? (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             style={{
//               textAlign: "center",
//               color: "#94A3B8",
//               fontSize: "0.875rem",
//               padding: "40px 20px"
//             }}
//           >
//             No files or folders found for this user.
//           </motion.p>
//         ) : (
//           renderFiles(fileData)
//         )}
//       </div>

//       <AnimatePresence>
//         {contextMenu.visible && renderContextMenu()}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default FileExplorer;