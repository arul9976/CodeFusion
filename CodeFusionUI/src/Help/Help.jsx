import React, { useState, useEffect } from "react";
import "./HelpPage.css";
import { MdMenu, MdSave, MdCreate, MdFolderOpen, MdSettings } from 'react-icons/md';
import { FaCommentAlt, FaKeyboard, FaTimes } from 'react-icons/fa';
import { VscTerminal } from 'react-icons/vsc';
import { FaFileAlt } from 'react-icons/fa';


const Help = () => {
  const [activeTab, setActiveTab] = useState('shortcuts');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    console.log("hiehdiheidheidh");
    
    setAnimate(true);
  }, []);

  return (
    <div className="help-container">
      <div className="help-header">
        <h2>Help Center</h2>
        <button className="close-button"><FaTimes /></button>
      </div>

      <div className="help-tabs">
        <button
          className={activeTab === 'shortcuts' ? 'active' : ''}
          onClick={() => setActiveTab('shortcuts')}
        >
          <FaKeyboard /> Shortcuts
        </button>
        <button
          className={activeTab === 'interface' ? 'active' : ''}
          onClick={() => setActiveTab('interface')}
        >
          <MdSettings /> Interface
        </button>
      </div>

      <div className="help-content">
        {activeTab === 'shortcuts' && (
          <div className="shortcuts-section">
            <div className="shortcut-item">
              <div className="shortcut-key"><kbd>Ctrl</kbd> + <kbd>S</kbd></div>
              <div className="shortcut-desc">Save current file</div>
            </div>
          </div>
        )}

        {activeTab === 'interface' && (
          <div className="interface-section">
            <div className="interface-item">
              <div className="interface-icon"><MdMenu /></div>
              <div className="interface-desc">
                <h4>Menu</h4>
                <p>Click to show options for creating new files and folders</p>
              </div>
            </div>
            <div className="interface-item">
              <div className="interface-icon"><FaCommentAlt /></div>
              <div className="interface-desc">
                <h4>Chat</h4>
                <p>Chat with collaborators and AI assistant</p>
              </div>
            </div>
            <div className="interface-item">
              <div className="interface-icon"><VscTerminal /></div>
              <div className="interface-desc">
                <h4>Terminal</h4>
                <p>Execute and manage code in the terminal.</p>
              </div>

            </div>
            <div className="interface-item">
              <div className="interface-icon"><FaFileAlt /></div>
              <div className="interface-desc">
                <h4>File Explorer</h4>
                <p>organize your project files</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div className="help-footer">
        <p>Need more help? <a href="#">Visit Documentation</a></p>
      </div> */}
    </div>
  );
};

export default Help;