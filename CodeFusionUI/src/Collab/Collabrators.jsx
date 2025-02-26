// import { useState, useEffect, useRef } from "react";
// import { X, Search } from "lucide-react";
// import { FcCheckmark } from "react-icons/fc";
// import { MdPending } from "react-icons/md";
// import "./Collabrators.css";

// const Collaborators = () => {
// const [users, setUsers] = useState([]);
// const [search, setSearch] = useState("");
// const [filteredUsers, setFilteredUsers] = useState([]);
// const [collaborators, setCollaborators] = useState([]);
// const [selectedUser, setSelectedUser] = useState(null);
// const [isDropdownVisible, setIsDropdownVisible] = useState(false);
// const [isLoading, setIsLoading] = useState(true);
// const dropdownRef = useRef(null);

// useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("http://localhost:8080/Collaborator", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setUsers([
//         { name: "John Doe", email: "john@example.com", status: "pending" },
//         { name: "Jane Smith", email: "jane@example.com", status: "accepted" },
//         { name: "Alice Johnson", email: "alice@example.com", status: "accepted" },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchUsers();
// }, []);

// useEffect(() => {
//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsDropdownVisible(false);
//     }
//   };

//   document.addEventListener("mousedown", handleClickOutside);
//   return () => document.removeEventListener("mousedown", handleClickOutside);
// }, []);

// const handleSearch = (e) => {
//   const query = e.target.value;
//   setSearch(query);
//   setIsDropdownVisible(true);

//   if (query.trim() === "") {
//     setFilteredUsers([]);
//     setSelectedUser(null);
//   } else {
//     const filtered = users.filter(
//       (user) =>
//         user.name.toLowerCase().includes(query.toLowerCase()) ||
//         user.email.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }
// };

// const handleUserSelect = (user) => {
//   setSearch(user.name);
//   setSelectedUser(user);
//   setIsDropdownVisible(false);
// };

// const addCollaborator = () => {
//   if (selectedUser && !collaborators.some((collab) => collab.email === selectedUser.email)) {
//     setCollaborators([...collaborators, { ...selectedUser, status: "pending" }]);
//     setSearch("");
//     setSelectedUser(null);
//   }
// };

//   const acceptUser = (email) => {
//     setCollaborators(
//       collaborators.map((user) =>
//         user.email === email ? { ...user, status: "accepted" } : user
//       )
//     );
//   };

// const removeCollaborator = (email) => {
//   setCollaborators((prev) => {
//     const collaborator = document.querySelector(`[data-email="${email}"]`);
//     if (collaborator) {
//       collaborator.classList.add("remove-animation");
//     }

//     // Remove after animation
//     setTimeout(() => {
//       setCollaborators(prev.filter((user) => user.email !== email));
//     }, 300);

//     return prev;
//   });
// };

//   return (
// <div className="collaborator-container fade-in">
//   <div className="header-container">
//     <h2 className="header-title">Collaborators</h2>
//   </div>

// <div className="content-container">
//   <div className="input-div">
//     <label className="style-label">Give Access To</label>
//     <div className="collaborator-add" ref={dropdownRef}>
//       <div className="input-button-group">
//         <div className="search-wrapper">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             className="style-input"
//             value={search}
//             onChange={handleSearch}
//             onFocus={() => setIsDropdownVisible(true)}
//             placeholder="Search users..."
//           />
//         </div>
//         <button
//           className={`add-button ${selectedUser ? 'active' : ''}`}
//           onClick={addCollaborator}
//           disabled={!selectedUser}
//         >
//           Add
//         </button>
//       </div>

//       {isDropdownVisible && filteredUsers.length > 0 && (
//         <div className="dropdown-suggestions">
//           {filteredUsers.map((user) => (
//             <div
//               key={user.email}
//               className={`suggestion-item ${selectedUser?.email === user.email ? "selected" : ""}`}
//               onClick={() => handleUserSelect(user)}
//             >
//               <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
//               <div className="user-info">
//                 <div className="user-name">{user.name}</div>
//                 <div className="user-email">{user.email}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   </div>

