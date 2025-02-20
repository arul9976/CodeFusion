
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
// import Chat from "./ChatComponents/Chat"

import LoginRegister from "./LogInPage/loginRegister";
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import CodeEditor from "./Editor/CodeEditor";
import EditorACE from "./Editor/EditorACE";
import GoogleAuth from "./Auth/GoogleAuth";
import { useEffect } from "react";
import FileExplorer from "./FileExpo/FileExplorer";
import IDE from "./Editor/IDE";
import TestEditor from "./Editor/MonacoIDE";
const App = () => {
  
  const navigate = useNavigate();
  
  // useEffect(() => {
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //         navigate("/IDE")
  //       }else {
  //         navigate("/loginRegister")
  //       }
  //      }, []);
      
  return (

    <Routes>
      <Route path="/" element={<h1>Welcome</h1>} />
      <Route path="/loginRegister" Component={LoginRegister} />
      <Route path="/forgotPassword" Component={ForgotPassword} />
      <Route path="/resetPassword" Component={ResetPassword} />
      <Route path="/File" Component={FileExplorer} />
      <Route path="/IDE" Component={IDE} /> 
       <Route path="/IDE1" Component={CodeEditor} />
      <Route path="/Google" Component={GoogleAuth} />
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
       