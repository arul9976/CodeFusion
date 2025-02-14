
import { Routes, Route } from "react-router-dom";
import './App.css';
import Chat from "./ChatComponents/Chat"

import LoginRegister from "./LogInPage/loginRegister";
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import CodeEditor from "./Editor/CodeEditor";

const App = () => {
  return (


    <Routes>
      <Route path="/" element={<h1>Welcome</h1>} />
      <Route path="/loginRegister" Component={LoginRegister} />
      {/* <Route path="/codeEditor" Component ={<CodeEditor/>} /> */}
      <Route path="/forgotPassword" Component={ForgotPassword} />
      <Route path="/resetPassword" Component={ResetPassword} />
      {/* <Route path="/chat" Component={Chat} /> */}
      <Route path="/IDE" Component={CodeEditor} />

    </Routes>

  )
};

export default App;