//     <div className="collaborator-div">
//       <div className="searchDiv">
//         <p className="style-label">Manage Collaborators</p>
//       </div>
//       <div className="collaborator-divClasses">
//         {collaborators.map((user) => (
//           <div
//             key={user.email}
//             className="collaborator-item slide-in"
//             data-email={user.email}
//           >
//             <div className="user-avatar pulse">{user.name.charAt(0).toUpperCase()}</div>
//             <div className="user-info">
//               <div className="user-name">{user.name}</div>
//               <div className="user-email">{user.email}</div>
//             </div>
//             <div className="action-buttons">
//               {user.isAccepted ? (
//                 <div className="status-indicator accepted">
//                   <FcCheckmark size={18} />
//                 </div>
//               ) : (
//                 <button
//                   className="accept-button"
//                   onClick={() => acceptUser(user.email)}
//                 >
//                   <MdPending size={20} />
//                 </button>
//               )}
//               <button
//                 className="remove-button"
//                 onClick={() => removeCollaborator(user.email)}
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// </div>
//   );
// };

// export default Collaborators;



import { useState, useEffect, useRef, useContext } from "react";
import { X, Search, Check, Crown, Shield } from "lucide-react";
import { MdPending } from "react-icons/md";
import "./Collabrators.css";
import { addCollab, fetchCollaborators, searchUser } from "../utils/Fetch";
import { ClientContext } from "../Editor/ClientContext";
import { UserContext } from "../LogInPage/UserProvider";

