
import { Routes, Route } from "react-router-dom";
import './App.css';
// import Chat from "./ChatComponents/Chat"

import LoginRegister from "./LogInPage/loginRegister";
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import CodeEditor from "./Editor/CodeEditor";
import EditorACE from "./Editor/EditorACE";

const App = () => {
  return (

    <Routes>
      <Route path="/" element={<h1>Welcome</h1>} />
      <Route path="/loginRegister" Component={LoginRegister} />
      <Route path="/forgotPassword" Component={ForgotPassword} />
      <Route path="/resetPassword" Component={ResetPassword} />
      <Route path="/IDE" Component={EditorACE} />

    </Routes>

  )
};

export default App;
