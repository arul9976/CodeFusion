import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FolderPlus, Save, LogOut, Settings, Download, Upload, Copy, Trash } from 'lucide-react';

const FileMenu = ({
  handleFileOpen, isFileOpen, handleFileMenuOpen,
  handleFolderOpen
}) => {


  const menuItems = [
    { icon: <FileText size={16} />, label: "New File", shortcut: "Ctrl+N" },
    { icon: <FolderPlus size={16} />, label: "New Folder", shortcut: "Ctrl+Shift+N" },
    { icon: <Save size={16} />, label: "Save", shortcut: "Ctrl+S" },
    // { icon: <Save size={16} />, label: "Save As...", shortcut: "Ctrl+Shift+S" },
    { type: "divider" },
    // { icon: <Upload size={16} />, label: "Open...", shortcut: "Ctrl+O" },
    { icon: <Download size={16} />, label: "Export", shortcut: "" },
    { type: "divider" },
    // { icon: <Copy size={16} />, label: "Duplicate", shortcut: "Ctrl+D" },
    { icon: <Trash size={16} />, label: "Delete", shortcut: "Del" },
    { type: "divider" },
    // { icon: <Settings size={16} />, label: "Preferences", shortcut: "Ctrl+," },
    { icon: <LogOut size={16} />, label: "Quit", shortcut: "Ctrl+Q" }
  ];


  const whenOnclickAnyMenu = (idx) => {
    switch (idx) {
      case 0:
        handleFileOpen(); break;
      case 1:
        handleFolderOpen(); break;
      default:
        break;
    }
    handleFileMenuOpen();
  }


  return (

    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute left-2 top-0 w-64 bg-gray-800 rounded shadow-lg z-50 overflow-hidden"
      >
        <motion.div
          className="py-1"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.03
              }
            }
          }}
        >
          {menuItems.map((item, index) => (
            item.type === "divider" ? (
              <motion.div
                key={`divider-${index}`}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
                className="h-px bg-gray-700 my-1"
              />
            ) : (
              <motion.button
                key={item.label}
                onClick={
                  () => whenOnclickAnyMenu(index) 
                }
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                className="flex items-center justify-between w-full px-4 py-2 text-left text-sm"
              >
                <div className="flex items-center">
                  <span className="mr-2 text-blue-400">{item.icon}</span>
                  {item.label}
                </div>
                <span className="text-gray-500 text-xs">{item.shortcut}</span>
              </motion.button>
            )
          ))}
        </motion.div>
      </motion.div>
    </div>



  );
};

export default FileMenu;