const Collaborators = ({ setIsCollabOpen, workSpaceName }) => {


  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClose, setIsClose] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {

    setIsLoading(true);

    // const fetchUsers = async () => {
    //   try {
    //     const response = await fetch(`${import.meta.env.VITE_SERVLET_URL}/getCollabs?wsName=${encodeURI(workSpaceName)}&email=${encodeURI(user.email)}`);

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }

    //     return response.json();

    //   } catch (error) {
    //     console.error("Fetch error:", error);
    
    //   }
    // };

    fetchCollaborators(workSpaceName, user.email).then(data => {
      setCollaborators(data);
      console.log(data);
    }).catch(err => {
      console.error("Fetch error:", err);
      // setUsers([
      //   { name: "John Doe", email: "john@example.com", status: "pending" },
      //   { name: "Jane Smith", email: "jane@example.com", status: "accepted" },
      //   { name: "Alice Johnson", email: "alice@example.com", status: "accepted" },
      // ]);
    }).finally(() => {
      setIsLoading(false);
    })

  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // useEffect(() => {
  //   if (selectedUser) {
  //     addCollaborator({
  //       email: selectedUser.email,
  //       name: user.name,
  //       wsName: currWorkSpace.current
  //     })
  //   }
  // }, [selectedUser])

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    setIsDropdownVisible(true);



    if (query.trim() === "") {
      setFilteredUsers([]);
      setSelectedUser(null);
    } else {
      searchUser(query)
        .then(res => {
          setFilteredUsers(res.filter(u => u.username !== user.username));
        }).catch(err => {
          console.error("Search error:", err);
        })
      // setFilteredUsers(filtered);
    }
  };

  const handleUserSelect = (user) => {
    setSearch(user.username);
    setSelectedUser(user);
    setIsDropdownVisible(false);
  };

  const addCollaborator = async () => {
    if (selectedUser && !collaborators.some((collab) => collab.email === selectedUser.email)) {
      console.log({
        collabEmail: selectedUser.email,
        email: user.email,
        wsName: workSpaceName,
        accepted: true
      });

      const sendCollaborator = {
        collabEmail: selectedUser.email,
        email: user.email,
        wsName: workSpaceName,
        accepted: true

      };

      addCollab(sendCollaborator).then(res => {
        console.log(res);
        setCollaborators([...collaborators, selectedUser]);
        setSelectedUser(null);

      }).catch(err => {
        console.error("Adding collaborator error:", err);
      })

      setSearch("");
    }
  };

  const acceptUser = (email) => {
    const collaborator = document.querySelector(`[data-email="${email}"]`);
    if (collaborator) {
      collaborator.classList.add("accepting");
      setTimeout(() => {
        setCollaborators(collaborators.map(user =>
          user.email === email ? { ...user, status: "accepted" } : user
        ));
      }, 500);
    }
  };

  const removeCollaborator = (email) => {
    setCollaborators((prev) => {
      const collaborator = document.querySelector(`[data-email="${email}"]`);
      if (collaborator) {
        collaborator.classList.add("remove-animation");
      }

      // Remove after animation
      setTimeout(() => {
        setCollaborators(prev.filter((user) => user.email !== email));
      }, 300);

      return prev;
    });
  };

  const closePanel = () => {
    setIsClose(true);
    setTimeout(() => {
      setIsCollabOpen(false);

    }, 500);
  }

  return (<>
    <div className="modal-overlay" onClick={closePanel}></div>
    <div className={`collaborator-modal`}>
      <div className={`collaborator-container glass-morphism ${isClose && 'close'}`}>
        <div className="header-container">
          <h2 className="header-title">
            <Crown className="header-icon" />
            Collaborators
          </h2>
          <div className="header-pill">Team Space</div>
        </div>

        <div className="content-container">
          <div className="input-div">
            <label className="style-label">Give Access To</label>
            <div className="collaborator-add" ref={dropdownRef}>
              <div className="input-button-group">
                <div className="search-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="style-input"
                    value={search}
                    onChange={handleSearch}
                    onFocus={() => setIsDropdownVisible(true)}
                    placeholder="Search user by username..."
                  />
                </div>
                <button
                  className={`add-button ${selectedUser ? 'active' : ''}`}
                  onClick={addCollaborator}
                  disabled={!selectedUser}
                >
                  Add
                </button>
              </div>

              {isDropdownVisible && filteredUsers.length > 0 && (
                <div className="dropdown-suggestions">
                  {filteredUsers.map((collaborator) => (
                    <div
                      key={collaborator.email}
                      className={`suggestion-item ${selectedUser?.email === collaborator.email ? "selected" : ""}`}
                      onClick={() => handleUserSelect(collaborator)}
                    >
                      <div className="user-avatar">{collaborator.username.charAt(0).toUpperCase()}</div>
                      <div className="user-info">
                        <div className="user-name">{collaborator.username}</div>
                        <div className="user-email">{collaborator.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="collaborator-divClasses">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.email}
              className={`collaborator-item slide-in ${collaborator.isAccepted ? "accepted-item" : ""}`}
              data-email={collaborator.email}
            >
              <div className="user-avatar-wrapper">
                <div className="user-avatar glow-effect">{collaborator.username.charAt(0).toUpperCase()}</div>
                {collaborator.isAccepted && (
                  <div className="status-badge">
                    <Shield className="status-icon" />
                  </div>
                )}
              </div>

              <div className="user-info">
                <div className="user-name">{collaborator.username}</div>
                <div className="user-email">{collaborator.email}</div>
                {collaborator.isAccepted && (
                  <div className="access-level">Full Access Granted</div>
                )}
              </div>

              <div className="action-buttons">
                {collaborator?.isAccepted ? (
                  <div className="status-indicator accepted">
                    <div className="success-ring">
                      <Check size={18} />
                    </div>
                  </div>
                ) : (
                  <button
                    className="accept-button ripple-effect"
                    onClick={() => acceptUser(collaborator.email)}
                  >
                    <MdPending size={20} />
                  </button>
                )}
                <button
                  className="remove-button ripple-effect"
                  onClick={() => removeCollaborator(collaborator.email)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  );
};

export default Collaborators;