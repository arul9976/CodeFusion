
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';

import LoginRegister from "./LogInPage/loginRegister";
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import GoogleAuth from "./Auth/GoogleAuth";
import { useContext, useEffect, useState } from "react";
import FileExplorer from "./FileExpo/FileExplorer";
import IDE from "./Editor/IDE";
import { UserContext } from "./LogInPage/UserProvider";
import DashPage from "./WorkSpace/Dashboard";
import Term from "./Terminal/Terminal";
import { useDispatch } from "react-redux";
import { setUser } from "./Redux/editorSlice";
import FileMenu from "./Editor/File/FIleMenu";
import ZohoRedirect from "./Auth/ZohoRedirect";
import { jwtLogin } from "./utils/Fetch";
import { usePopup } from "./PopupIndication/PopUpContext";
import LoadingScreen from "./Loading/loading";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user } = useContext(UserContext);
  
  const { showPopup } = usePopup();

  useEffect(() => {

    const token = localStorage.getItem("token");

    const endPoint = window.location.pathname.split("/").at(-1);
    if (token) {

      jwtLogin(token)
      .then(data => {
        console.log("User Data " + data.token);
        
        dispatch(setUser({
          name: data.name,
          username: data.username,
          email: data.email,
          isLoggedIn: true,
          token: token,
          profilePic: data.profilePic
        }));

        showPopup('Logged In Successfully', 'success', 3000);

      }).catch(err => {
        showPopup('Token Expired Relogin', 'warning', 3000);
        navigate("/loginRegister");

      })
      console.log(endPoint);
      
      if (endPoint.toLowerCase() === 'loginregister') {
        console.log("navigated to Dashboard");
        navigate("/Dashboard")
      }
    }
    else if (endPoint !== 'loginregister' && endPoint !== 'zohoredirect'){
      navigate("/loginRegister")
    }
  }, []);


  useEffect(() => {
    if (user.username) {
      console.log("Websocket initialized");
      
    }
  }, [user])

  return (

    <Routes>
      <Route path="/" element={<h1>Welcome</h1>} />
      <Route path="/loginRegister" Component={LoginRegister} />
      <Route path="/forgotPassword" Component={ForgotPassword} />
      <Route path="/resetPassword" Component={ResetPassword} />
      <Route path="/File" Component={FileExplorer} />
      <Route path="/IDE/:ownername/:workspace" Component={IDE} /> 
      <Route path="/Google" Component={GoogleAuth} />
      <Route path="/Chat" element={<Term/>} />
      <Route path="/Edit" element={<FileMenu/>} />
      <Route path="/Dashboard" element={<DashPage />} />
      <Route path="/zohoredirect" element={<ZohoRedirect/>} />
      <Route path="/Popup" element={<LoadingScreen/>} />



    </Routes>

  )
};

export default App;


