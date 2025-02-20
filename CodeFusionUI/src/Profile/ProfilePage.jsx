import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle,FaTimesCircle } from "react-icons/fa";

const ProfileInfo = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {

        navigate("/loginRegister");
    };

    return (
        <div className="profile-container1">

            <div className="profile-card1">
                <div className="header-image">
                    <button className="close-btn">
                        <FaTimesCircle className="close-icon" />
                    </button>

                    <div className="profile-picture-section1">
                        <div className="profile-picture1">
                            {user.profilePic ? (
                                <img src={user.profilePic} alt="Profile" className="profile-img1" />
                            ) : (
                                <FaUserCircle className="default-avatar1" />
                            )}
                        </div>
                    </div>
                </div>


                <div className="form">
                    <div className="basic-details">
                        <h2 className="style" style={{paddingTop:'7px'}}><br></br>{user.name}</h2>
                        <p className="style" style={{paddingTop:'7px'}}>{user.email}</p>
                        <p className="style" style={{padding:'7px'}}>{user.username}</p>
                        <button className="signout" onClick={handleLogout}>Sign Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;


