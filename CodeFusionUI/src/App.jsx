
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
// import Chat from "./ChatComponents/Chat"

import LoginRegister from "./LogInPage/loginRegister";
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import CodeEditor from "./Editor/CodeEditor";
import EditorACE from "./Editor/EditorACE";
import GoogleAuth from "./Auth/GoogleAuth";
import { useContext, useEffect, useState } from "react";
import FileExplorer from "./FileExpo/FileExplorer";
import IDE from "./Editor/IDE";
import TestEditor from "./Editor/MonacoIDE";
import Chat from "./ChatComponents/Chat";
import { UserContext } from "./LogInPage/UserProvider";
import NewFileComp from "./FileExpo/NewFileComp";
import ProfileInfo from "./Profile/ProfilePage";
import ProfileEdit from "./Profile/ProfileEdit";
import TechnologyStack from "./WorkSpace/TechnologyStack";
import DashPage from "./WorkSpace/Dashboard";
import Notification from "./WorkSpace/Notification";
import CreateWorkspace from "./WorkSpace/CwTemplate";
import Collaborators from "./Collab/Collabrators";
import Term from "./Terminal/Terminal";
import { useDispatch } from "react-redux";
import { setUser } from "./Redux/editorSlice";
import RenameWorkspace from "./WorkSpace/RenameWorkspace";
import FileMenu from "./Editor/File/FIleMenu";
import Popup from "./PopupIndication/Popup";
import ZohoRedirect from "./Auth/ZohoRedirect";
import { jwtLogin } from "./utils/Fetch";
import { usePopup } from "./PopupIndication/PopUpContext";
import MonacoCollaborativeEditor from "./Demo";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
// const userinfo = useState()
  // const user = useContext(UserContext);
  const {user, initWebSocketConnection } = useContext(UserContext);
  
  const { showPopup } = usePopup();

  useEffect(() => {

    const token = localStorage.getItem("token");
    // const username = localStorage.getItem("username");
    // const name = localStorage.getItem("name");
    // const email = localStorage.getItem("email");

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

      // dispatch(setUser({
      //   name: name,
      //   username: username,
      //   email: email,
      //   isLoggedIn: true,
      //   token: token,
      //   profilePic: localStorage.getItem("profilePic") 
      // }));

      // console.log("In App", user.user, user);
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
      
      // initWebSocketConnection(user.username, user.username + "$ABC");
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
       {/* <Route path="/IDE1" Component={CodeEditor} /> */}
      <Route path="/Google" Component={GoogleAuth} />
      <Route path="/Chat" element={<Term/>} />
      {/* <Route path="/NewFile" Component={MonacoCollaborativeEditor} /> */}
      <Route path="/Edit" element={<FileMenu/>} />
      <Route path="/Dashboard" element={<DashPage />} />
      <Route path="/zohoredirect" element={<ZohoRedirect/>} />
      <Route path="/Popup" element={<Popup message={"Hello"} type="error" />} />

      {/* <Route path="/Collab" element={<Collaborators />} /> */}
      {/* <Route path="/Tech" element={<CreateWorkspace />} /> */}
      {/* <Route path="/Profile" element={<ProfileInfo user={{
        name: 'john',
        email: 'john@example.com',
        username: 'johndao'
      }}/>} /> */}
      {/* <Route path="/Test" Component={TestEditor} /> */}

    </Routes>

  )
};

export default App;




  //   <context-param>
  //       <param-name>jwt.secret</param-name>
  //       <param-value>arulkumar</param-value>
  //   </context-param>

  //   <filter>
  //       <filter-name>CORSFilter</filter-name>
  //       <filter-class>codeFusionClasses.CORSFilter</filter-class>
  //   </filter>
  
  //   <filter>
  //       <filter-name>JwtAuthFilter</filter-name>
  //       <filter-class>auth.JwtAuthFilter</filter-class>
  //   </filter>
    
    // <filter-mapping>
    //     <filter-name>CORSFilter</filter-name>
    //     <url-pattern>/*</url-pattern>  
        
    // </filter-mapping>


	//   <filter-mapping>
  //       <filter-name>JwtAuthFilter</filter-name>
  //       <url-pattern>/api/*</url-pattern>
  //   </filter-mapping>
       