import React, { useContext, useState } from 'react';
import {
  FaHtml5, FaJava, FaRust, FaPython, FaReact,
  FaCode, FaPlus, FaServer, FaCog, FaTimes
} from 'react-icons/fa';
import {
  SiRuby, SiGo, SiCplusplus, SiC,
  SiApachetomcat
} from 'react-icons/si';

import './Cw.css';
import { X } from 'lucide-react';
import { UserContext } from '../LogInPage/UserProvider';
import { createWorkspace } from '../utils/Fetch';
import { pushWorkspace } from '../Redux/editorSlice';
import { mysqlNow } from '../utils/Utilies';
const CreateWorkspace = ({ SetIsCreateWorkspace }) => {

  const { user, dispatchUser } = useContext(UserContext);

  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const techStacks = {
    languages: [
      { name: 'HTML/CSS/JS', icon: <FaHtml5 /> },
      { name: 'Java', icon: <FaJava /> },
      { name: 'Ruby', icon: <SiRuby /> },
      { name: 'Python', icon: <FaPython /> },
      { name: 'Rust', icon: <FaRust /> },
      { name: 'C', icon: <SiC /> },
      { name: 'CPP', icon: <SiCplusplus /> },
      { name: 'Go', icon: <SiGo /> }
    ],
    frameworks: [
      { name: 'React', icon: <FaReact /> },
      { name: 'Tomcat Servlet', icon: <SiApachetomcat /> }
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsCreating(true);

    const workspace = {
      "name": workspaceName,
      "techStack": selectedTech,
      "ownerEmail": user.email,
    }

    // await new Promise(resolve => setTimeout(resolve, 1500));

    createWorkspace(workspace)
      .then((res) => {
        console.log('Workspace created:', res);
        setWorkspaceName('');
        setSelectedTech('');
        workspace['dTime'] = mysqlNow();
        dispatchUser(pushWorkspace(workspace));

        setIsCreating(false);

      }).catch((err) => {
        console.error('Error creating workspace:', err);
      }).finally(() => {
        setTimeout(() => {
          setIsLoading(false);
          if (!isCreating)
            SetIsCreateWorkspace(false);
        }, 1000);
      })

    console.log('Creating workspace:', workspace);
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // setIsCreating(false);
    // setWorkspaceName('');
    // setSelectedTech('');
  };



  return (
    <>
      <div className='cwPanel'>

        <div className="create-workspace fade-in">
          <div className="header">
            <h2><FaPlus /> Create New Workspace</h2>
            <X className='close' size={40} onClick={() => SetIsCreateWorkspace(false)} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaCode className="input-icon" />
              <input
                type="text"
                className="input-field"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name"
                required
              />
            </div>

            <div className="input-group">
              <h3 className="section-title">
                <FaCode /> Programming Languages
              </h3>
              <div className="tech-grid">
                {techStacks.languages.map(({ name, icon }) => (
                  <div
                    key={name}
                    className={`tech-option ${selectedTech === name ? 'selected' : ''}`}
                    onClick={() => setSelectedTech(name)}
                  >
                    {icon}
                    <span className="tech-option-name">{name}</span>
                    <div className="shimmer"></div>
                  </div>
                ))}
              </div>

              <h3 className="section-title">
                <FaServer /> Frameworks
              </h3>
              <div className="tech-grid">
                {techStacks.frameworks.map(({ name, icon }) => (
                  <div
                    key={name}
                    className={`tech-option ${selectedTech === name ? 'selected' : ''}`}
                    onClick={() => setSelectedTech(name)}
                  >
                    {icon}
                    <span className="tech-option-name">{name}</span>
                    <div className="shimmer"></div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="create-button"
              disabled={isLoading || !workspaceName || !selectedTech}
            >
              {isLoading ? (
                <>
                  <FaCog className="loading-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus />
                  Create Workspace
                </>
              )}
              <div className="shimmer"></div>
            </button>
          </form>

        </div>

        {/* Modal Overlay with Blur Effect */}
        <div className={`modal-overlay ${isCreating ? 'active' : ''}`}>
          {isLoading ? (
            <div className={`success-message ${isCreating ? 'active' : ''}`}>
              <div className="success-icon">
                <FaCog className="loading-spinner" />
              </div>
              <h3>Creating Your Workspace</h3>
              <p>Please wait while we set up everything...</p>
              <div className={`workspace-progress ${isCreating ? 'active' : ''}`}></div>
            </div>
          ) : (
            <div className={`success-message ${isCreating ? 'active' : ''}`}>
              <button className="close-button" onClick={() => setIsCreating(false)}>
                <FaTimes />
              </button>
              <div className="success-icon">
                <FaPlus className="checkmark" />
              </div>
              <h3>Workspace Created!</h3>
              <p>Your new workspace has been created successfully.</p>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default CreateWorkspace;