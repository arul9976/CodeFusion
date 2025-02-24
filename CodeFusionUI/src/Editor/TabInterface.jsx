// "use client"

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getFileIcon } from '../utils/GetIcon';
import MonacoIDE from './MonacoIDE';
import NewFile from './NewFile';

const TabInterface = ({
  files,
  activeFile,
  handleFile,
  closeFile,
  showNewFile,
  handleFileOpen
}) => {
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
          {files.map(file => (
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
                backgroundColor: activeFile?.id === file.id ? '#2D3748' : 'transparent',
                borderRight: '1px solid #334155',
                minWidth: 0,
                flexShrink: 0,
                position: 'relative'
              }}
              whileHover={{
                backgroundColor: activeFile?.id === file.id ? '#2D3748' : '#1F2937'
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

              <motion.button
                whileHover={{ backgroundColor: '#4B5563' }}
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
                  backgroundColor: 'transparent',
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
              <MonacoIDE activeFile={activeFile} />
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
              <NewFile fileOnClick={handleFileOpen} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TabInterface;