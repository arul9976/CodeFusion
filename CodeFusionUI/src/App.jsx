
import { Routes, Route } from "react-router-dom";

import Chat from "./Chat"

import LoginRegister from "./LogInPage/loginRegister";
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import IDEFileExplorer from "./IDEFileExplorer";

const App = () => {
  return (


    <Routes>
      <Route path="/loginRegister" element={<LoginRegister />} />
      {/* <Route path="/codeEditor" element ={<CodeEditor/>} /> */}
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/chat" Component={Chat} />
      <Route path="/IDEFileExplorer" element={<IDEFileExplorer />} />

    </Routes>

  )
};

export default App;
