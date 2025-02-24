// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { X, UserCircle, LogOut, Edit, Mail, User, Camera } from 'lucide-react';

// const ProfileInfo = ({ user, isOpen = true, onClose }) => {
//     const navigate = useNavigate();
//     const [isHovered, setIsHovered] = useState(false);
//     const [editMode, setEditMode] = useState({
//         name: false,
//         username: false
//     });
//     const [formData, setFormData] = useState({
//         name: user?.name || 'John Doe',
//         username: user?.username || '@johndoe'
//     });

//     const handleEdit = (field) => {
//         setEditMode(prev => ({
//             ...prev,
//             [field]: true
//         }));
//     };

//     const handleSave = (field) => {
//         setEditMode(prev => ({
//             ...prev,
//             [field]: false
//         }));
//         // Here you would typically make an API call to save the changes
//     };

//     const handleChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const styles = {
//         overlay: {
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             opacity: isOpen ? 1 : 0,
//             visibility: isOpen ? 'visible' : 'hidden',
//             transition: 'opacity 0.3s ease, visibility 0.3s ease',
//             zIndex: 999,
//         },
//         sidebar: {
//             position: 'fixed',
//             top: 0,
//             right: 0,
//             height: '100%',
//             width: '380px',
//             backgroundColor: '#1e293b',
//             boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.3)',
//             transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
//             transition: 'transform 0.3s ease-in-out',
//             zIndex: 1000,
//         },
//         header: {
//             height: '192px',
//             background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
//             position: 'relative',
//             overflow: 'hidden',
//         },
//         closeButton: {
//             position: 'absolute',
//             top: '16px',
//             right: '16px',
//             width: '40px',
//             height: '40px',
//             borderRadius: '50%',
//             backgroundColor: 'rgba(255, 255, 255, 0.2)',
//             border: 'none',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backdropFilter: 'blur(4px)',
//             transition: 'background-color 0.2s ease',
//         },
//         profileSection: {
//             position: 'absolute',
//             bottom: '-64px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             zIndex: 2,
//         },
//         profilePicture: {
//             width: '128px',
//             height: '128px',
//             borderRadius: '50%',
//             border: '6px solid #1e293b',
//             backgroundColor: '#2a3749',
//             overflow: 'hidden',
//             position: 'relative',
//             cursor: 'pointer',
//         },
//         profileImage: {
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//         },
//         cameraOverlay: {
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             opacity: isHovered ? 1 : 0,
//             transition: 'opacity 0.3s ease',
//         },
//         formSection: {
//             marginTop: '80px',
//             padding: '24px',
//         },
//         formGroup: {
//             marginBottom: '24px',
//             padding: '16px',
//             backgroundColor: '#2a3749',
//             borderRadius: '12px',
//             position: 'relative',
//         },
//         formLabel: {
//             position: 'absolute',
//             top: '-10px',
//             left: '12px',
//             backgroundColor: '#2a3749',
//             padding: '0 8px',
//             color: '#94a3b8',
//             fontSize: '14px',
//         },
//         inputContainer: {
//             display: 'flex',
//             alignItems: 'center',
//             gap: '12px',
//         },
//         icon: {
//             color: '#3b82f6',
//         },
//         input: {
//             flex: 1,
//             background: 'transparent',
//             border: 'none',
//             color: '#ffffff',
//             fontSize: '16px',
//             outline: 'none',
//         },
//         editButton: {
//             background: 'none',
//             border: 'none',
//             padding: 0,
//             cursor: 'pointer',
//             color: '#3b82f6',
//             opacity: 0,
//             transition: 'opacity 0.2s ease',
//         },
//         signOutButton: {
//             width: '100%',
//             padding: '16px',
//             backgroundColor: '#ef4444',
//             border: 'none',
//             borderRadius: '12px',
//             color: '#ffffff',
//             fontSize: '16px',
//             fontWeight: 500,
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '8px',
//             transition: 'all 0.2s ease',
//             marginTop: '32px',
//         },
//         decorativeCircle1: {
//             position: 'absolute',
//             width: '150px',
//             height: '150px',
//             top: '-75px',
//             left: '-75px',
//             borderRadius: '50%',
//             background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
//         },
//         decorativeCircle2: {
//             position: 'absolute',
//             width: '100px',
//             height: '100px',
//             top: '20px',
//             right: '50px',
//             borderRadius: '50%',
//             background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
//         },
//         value: {
//             color: '#ffffff',
//             flex: 1,
//         }
//     };

//     return (
//         <>
//             <div style={styles.overlay} onClick={onClose} />
//             <div style={styles.sidebar}>
//                 <div style={styles.header}>
//                     <div style={styles.decorativeCircle1} />
//                     <div style={styles.decorativeCircle2} />

