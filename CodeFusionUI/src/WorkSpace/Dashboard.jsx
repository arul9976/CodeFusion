import React, { useContext, useEffect, useRef, useState } from 'react';
import { Search, MoreVertical, Plus, Home, Folder, Share2, MessageSquare, Bell, Settings, LogOut } from 'lucide-react';
import Notification from './Notification';
import ProfileInfo from '../Profile/ProfilePage';
import CreateWorkspace from './CwTemplate';
import { getWorkSpaces } from '../utils/Fetch';
import { UserContext } from '../LogInPage/UserProvider';
import { setWorkspaces } from '../Redux/editorSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './wsRow.css';

const DashboardPage = () => {
  const { user, dispatchUser } = useContext(UserContext);
  const workspaces = useSelector(state => state.editor.workspaces);

  const [activeTab, setActiveTab] = useState(0);
  const [ownerColumn, setOwnerColumn] = useState('block');
  const [showPage, setShowPage] = useState("Recent Workspace");
  const [notifications, setNotifications] = useState(3);
  const [notificationPanel, setNotificationPanel] = useState(false);
  const [isProfileOn, setIsProfileOn] = useState(false);
  const [isCreateWorkspace, SetIsCreateWorkspace] = useState(false);
  const [showMenu, setShowMenu] = useState(null);

  const handleNotify = () => {
    setNotificationPanel(!notificationPanel);
    // console.log("Hiii " + notificationPanel);

  }

  const handleProfileOpen = () => {
    console.log('runned profile');

    setIsProfileOn(!isProfileOn);
  }


  // const styles = {
  //   mainContainer: {
  //     display: 'flex',
  //     height: '100vh',
  //     backgroundColor: '#0f172a',
  //     color: '#fff',
  //     overflow: 'hidden'
  //   },
  //   sidebar: {
  //     width: '280px',
  //     backgroundColor: '#1e293b',
  //     display: 'flex',
  //     flexDirection: 'column',
  //     transition: 'width 0.3s ease',
  //     boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
  //   },
  //   logo: {
  //     padding: '20px',
  //     backgroundColor: '#2a3749',
  //     display: 'flex',
  //     alignItems: 'center',
  //     gap: '10px'
  //   },
  //   logoText: {
  //     fontSize: '24px',
  //     background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
  //     WebkitBackgroundClip: 'text',
  //     WebkitTextFillColor: 'transparent',
  //     fontWeight: 'bold'
  //   },
  //   navButton: {
  //     display: 'flex',
  //     alignItems: 'center',
  //     padding: '12px 20px',
  //     margin: '5px 10px',
  //     border: 'none',
  //     borderRadius: '10px',
  //     cursor: 'pointer',
  //     color: '#fff',
  //     gap: '12px',
  //     transition: 'all 0.3s ease',
  //     backgroundColor: 'transparent',
  //     fontSize: '16px'
  //   },
  //   activeNavButton: {
  //     backgroundColor: '#3b82f6',
  //     transform: 'translateX(5px)',
  //     boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  //   },
  //   content: {
  //     flex: 1,
  //     padding: '20px 30px',
  //     overflowY: 'auto'
  //   },
  //   header: {
  //     display: 'flex',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     marginBottom: '30px'
  //   },
  //   searchContainer: {
  //     position: 'relative',
  //     flex: 1,
  //     maxWidth: '500px'
  //   },
  //   searchInput: {
  //     width: '100%',
  //     padding: '12px 40px',
  //     backgroundColor: '#1e293b',
  //     border: '2px solid #374151',
  //     borderRadius: '12px',
  //     color: '#fff',
  //     fontSize: '16px',
  //     transition: 'all 0.3s ease'
  //   },
  //   createButton: {
  //     display: 'flex',
  //     alignItems: 'center',
  //     gap: '8px',
  //     padding: '12px 24px',
  //     backgroundColor: '#3b82f6',
  //     border: 'none',
  //     borderRadius: '12px',
  //     color: '#fff',
  //     cursor: 'pointer',
  //     transition: 'all 0.3s ease',
  //     fontSize: '16px',
  //     boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  //   },
  //   tableContainer: {
  //     backgroundColor: '#1e293b',
  //     borderRadius: '16px',
  //     // overflow: 'hidden',
  //     boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  //     animation: 'slideUp 0.5s ease'
  //   },
  //   tableHeader: {
  //     display: 'grid',
  //     gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
  //     padding: '20px',
  //     backgroundColor: '#2a3749',
  //     gap: '20px'
  //   },
  //   profileIcon: {
  //     width: '36px',
  //     height: '36px',
  //     borderRadius: '50%',
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     fontSize: '16px',
  //     color: '#fff',
  //     fontWeight: 'bold'
  //   },
  //   '@keyframes slideUp': {
  //     from: { transform: 'translateY(20px)', opacity: 0 },
  //     to: { transform: 'translateY(0)', opacity: 1 }
  //   },
  //   headerActions: {
  //     display: 'flex',
  //     alignItems: 'center',
  //     gap: '20px'
  //   },
  //   notificationBadge: {
  //     position: 'relative',
  //     cursor: 'pointer',
  //     top: '7px',
  //     right: '-5px',
  //     animation: 'pulse 2s infinite',
  //     zIndex: 2

  //   },
  //   badge: {
  //     position: 'absolute',
  //     top: '-5px',
  //     right: '-5px',
  //     backgroundColor: '#ef4444',
  //     color: '#fff',
  //     borderRadius: '50%',
  //     padding: '2px 6px',
  //     fontSize: '12px'
  //   },
  //   '@keyframes pulse': {
  //     '0%': { transform: 'scale(1)' },
  //     '50%': { transform: 'scale(1.2)' },
  //     '100%': { transform: 'scale(1)' },
  //   },
  // };

  const getRandomColor = () => {
    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getInitials = (name) => {
    console.log(name);
    name.split(' ').map(n => n[0]).join('')
  };

  // const workspaces = {
  //   "wid": ["Design System", "React", "2024-02-22", "John Doe"],
  //   "wid1": ["Backend API", "Python", "2024-02-21", "Jane Smith"],
  //   "wid2": ["Mobile App", "React Native", "2024-02-20", "Mike Johnson"],
  //   "wid3": ["Analytics Dashboard", "Vue.js", "2024-02-19", "Sarah Wilson"]
  // };



  useEffect(() => {
    console.log(user);

    getWorkSpaces(user.email).then((data) => {
      console.log(data);

      if (data.length > 0) {
        dispatchUser(setWorkspaces(data || []))
        console.log("Workspaces updated");

        console.log(workspaces);

      }
      else {
        console.log("No workspaces found");
      }
    });
  }, [])

  return (
    <div className={'mainContainer'}>

      <ProfileInfo user={user} isOpen={isProfileOn} onClose={handleProfileOpen} />

      <div className={'sidebar'}>
        <div className={'logo'}>
          <div className={'logoText'}>Code Fusion</div>
        </div>

        {[
          { text: 'Recent Workspaces', icon: Home },
          { text: 'My Workspaces', icon: Folder },
          { text: 'Shared with me', icon: Share2 },
          { text: 'Chat', icon: MessageSquare }
        ].map((item, index) => (
          <button
            key={index}
            className={`navButton ${activeTab === index && 'activeNavButton'}`}
            onClick={() => setActiveTab(index)}
          >
            <item.icon size={20} />
            {item.text}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button className={'navButton'}>
          <Settings size={20} /> Settings
        </button>
        <button className={`navButton`} onClick={'loggedOut'} style={{ marginBottom: '20px' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>


      <div className={'content'}>
        <Notification notificationPanel={notificationPanel} setNotificationPanel={setNotificationPanel} notifies={notifications} />

        <div className={'header'}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{showPage}</h1>

          <div className={'headerActions'}>
            <div className={'notificationBadge'} onClick={handleNotify}>
              <Bell size={20} />


              {notifications > 0 && (
                <span className={'badge'}>{notifications}</span>
              )}
            </div>


            <div onClick={handleProfileOpen} className={'profileIcon'} style={{
              backgroundColor: '#3b82f6',
              zIndex: 1001,
              cursor: 'pointer'
            }}>
              AD
            </div>

          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className={'searchContainer'}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }}
            />
            <input
              className={'searchInput'}
              placeholder="Search workspaces..."
            />
          </div>
          <button
            className={'createButton'}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            onClick={() => SetIsCreateWorkspace(true)}
          >
            <Plus size={20} />
            Create Workspace
          </button>
        </div>
        {
          isCreateWorkspace &&
          <CreateWorkspace SetIsCreateWorkspace={SetIsCreateWorkspace} />

        }

        <div className={'tableContainer'}>
          <div className={'tableHeader'}>
            <div>Workspace Name</div>
            <div>Technology</div>
            <div>Last Accessed</div>
            <div>Owner</div>
            <div></div>
          </div>

          {
            workspaces.length > 0 ?
              workspaces.map((data, idx) => (
                // <div key={idx} onClick={(e) => handleWorkspaceClick(e, idx)}>
                <WorkspaceRow
                  key={idx}
                  data={data}
                  getRandomColor={getRandomColor}
                  getInitials={getInitials}
                  idx={idx}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              )) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={'https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg'} alt="" />
              </div>
          }
        </div>
      </div>
    </div>
  );
};

const WorkspaceRow = ({ data, getRandomColor, getInitials, idx, showMenu, setShowMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();


  const GoToIDE = () => {
    navigate('/IDE');
  }


  useEffect(() => {
    console.log("Data " + data);

  }, [])
  return (
    <div
      className={`row ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="nameAndNaviagator" onClick={GoToIDE}>
        {data.workspaceName}
      </div>
      <div>{data.techStack}</div>
      <div>{data.lastAccess}</div>
      <div className="profile-container">
        <div
          className="profileIcon"
          style={{ backgroundColor: getRandomColor() }}
        >
          {getInitials(data.ownerName)}
        </div>
        <span style={{ margin: 'auto 0' }}>{data.ownerName}</span>
      </div>
      <div className="menu-container">
        <MoreVertical
          size={20}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowMenu((prev) => prev === idx ? null : idx)}
        />
        {showMenu === idx && (
          <div className="menu">
            <div className="menuItem">View Details</div>
            <div className="menuItem">Share Access</div>
            <div className="menuItem">Rename</div>
            <div className="menuItem delete">Delete</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;