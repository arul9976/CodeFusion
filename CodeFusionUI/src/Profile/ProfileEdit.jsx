import { useState, useRef } from "react";
import { FaUser, FaCamera } from "react-icons/fa";
import "./Profile.css";

const ProfileEdit = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "", // Keep username read-only
    profilePic: user?.profilePic || null,
  });

  const fileInputRef = useRef(null);
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
        setUser((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "username") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedProfile = {
      originalEmail: user.email, 
      name: formData.name,
      email: formData.email,
      password: formData.password, 
    };
  
    try {
      const response = await fetch("http://localhost:8080/CodeFusionUI/EditProfileServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });
  
      const result = await response.json();
      if (result.status === "success") {
        setUser((prev) => ({ ...prev, ...formData }));
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + result.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };



  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">
          <FaUser className="profile-icon" />
          Profile
        </h2>

        <div className="profile-picture-section">
          <div className="profile-picture">
            {formData.profilePic ? (
              <img src={formData.profilePic} alt="Profile" className="profile-img" />
            ) : (
              <div className="default-avatar">
                <FaUser />
              </div>
            )}
          </div>

          <button className="change-photo-btn" onClick={() => fileInputRef.current?.click()}>
            <FaCamera className="camera-icon" />
            Change Photo
            <input ref={fileInputRef} type="file" onChange={handleImageUpload} accept="image/*" hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} className="profile-input" readOnly />
          </div>

          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="profile-input" />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="profile-input" />
          </div>

          <button type="submit" className="save-button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;