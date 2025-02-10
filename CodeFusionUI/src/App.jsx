import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import EditorPage from "./EditorPage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/editor" element={<EditorPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;