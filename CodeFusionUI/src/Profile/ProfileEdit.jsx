// import { useState, useRef } from "react";
// import { FaUser, FaCamera } from "react-icons/fa";
// import "./Profile.css";

// const ProfileEdit = ({ user, setUser }) => {

//   const [formData, setFormData] = useState({
//     name: user?.name || "Leo",
//     email: user?.email || "leo@gmail.com",
//     username: user?.username || "leo001", 
//     profilePic: user?.profilePic || null,
//   });

//   const fileInputRef = useRef(null);
//   const handleImageUpload = (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFormData((prev) => ({
//           ...prev,
//           profilePic: reader.result,
//         }));
//         setUser((prev) => ({ ...prev, profilePic: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name !== "username") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedProfile = {
//       originalEmail: user.email, 
//       name: formData.name,
//       email: formData.email,
//       password: formData.password, 
//     };

//     try {
//       const response = await fetch("http://localhost:8080/CodeFusionUI/EditProfileServlet", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedProfile),
//       });

//       const result = await response.json();
//       if (result.status === "success") {
//         setUser((prev) => ({ ...prev, ...formData }));
//         alert("Profile updated successfully!");
//       } else {
//         alert("Failed to update profile: " + result.message);
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };



//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <h2 className="profile-title">
//           <FaUser className="profile-icon" />
//           Profile
//         </h2>

//         <div className="profile-picture-section">
//           <div className="profile-picture">
//             {formData.profilePic ? (
//               <img src={formData.profilePic} alt="Profile" className="profile-img" />
//             ) : (
//               <div className="default-avatar">
//                 <FaUser />
//               </div>
//             )}
//           </div>

//           <button className="change-photo-btn" onClick={() => fileInputRef.current?.click()}>
//             <FaCamera className="camera-icon" />
//             Change Photo
//             <input ref={fileInputRef} type="file" onChange={handleImageUpload} accept="image/*" hidden />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="profile-form">
//           <div className="input-group">
//             <label>Username</label>
//             <input type="text" name="username" value={formData.username} className="profile-input" readOnly />
//           </div>

//           <div className="input-group">
//             <label>Name</label>
//             <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="profile-input" />
//           </div>

//           <div className="input-group">
//             <label>Email</label>
//             <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="profile-input" />
//           </div>

//           <button type="submit" className="save-button">
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProfileEdit;

import React, { useState, useRef, useContext, useEffect } from 'react';
import { X, UserCircle, Camera, Save } from 'lucide-react';
import { UserContext } from '../LogInPage/UserProvider';
import { updateNkname } from '../Redux/editorSlice';
import { usePopup } from '../PopupIndication/PopUpContext';
import axios from 'axios';
import { updateProfileDB } from '../utils/Fetch';

const ProfileEdit = ({ isOpen, onClose, user, setUser }) => {

  const { dispatchUser } = useContext(UserContext);

  const { showPopup } = usePopup();

  const [formData, setFormData] = useState({
    name: user?.name || "Leo",
    profilePic: user?.profilePic || null,
  });
  const fileInputRef = useRef(null);
  const fileRef = useRef(null);
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      fileRef.current = file;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      email: user.email,
      updated_name: formData.name,
      updated_password: "",
    };

    console.log(updatedProfile, fileRef.current);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('profilePic', fileRef.current);

    try {

      const picResult = await axios.post(`${import.meta.env.VITE_RUNNER_URL}/uploadProficPic/${user.username}`, {
        method: 'POST',
        body: formDataToSubmit
      });

      updatedProfile['profilePic'] = user.profilePic;
      console.log(picResult);

      if (picResult.status === 200) {
        const uploadedImg = await picResult.json();
        updatedProfile['profilePic'] = uploadedImg.fileUrl;
      }
      else if (picResult.status === 204) {
        const response = await updateProfileDB(updatedProfile);


        if (response?.success) {
          showPopup('Profile Updated Successfully', 'success', 3000);

          dispatchUser(updateNkname({
            name: updatedProfile.updated_name,
            email: user.email,
            profilePic: updatedProfile.profilePic,
          }))
          onClose();
        } else {
          // alert("Failed to update profile: " + result.message);
          showPopup('Failed to update profile', 'error', 3000);
        }
      }
      else {
        // alert("Failed to update profile: " + result.message);
        showPopup("Error in Profile Updating", 'error', 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showPopup('Update Failed', 'error', 3000);

    }
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      width: '400px',
      backgroundColor: '#1e293b',
      borderRadius: '20px',
      padding: '24px',
      animation: 'modalFadeIn 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: '600',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '8px',
    },
    profileSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '24px',
    },
    profilePicture: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      position: 'relative',
      marginBottom: '16px',
      cursor: 'pointer',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      color: '#94a3b8',
      marginBottom: '8px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2a3749',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
    },
    saveButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, name: user.name }));
  }, [user])

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Edit Profile</h2>
          <button style={modalStyles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={modalStyles.profileSection}>
            <div
              style={modalStyles.profilePicture}
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.profilePic ? (
                <img
                  src={formData.profilePic}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <UserCircle size={120} color="#94a3b8" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: '#2a3749',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Camera size={16} />
              Change Photo
            </button>
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              style={modalStyles.input}
            />
          </div>

          <button type="submit" style={modalStyles.saveButton}>
            <Save size={20} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;