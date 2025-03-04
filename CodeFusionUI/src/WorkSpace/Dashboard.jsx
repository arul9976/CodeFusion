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
import { getInitials } from '../utils/Utilies';
import RenameWorkspace from './RenameWorkspace';
import DeleteWorkspace from './DeleteWorkspace';
import Profile from './Profile';
import { ClientContext } from '../Editor/ClientContext';
import EmptyState from './EmptyState';
import { usePopup } from '../PopupIndication/PopUpContext';

const DashboardPage = () => {
  const { user, dispatchUser } = useContext(UserContext);
  const workspaces = useSelector(state => state.editor.workspaces);

  const { showPopup } = usePopup();

  const [activeTab, setActiveTab] = useState(0);
  const [ownerColumn, setOwnerColumn] = useState('block');
  const [showPage, setShowPage] = useState("Recent Workspace");
  const [notificationPanel, setNotificationPanel] = useState(false);
  const [isProfileOn, setIsProfileOn] = useState(false);
  const [isCreateWorkspace, SetIsCreateWorkspace] = useState(false);
  const [showMenu, setShowMenu] = useState(-1);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState(false);
  const { notifications } = useContext(UserContext);


  const handleNotify = () => {
    setNotificationPanel(!notificationPanel);
    // console.log("Hiii " + notificationPanel);

  }

  const handleProfileOpen = () => {
    console.log('runned profile');

    setIsProfileOn(!isProfileOn);
  }


  const getRandomColor = () => {
    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };



  // useEffect(() => {

  //   switch (activeTab) {
  //     case 1:
  //   }
  // }, [activeTab])

  useEffect(() => {
    console.log(user);

    if (user.isLoggedIn) {
      switch (activeTab) {
        case 0:
          getWorkSpaces(user.email, "1").then((data) => {
            if (data && data.length > 0) {
              dispatchUser(setWorkspaces(data))
              console.log("Workspaces updated 1");

              console.log(workspaces);
              getWorkSpaces(user.email, "0").then((data) => {
                if (data.length > 0) {
                  dispatchUser(setWorkspaces([...workspaces, ...data]))
                  console.log("Workspaces updated 2");
                  console.log(workspaces);
                }

              });
            }
            else {
              dispatchUser(setWorkspaces([]));
              console.log("No workspaces found");
              getWorkSpaces(user.email, "0").then((data) => {
                if (data && data?.length > 0) {
                  dispatchUser(setWorkspaces([...workspaces, ...data]))
                  console.log("Workspaces updated 2");
                  console.log(workspaces);
                }

              }).catch(() => showPopup("No Workspaces Available", 'warning', 3000))
            }
          }).catch(() => showPopup("No Workspaces Available", 'warning', 3000))

          break;
        case 1:
          getWorkSpaces(user.email, "1").then((data) => {
            console.log(data, user.username);

            if (data.length > 0) {
              dispatchUser(setWorkspaces(data.filter(ws => ws.ownerName === user.username)))
              console.log("Workspaces updated");

              console.log(workspaces);

            }
            else {
              dispatchUser(setWorkspaces([]));
              console.log("No workspaces found");
            }
          });
          break;
        case 2:
          getWorkSpaces(user.email, "0").then((data) => {
            console.log(data);

            if (data.length > 0) {
              dispatchUser(setWorkspaces(data.filter(ws => ws.ownerName !== user.username)))
              console.log("Workspaces updated");

              console.log(workspaces);

            }
            else {
              dispatchUser(setWorkspaces([]));
              console.log("No workspaces found");
            }
          });
          break;
        default:
          console.log("No workspaces found");

      }
    }
  }, [user, activeTab])

  return (
    <div className={'mainContainer'} >

      <ProfileInfo isOpen={isProfileOn} onClose={handleProfileOpen} />

      <div className={'sidebar'}>
        <div className={'logo'}>
          <div className={'logoText'}>Code Fusion</div>
        </div>

        {[
          { text: 'Recent Workspaces', icon: Home },
          { text: 'My Workspaces', icon: Folder },
          { text: 'Shared with me', icon: Share2 },
          // { text: 'Chat', icon: MessageSquare }
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

        {/* <button className={'navButton'}>
          <Settings size={20} /> Settings
        </button>
        <button className={`navButton`} style={{ marginBottom: '20px' }}>
          <LogOut size={20} /> Logout
        </button> */}
      </div>


      <div className={'content'}>
        <Notification notificationPanel={notificationPanel} setNotificationPanel={setNotificationPanel} />

        <div className={'header'}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{showPage}</h1>

          <div className={'headerActions'}>
            <div className={'notificationBadge'} onClick={handleNotify}>
              <Bell size={20} />


              {notifications?.length > 0 && (
                <span className={'badge'}>{notifications?.length}</span>
              )}
            </div>


            <div onClick={handleProfileOpen} className={'profileIcon'} style={{
              backgroundColor: '#3b82f6',
              zIndex: 1001,
              cursor: 'pointer'
            }}>
              {(user.profilePic && <Profile />) || getInitials(user.name) || "G"}
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
          <div className={`tableHeader ${activeTab === 1 ? "own" : ""}`}>
            <div>Workspace Name</div>
            <div>Technology</div>
            <div>Last Accessed</div>
            {activeTab !== 1 && < div > Owner</div>}
            <div></div>
          </div>

          {
            workspaces.length > 0 ?
              workspaces.map((data, idx) => {
                console.log("Key ", idx)
                return (
                  < WorkspaceRow
                    key={idx}
                    data={data}
                    getRandomColor={getRandomColor}
                    getInitials={getInitials}
                    idx={idx}
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    activeTab={activeTab}
                  />
                )
              }) :
              <EmptyState />
          }
        </div>
      </div>
    </div >
  );
};

const WorkspaceRow = ({ data, getRandomColor, getInitials, idx, showMenu, setShowMenu, activeTab }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [rename, setIsRename] = useState(false);
  const [deleteWs, setIsDeleteWs] = useState(false);
  const tMenu = useRef(5000);
  const { user } = useContext(UserContext);

  const GoToIDE = () => {
    console.log("Ide running");
    navigate(`/IDE/${data.ownerName}/${data.workspaceName}`);
  }

  const handleRename = () => {
    setShowMenu(false);
    setIsRename(() => !rename);
  }


  const handleDelete = () => {
    setShowMenu(false);
    setIsDeleteWs(() => !deleteWs);
  }

  useEffect(() => {
    setTimeout(() => {
      setShowMenu(false);
    }, tMenu.current);
  }, [showMenu]);

  return (
    <>
      {rename && <RenameWorkspace onClose={handleRename} currentWorkspace={data.workspaceName} />}
      {deleteWs && <DeleteWorkspace onClose={handleDelete} currentWorkspace={data.workspaceName} />}
      <div
        className={`row ${isHovered ? 'hovered' : ''} ${activeTab === 1 ? "own" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="nameAndNaviagator" onClick={GoToIDE}>
          {data.workspaceName}
        </div>
        <div className='pl-5'>{data.techStack}</div>
        <div>{data.lastAccess}</div>
        {activeTab !== 1 && <div className="profile-container">
          <div
            className="profileIcon"
            style={{ backgroundColor: getRandomColor() }}
          >
            {(user.profilePic && <Profile />) || getInitials(data.ownerName)}
          </div>
          <span style={{ margin: 'auto 0' }}>{data.ownerName}</span>
        </div>}
        <div className="menu-container">
          <MoreVertical
            size={20}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowMenu((prev) => prev === idx ? -1 : idx)}
          />
          {showMenu === idx && (
            <div className="menu">
              {/* <div className="menuItem">Share Access</div> */}
              <div className="menuItem" onClick={handleRename}>Rename</div>
              <div className="menuItem delete" onClick={handleDelete}>Delete</div>
            </div>
          )}
        </div>
      </div >
    </>
  );
};


export default DashboardPage;