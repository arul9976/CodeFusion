

import React, {useEffect,useState } from "react";
import { Routes, Route } from "react-router-dom";


import './App.css';
import Chat from "./ChatComponents/Chat"
import LoginRegister from "./LogInPage/loginRegister";
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import CodeEditor from "./Editor/CodeEditor";
import ProfileEdit from "./Profile/ProfileEdit";
import LoadingScreen from "./Profile/Loading";
import ProfileInfo from "./Profile/ProfilePage";
import profilePic from "./images/10.jpg"; // Import image
import CwTemplate from "./Template/CwTemplate";
import TechnologyStacks from "./Template/TechnologyStack";


const App = () => {
  // const [user, setUser] = useState({
  //   name: "John Doe",
  //   username: "johndoe123",
  //   email: "johndoe@example.com",
  //   profilePic: profilePic,
  // });

  
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const email = "Ponkavi14256@gmail.com"; 
  
      const response = await fetch("http://localhost:8080/CodeFusionUI/ProfileServlet ", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `email=${encodeURIComponent(email)}`,
      });
  
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
      <Routes>
        <Route path="/loginRegister" element={<LoginRegister />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/profileInfo" element={<ProfileInfo user={user}/>} />
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/ProfileEdit" element={<ProfileEdit user={user} setUser={setUser} />} /> 
       <Route path="/cwTemplate" element ={<CwTemplate/>} />
       <Route path="/technologyStack" element ={<TechnologyStacks />} />
      </Routes>
      
     
  
  );
};


export default App;



