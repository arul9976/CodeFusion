// "use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, GitBranch, Terminal, Settings, MessageCircleCode } from "lucide-react";
import { BiSolidMessageSquareDetail } from 'react-icons/bi';
import FileExplorer from '../FileExpo/FileExplorer';
import Chat from '../ChatComponents/Chat';

const SidebarWithExplorer = ({
  isExplorerOpen,
  toggleExplorer,
  toggleTerminal,
  theme,
  files,
  handleFile,
  setIsChatOpen
}) => {


  const styles = {
    mainContent: {
      display: 'flex',
      height: '100%',
      backgroundColor: '#1E293B',
    },
    sideBar: {
      width: '48px',
      backgroundColor: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8px 0',
      gap: '4px'
    },
    sideBarIcon: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#2D3748'
      }
    },
    activeSideBarIcon: {
      backgroundColor: '#2D3748',
      '&:hover': {
        backgroundColor: '#374151'
      }
    },
    explorer: {
      backgroundColor: '#1E293B',
      overflow: 'hidden',
      transition: 'width 0.3s ease',
      borderRight: '1px solid #374151'
    },
    chat: {
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 1000
    }
  };

  const iconProps = {
    initial: { scale: 0.9 },
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 }
  };

  const handleOpenChat = () => {
    setIsChatOpen((prev) => !prev);
  }

  return (
    <div style={styles.mainContent}>
      <motion.div
        style={styles.sideBar}
        initial={{ x: -48 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          {...iconProps}
          style={{
            ...styles.sideBarIcon,
            backgroundColor: isExplorerOpen ? '#2D3748' : 'transparent'
          }}
          onClick={toggleExplorer}
        >
          <FileText size={24} color={theme.text} />
        </motion.div>

        <motion.div {...iconProps} style={styles.sideBarIcon}>
          <Search size={24} color={theme.text} />
        </motion.div>

        <motion.div {...iconProps} style={styles.sideBarIcon}>
          <GitBranch size={24} color={theme.text} />
        </motion.div>

        <motion.div {...iconProps} style={styles.sideBarIcon} onClick={toggleTerminal}>
          <Terminal size={24} color={theme.text} />
        </motion.div>

        <motion.div {...iconProps} style={styles.sideBarIcon} onClick={handleOpenChat}>
          <BiSolidMessageSquareDetail size={24} color={theme.text} />
        </motion.div>

        <div style={{ marginTop: 'auto' }}>
          <motion.div {...iconProps} style={styles.sideBarIcon}>
            <Settings size={24} color={theme.text} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isExplorerOpen ? 280 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          ...styles.explorer,
          overflow: 'hidden'
        }}
      >
        <div style={{ width: 280 }}>
          <FileExplorer
            isExplorerOpen={isExplorerOpen}
            files={files}
            handleFile={handleFile}
          />
        </div>
      </motion.div>

      {/* <motion.div
        initial={{ width: 0 }}
        animate={{ width: isChatOpen ? '430px' : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          ...styles.chat,
          overflow: 'hidden'
        }}
      >
        <Chat />
      </motion.div> */}

    </div>
  );
};

export default SidebarWithExplorer;