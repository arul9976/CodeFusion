import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import {
  Menu,
  Save,
  Play,
  Share2,
  Moon,
  Sun,
  RefreshCw,
  Edit3,
  Eye,
  FolderOpen,
  Terminal,
  HelpCircle,
  Settings,
  Download,
  // GitHub,
  Users,
  Plus,
  UserPlus,
  Copy
} from 'lucide-react';
import Collaborators from '../Collab/Collabrators';
import { UserContext } from '../LogInPage/UserProvider';
import { MdSpaceDashboard } from 'react-icons/md';
import Profile from '../WorkSpace/Profile';
import { useParams } from 'react-router-dom';
import FileMenu from './File/FIleMenu';
import NewFile from './NewFile';

const MenuBar = ({
  handleFileOpen, getOutput, setShowTerminal,
  handleFileMenuOpen, isFileMenuOpen, isFileOpen,
  handleFolderOpen

}) => {

  const { user } = useContext(UserContext);
  const { workspace } = useParams();


  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isSaving, setIsSaving] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredText, setHoveredText] = useState(null);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const simulateSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isCollabModifyOpen, setIsCollabModifyOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleCollab = () => {
    setIsCollabOpen(!isCollabOpen);
  };

  const simulateCopyLink = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const styles = {
    menuBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      background: 'linear-gradient(180deg, rgba(26,29,36,0.95) 0%, rgba(26,29,36,0.98) 100%)',
      color: '#9ca3af',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      height: '48px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backdropFilter: 'blur(10px)',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '6px 12px',
      marginRight: '4px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '14px',
      position: 'relative',
      overflow: 'hidden',
    },
    textContainer: {
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
      padding: '2px 4px',
    },
    textHover: {
      position: 'relative',
      display: 'inline-block',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease',
      '&:hover': {
        color: '#fff',
        textShadow: '0 0 15px rgba(255,255,255,0.3)',
      },
    },
    textGlow: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      transform: 'scale(1.5)',
    },
    underline: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, #4f46e5, transparent)',
      transform: 'scaleX(0)',
      transformOrigin: 'center',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
      border: 'none',
      color: '#fff',
      fontSize: '14px',
      gap: '8px',
      position: 'relative',
      overflow: 'hidden',
    },
    hoverText: {
      position: 'relative',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        color: '#fff',
      },
    },
    glowDot: {
      position: 'absolute',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#4f46e5',
      top: '50%',
      left: '-10px',
      transform: 'translateY(-50%)',
      opacity: '0',
      transition: 'all 0.3s ease',
    },
    '@keyframes shimmer': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-2px)' },
    },
    menuBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      background: 'linear-gradient(180deg, rgba(26,29,36,0.95) 0%, rgba(26,29,36,0.98) 100%)',
      color: '#9ca3af',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      height: '48px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '6px 12px',
      marginRight: '4px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '14px',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '34px',
      height: '34px',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: 'none',
      color: '#9ca3af',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    },
    rightSection: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    divider: {
      width: '1px',
      height: '24px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      margin: '0 8px',
    },
    savingIcon: {
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    tooltip: {
      position: 'absolute',
      bottom: '-32px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      opacity: 0,
      transition: 'all 0.2s ease',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 1000,
    },
    buttonWrapper: {
      position: 'relative',
      '&:hover > div': {
        opacity: 1,
        transform: 'translateX(-50%) translateY(-8px)',
      },
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      marginRight: '8px',
    },

    collabButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '6px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#4f46e5',
      border: 'none',
      color: '#fff',
      fontSize: '14px',
      gap: '8px',
      '&:hover': {
        backgroundColor: '#4338ca',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    },
    collabPopup: {
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '8px',
      backgroundColor: '#1f2937',
      borderRadius: '12px',
      padding: '16px',
      width: '300px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      animation: 'slideIn 0.3s ease-out',
      border: '1px solid rgba(255,255,255,0.1)',
      zIndex: 1000,
    },
    collabHeader: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '12px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    inviteLink: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#9ca3af',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    copyButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#4f46e5',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
      },
    },
    collaborator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      borderRadius: '6px',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.05)',
      },
    },
    avatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: '#4f46e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    '@keyframes slideIn': {
      from: {
        opacity: 0,
        transform: 'translateY(-10px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    '@keyframes success': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.2)' },
      '100%': { transform: 'scale(1)' },
    },
  };

  const menuItems = [
    { icon: <Menu size={16} />, label: 'File' },
    // { icon: <Edit3 size={16} />, label: 'Edit' },
    // { icon: <Eye size={16} />, label: 'View' },
    // { icon: <FolderOpen size={16} />, label: 'Project' },
    { icon: <Terminal size={16} />, label: 'Terminal' },
    { icon: <HelpCircle size={16} />, label: 'Help' },
  ];

  const actionButtons = [
    { icon: isSaving ? <RefreshCw size={16} style={styles.savingIcon} /> : <Save size={16} />, tooltip: 'Save', onClick: simulateSave },
    { icon: <Play size={16} />, tooltip: 'Run' },
    { icon: <MdSpaceDashboard onClick={() => window.open('/CodeFusion/Dashboard', '_blank')} />, tooltip: 'Dashboard' },
    // { icon: <Download size={16} />, tooltip: 'Download' },
    // { icon: <GitHub size={16} />, tooltip: 'Repository' },
    // { icon: <Share2 size={16} />, tooltip: 'Share' Dashboard},
    { icon: <Settings size={16} />, tooltip: 'Settings' },
    { icon: currentTheme === 'dark' ? <Moon size={16} /> : <Sun size={16} />, tooltip: 'Toggle theme', onClick: toggleTheme },
  ];

  const handleModifyCollab = () => {
    setIsCollabModifyOpen(true);
    setIsCollabOpen(false);
  }

  const TextWithHoverEffect = ({ text, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={styles.textContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span style={{
          ...styles.hoverText,
          transform: isHovered ? 'translateY(-2px)' : 'none',
        }}>
          {text}
        </span>
        <div style={{
          ...styles.glowDot,
          opacity: isHovered ? 1 : 0,
          left: isHovered ? '0' : '-10px',
        }} />
        <div style={{
          ...styles.underline,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        }} />
        <div style={{
          ...styles.textGlow,
          opacity: isHovered ? 1 : 0,
        }} />
      </div>
    );
  };


  const CollabPopup = () => (
    <div style={styles.collabPopup}>
      <div style={styles.collabHeader}>
        <Users size={20} />
        Collaboration
      </div>
      <div style={{ ...styles.collaborator, marginBottom: '8px' }}>
        <div style={styles.avatar}>{(user.profilePic && <Profile />) || user?.user?.username?.chatAt(0)}</div>
        <div>
          <div style={{ color: '#fff' }}>{user.username}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Owner</div>
        </div>
      </div>
      <button onClick={handleModifyCollab} style={{
        ...styles.collabButton,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        color: '#4f46e5',
      }}>
        <UserPlus size={16} />
        Invite Members
      </button>
    </div>
  );


  return (
    <>
      <div style={styles.menuBar}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.menuItem,
              backgroundColor: activeItem === index ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onMouseEnter={() => setActiveItem(index)}
            onMouseLeave={() => setActiveItem(null)}
            onClick={index === 0 ? handleFileMenuOpen : index === 1 ? () => setShowTerminal((prev) => !prev) : null}
          >
            <div style={{ marginRight: '8px', opacity: activeItem === index ? 1 : 0.7 }}>
              {item.icon}
            </div>
            <TextWithHoverEffect text={item.label} index={index} />
          </div>
        ))}

        <div style={styles.rightSection}>
          <div style={{ position: 'relative' }}>
            <button
              style={styles.collabButton}
              onClick={toggleCollab}
            >
              <Users size={16} />
              Collaborate
            </button>
            {isCollabOpen && <CollabPopup />}
          </div>
          <div style={styles.divider} />
          {actionButtons.map((button, index) => (
            <React.Fragment key={index}>
              {index === 3 && <div style={styles.divider} />}
              <div style={styles.buttonWrapper} onClick={button.tooltip === 'Run' ? getOutput : null}>
                <button style={styles.actionButton} onClick={button.onClick}>
                  {button.icon}
                </button>
                <div style={styles.tooltip}>{button.tooltip}</div>
              </div>
            </React.Fragment>
          ))}
        </div>




        {/* <div style={styles.rightSection}>
       
      </div>

      <div style={{ position: 'relative' }}>
        <button
          style={styles.collabButton}
          onClick={toggleCollab}
        >
          <Users size={16} />
          Collaborate
        </button>
        {isCollabOpen && <CollabPopup />}
      </div> */}
      </div>


      {isFileMenuOpen && (
        <FileMenu
          handleFileMenuOpen={handleFileMenuOpen} handleFolderOpen={handleFolderOpen}
          isFileOpen={isFileOpen} handleFileOpen={handleFileOpen}
        />
      )}

      {/* {isFileOpen &&
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
          <NewFile />
        </motion.div>

      } */}
      {/* {

        isFileMenuOpen && (
          <FileMenu />
        )
      } */}
      {isCollabModifyOpen &&
        <Collaborators setIsCollabOpen={setIsCollabModifyOpen} workSpaceName={workspace} />}
    </>
  );
};

export default MenuBar;