//                     <button
//                         style={styles.closeButton}
//                         onClick={onClose}
//                         onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
//                         onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
//                     >
//                         <X color="white" size={20} />
//                     </button>

//                     <div style={styles.profileSection}>
//                         <div
//                             style={styles.profilePicture}
//                             onMouseEnter={() => setIsHovered(true)}
//                             onMouseLeave={() => setIsHovered(false)}
//                         >
//                             {user?.profilePic ? (
//                                 <img src={user.profilePic} alt="Profile" style={styles.profileImage} />
//                             ) : (
//                                 <UserCircle size={116} color="#94a3b8" />
//                             )}
//                             <div style={styles.cameraOverlay}>
//                                 <Camera size={24} color="white" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div style={styles.formSection}>
//                     {/* Name Field */}
//                     <div
//                         style={styles.formGroup}
//                         onMouseEnter={(e) => e.querySelector('.edit-button').style.opacity = 1}
//                         onMouseLeave={(e) => e.querySelector('.edit-button').style.opacity = 0}
//                     >
//                         <span style={styles.formLabel}>Full Name</span>
//                         <div style={styles.inputContainer}>
//                             <User size={20} style={styles.icon} />
//                             {editMode.name ? (
//                                 <input
//                                     type="text"
//                                     value={formData.name}
//                                     onChange={(e) => handleChange('name', e.target.value)}
//                                     style={styles.input}
//                                     onBlur={() => handleSave('name')}
//                                     autoFocus
//                                 />
//                             ) : (
//                                 <>
//                                     <span style={styles.value}>{formData.name}</span>
//                                     <button
//                                         className="edit-button"
//                                         style={styles.editButton}
//                                         onClick={() => handleEdit('name')}
//                                     >
//                                         <Edit size={16} />
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* Email Field */}
//                     <div style={styles.formGroup}>
//                         <span style={styles.formLabel}>Email</span>
//                         <div style={styles.inputContainer}>
//                             <Mail size={20} style={styles.icon} />
//                             <span style={styles.value}>{user?.email || 'john@example.com'}</span>
//                         </div>
//                     </div>

//                     {/* Username Field */}
//                     <div
//                         style={styles.formGroup}
//                         onMouseEnter={(e) => e.querySelector('.edit-button').style.opacity = 1}
//                         onMouseLeave={(e) => e.querySelector('.edit-button').style.opacity = 0}
//                     >
//                         <span style={styles.formLabel}>Username</span>
//                         <div style={styles.inputContainer}>
//                             <User size={20} style={styles.icon} />
//                             {editMode.username ? (
//                                 <input
//                                     type="text"
//                                     value={formData.username}
//                                     onChange={(e) => handleChange('username', e.target.value)}
//                                     style={styles.input}
//                                     onBlur={() => handleSave('username')}
//                                     autoFocus
//                                 />
//                             ) : (
//                                 <>
//                                     <span style={styles.value}>{formData.username}</span>
//                                     <button
//                                         className="edit-button"
//                                         style={styles.editButton}
//                                         onClick={() => handleEdit('username')}
//                                     >
//                                         <Edit size={16} />
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     <button
//                         style={styles.signOutButton}
//                         onClick={() => navigate('/loginRegister')}
//                         onMouseEnter={(e) => {
//                             e.target.style.backgroundColor = '#dc2626';
//                             e.target.style.transform = 'translateY(-2px)';
//                         }}
//                         onMouseLeave={(e) => {
//                             e.target.style.backgroundColor = '#ef4444';
//                             e.target.style.transform = 'translateY(0)';
//                         }}
//                     >
//                         <LogOut size={20} />
//                         Sign Out
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ProfileInfo;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UserCircle, LogOut, Edit, Mail, User, Camera } from 'lucide-react';
import ProfileEdit from './ProfileEdit';

