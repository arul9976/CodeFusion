// import React, { useState, useEffect, useRef } from 'react';
// import "./App.css";
// import CodeMirror from '@uiw/react-codemirror';

// import "./LogInPage/style.css"; 

import { Routes, Route } from "react-router-dom";

import Chat from "./Chat"



// import { python } from '@codemirror/lang-python';
// import { javascript } from '@codemirror/lang-javascript';
// import { java } from '@codemirror/lang-java';
// import { go } from '@codemirror/lang-go';
// import { ruby } from '@codemirror/lang-ruby';

// import { basicSetup } from 'codemirror';
// import { oneDark } from '@codemirror/theme-one-dark';
// import { io } from 'socket.io-client';
// import Term from './Terminal';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./LogInPage/loginRegister"; 
import ForgotPassword from "./LogInPage/ForgotPassword";
import ResetPassword from "./LogInPage/ResetPassword";
import IDEFileExplorer from "./IDEFileExplorer";



// const socket = io('http://localhost:3000');  // Connect to the WebSocket server

const App = () => {
  // const [code, setCode] = useState('');
  // const [cursor, setCursor] = useState({ line: 0, ch: 0 });  // Track cursor position
  // const editorRef = useRef(null);

  // const [language, setLanguage] = useState('python'); // Default language is JavaScript

  // const handleLanguageChange = (event) => {
  //   setLanguage(event.target.value);
  //   console.log(language);

  // };


  // const handleCodeChange = (editor, data, value) => {
  //   console.log('handleCodeChange called, value:', editor, data);
  //   console.log(editor);

  //   if (editor !== undefined) {
  //     setCode(editor);
  //     socket.emit('code-update', editor);
  //   }
  // };


  // const handleCursorChange = (editor, changeObj) => {
  //   const cursorPosition = editor.getCursor();
  //   setCursor(cursorPosition);
  //   socket.emit('cursor-position', cursorPosition);
  // };

  // const languageModes = {
  //   python,
  //   javascript,
  //   java,
  //   go,
  //   // ruby,
  // };

  // const extensions = [
  //   basicSetup,
  //   languageModes[language]() // Dynamically set the language mode
  // ];


  // const runCode = () => {
  //   if (code.length > 0) {
  //     socket.emit('output', { code, language });
  //   }
  // };

  // useEffect(() => {
  //   socket.on('code-update', (newCode) => {
  //     console.log("--> " + newCode);
  //     if (newCode != null)
  //       setCode(newCode);
  //   });

  //   socket.on('cursor-position', (position) => {
  //     setCursor(position);
  //   });


  //   return () => {
  //     socket.off('code-update');
  //     socket.off('cursor-position');
  //   };
  // }, []);

  return (




      /* <div style={{ width: '1200px', margin: '20px auto', display: 'grid', gap: '1em' }}>
        <h2>Live Python Code Editor</h2>

        <div style={{ width: '200px', height: '60px' }}>
          <label htmlFor="language-select">Select Language: </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}>

            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
             <option value="ruby">Ruby</option>
          </select>
        </div>

        <CodeMirror
          ref={editorRef}
          value={code}
          onChange={handleCodeChange}
          onCursorActivity={(editor) => handleCursorChange(editor)}
          extensions={extensions}
          height="400px"
          theme={oneDark}
          style={{ width: '100%', display: 'block', textAlign: 'start' }}
        />
        <button onClick={runCode}>Run Code</button>
      </div>


      <Term socket={socket} /> 
      */

      
    <Routes>
      <Route path="/loginRegister" element={<LoginRegister />} /> 
      {/* <Route path="/codeEditor" element ={<CodeEditor/>} /> */}
      <Route path="/forgotPassword" element ={<ForgotPassword/>}/>
        <Route path="/resetPassword" element ={<ResetPassword/>}/>
      <Route path="/chat" Component = {Chat} />
      <Route path="/IDEFileExplorer" element ={<IDEFileExplorer/>} />
 
    </Routes>
  
  )
};

export default App;