const ProfileInfo = ({ user, setUser, isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editMode, setEditMode] = useState({
        name: false,
        username: false
    });
    const [formData, setFormData] = useState({
        name: user?.name || 'John Doe',
        username: user?.username || '@johndoe',
        email: user?.email || 'johndoe@gmail.com'
    });

    const handleEdit = (field) => {
        setEditMode(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSave = (field) => {
        setEditMode(prev => ({
            ...prev,
            [field]: false
        }));
        // Here you would typically make an API call to save the changes
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
            zIndex: 1002,
        },
        sidebar: {
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            width: '380px',
            backgroundColor: '#1e293b',
            boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.3)',
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 1005,
        },
        header: {
            height: '192px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            position: 'relative',
            overflow: 'hidden',
        },
        closeButton: {
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            padding: '10px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            transition: 'background-color 0.2s ease',
        },
        profileSection: {
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
        },
        profilePicture: {
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            border: '6px solid #1e293b',
            backgroundColor: '#2a3749',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
        },
        profileImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        cameraOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
        },
        formSection: {
            marginTop: '80px',
            padding: '24px',
        },
        formGroup: {
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#2a3749',
            borderRadius: '12px',
            position: 'relative',
        },
        formLabel: {
            position: 'absolute',
            top: '-10px',
            left: '12px',
            backgroundColor: '#2a3749',
            padding: '0 8px',
            color: '#94a3b8',
            fontSize: '14px',
        },
        inputContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        icon: {
            color: '#3b82f6',
        },
        input: {
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            fontSize: '16px',
            outline: 'none',
        },
        editButton: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',

            background: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: '#3b82f6',
            // opacity: 0,
            transition: 'opacity 0.2s ease',
        },
        signOutButton: {
            width: '100%',
            padding: '16px',
            backgroundColor: '#ef4444',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            marginTop: '32px',
        },
        decorativeCircle1: {
            position: 'absolute',
            width: '150px',
            height: '150px',
            top: '-75px',
            left: '-75px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        },
        decorativeCircle2: {
            position: 'absolute',
            width: '100px',
            height: '100px',
            top: '20px',
            right: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        },
        value: {
            color: '#ffffff',
            flex: 1,
        }
    };

    return (
        <>
            <div style={styles.overlay} onClick={onClose} />
            <div style={styles.sidebar}>
                <div style={styles.header}>
                    <div style={styles.decorativeCircle1} />
                    <div style={styles.decorativeCircle2} />

                    {/* <button
                        style={styles.closeButton}
                        onClick={onClose}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                    > */}
                    <X color="white" style={styles.closeButton} onClick={onClose} size={15} />
                    {/* </button> */}

                    <div style={styles.profileSection}>
                        <div
                            style={styles.profilePicture}
                            onMouseEnter={() => { setIsHovered(true); }}
                            onMouseLeave={() => { setIsHovered(false); }}
                        // onMouseEnter={(e) => e.target.querySelector('.edit-button').style.opacity = 1}
                        // onMouseLeave={(e) => e.target.querySelector('.edit-button').style.opacity = 0}
                        >
                            {user?.profilePic ? (
                                <img src={user.profilePic} alt="Profile" style={styles.profileImage} />
                            ) : (
                                <UserCircle size={116} color="#94a3b8" />
                            )}
                            <div style={styles.cameraOverlay}>
                                <Camera size={24} color="white" />


                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.formSection}>

                    <button
                        className="edit-button"
                        style={styles.editButton}
                        onClick={() => { setIsEditModalOpen(true); onClose() }}
                    >
                        <Edit size={16} />
                    </button>

                    {/* Name Field */}
                    <div
                        style={styles.formGroup}

                    >
                        <span style={styles.formLabel}>Full Name</span>
                        <div style={styles.inputContainer}>
                            <User size={20} style={styles.icon} />
                            {editMode.name ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    style={styles.input}
                                    onBlur={() => handleSave('name')}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <span style={styles.value}>{formData.name}</span>
                                    {/* <button
                                        className="edit-button"
                                        style={styles.editButton}
                                        onClick={() => handleEdit('name')}
                                    >
                                        <Edit size={16} />
                                    </button> */}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div style={styles.formGroup}>
                        <span style={styles.formLabel}>Email</span>
                        <div style={styles.inputContainer}>
                            <Mail size={20} style={styles.icon} />
                            <span style={styles.value}>{user?.email || 'john@example.com'}</span>
                        </div>
                    </div>

                    {/* Username Field */}
                    <div
                        style={styles.formGroup}

                    >
                        <span style={styles.formLabel}>Username</span>
                        <div style={styles.inputContainer}>
                            <User size={20} style={styles.icon} />
                            {editMode.username ? (
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    style={styles.input}
                                    onBlur={() => handleSave('username')}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <span style={styles.value}>{formData.username}</span>
                                    {/* <button
                                        className="edit-button"
                                        style={styles.editButton}
                                        onClick={() => handleEdit('username')}
                                    >
                                        <Edit size={16} />
                                    </button> */}
                                </>
                            )}
                        </div>

                    </div>

                    <button
                        style={styles.signOutButton}
                        onClick={() => navigate('/loginRegister')}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#ef4444';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>

            <ProfileEdit
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
                setUser={setUser}
            />
        </>
    );
};

export default ProfileInfo;



