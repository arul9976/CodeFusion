
import React, { useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import Term from './Terminal';
import ace from 'ace-builds';
import './App.css';

// Import ace builds and configure worker path
ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/');
ace.config.set('modePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/');
ace.config.set('themePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/');
ace.config.set('workerPath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.2/');

// Import themes
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-twilight';

// Import modes
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-ruby';

// Import extensions
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-code_lens';
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite';

// Import snippets
import 'ace-builds/src-noconflict/snippets/python';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/snippets/java';
import 'ace-builds/src-noconflict/snippets/golang';
import 'ace-builds/src-noconflict/snippets/c_cpp';
import 'ace-builds/src-noconflict/snippets/ruby';
import "ace-builds/src-noconflict/ext-language_tools";

import { io } from 'socket.io-client';
const socket = io('http://172.17.21.18:3000');
const userId = Math.ceil(Math.random()*100);
console.log(userId);

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  controls: {
    marginBottom: '20px',
    display: 'flex',
    gap: '20px',
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginLeft: '10px',
  },
  label: {
    marginBottom: '5px',
    display: 'block',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  }
};

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('github');
  const [remoteCursors, setRemoteCursors] = useState({});
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const editorRef = useRef(null);







  useEffect(() => {
    const randomUsername = `User_${Math.floor(Math.random() * 1000)}`;
    setUsername(randomUsername);
    setUserId(socket.id);

    socket.emit("new-user", { userId: socket.id, username: randomUsername });

    socket.on("cursor-update", ({ userId, position, username }) => {
      console.log(username);
      setRemoteCursors((prev) => ({
        ...prev,
        [userId]: { position, username },
      }));
      highlightCursor(userId, position, username);

    });

    return () => {
      socket.off("cursor-update");
    };
  }, []);
  const handleCursorChange = (selection) => {
    if (!editorRef.current) return;
    const cursorPos = selection.getCursor();
    socket.emit("cursor-update", { userId: socket.id, position: cursorPos, username });
  };

  const highlightCursor = (userId, position, username) => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const session = editor.getSession();

    // Remove previous marker for this user
    const markers = session.getMarkers(false);
    Object.keys(markers).forEach((markerId) => {
      if (markers[markerId].clazz === `cursor-marker-${userId}`) {
        session.removeMarker(markerId);
      }
    });

    // Create cursor marker
    const Range = window.ace.require("ace/range").Range;
    const range = new Range(position.row, position.column, position.row, position.column + 1);
    
    const markerId = session.addMarker(range, `cursor-marker-${userId}`, "text", true);
    
    // Display username above cursor
    const scroller = document.querySelector(".ace_scroller");
    if (!scroller) return;

    let cursorLabel = document.querySelector(`.cursor-label-${userId}`);
    if (!cursorLabel) {
      cursorLabel = document.createElement("div");
      cursorLabel.className = `cursor-label cursor-label-${userId}`;
      scroller.appendChild(cursorLabel);
    }

    cursorLabel.innerText = username;
    cursorLabel.style.position = "absolute";
    cursorLabel.style.left = `${position.column * 7.5}px`; // Adjust for font size
    cursorLabel.style.top = `${position.row * 16 - 10}px`; // Adjust height

    // Remove username label after a few seconds
    setTimeout(() => {
      if (cursorLabel) cursorLabel.remove();
    }, 3000);
  };







  // useEffect(() => {
  //   socket.on("cursor-update", ({ userId, position }) => {
  //     setRemoteCursors((prev) => ({ ...prev, [userId]: position }));
  //     highlightCursor(userId, position);
  //   });

  //   return () => {
  //     socket.off("cursor-update");
  //   };
  // }, []);

  // const handleCursorChange = (selection) => {
  //   if (editorRef.current) {
  //     const cursor = editorRef.current.editor.getCursorPosition();
  //     // console.log(cursor);
  //     // socket.emit('cursor-update', cursor);
  //   }
  //   const cursorPos = selection.getCursor();
  //   socket.emit("cursor-update", { userId: socket.id, position: cursorPos });
  // };

  // const highlightCursor = (userId, position) => {
  //   if (!editorRef.current) return;
  //   const editor = editorRef.current.editor;

  //   // Remove existing marker if exists
  //   editor.session.getMarkers(true) &&
  //     Object.values(editor.session.getMarkers()).forEach((marker) => {
  //       if (marker.className === `cursor-marker-${userId}`) {
  //         editor.session.removeMarker(marker.id);
  //       }
  //     });

  //   // Add new cursor marker
  //   const range = new window.ace.require("ace/range").Range(
  //     position.row,
  //     position.column,
  //     position.row,
  //     position.column + 1
  //   );

  //   editor.session.addMarker(
  //     range,
  //     `cursor-marker-${userId}`,
  //     "text",
  //     true
  //   );
  // }



  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', mode: 'javascript' },
    { value: 'python', label: 'Python', mode: 'python' },
    { value: 'java', label: 'Java', mode: 'java' },
    { value: 'golang', label: 'Go', mode: 'golang' },
    { value: 'c_cpp', label: 'C/C++', mode: 'c_cpp' },
    { value: 'ruby', label: 'Ruby', mode: 'ruby' }
  ];

  const themeOptions = [
    { value: 'github', label: 'Light' },
    { value: 'monokai', label: 'Dark' },
    { value: 'terminal', label: 'Terminal' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'twilight', label: 'Twilight' }
  ];

  // const getDefaultCode = (lang) => {
  //   const examples = {
  //     javascript: '// JavaScript Example\nconsole.log("Hello World!");',
  //     python: '# Python Example\nprint("Hello World!")',
  //     java: '// Java Example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
  //     golang: '// Go Example\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World!")\n}',
  //     c_cpp: '// C++ Example\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}',
  //     ruby: '# Ruby Example\nputs "Hello World!"'
  //   };
  //   return examples[lang] || '';
  // };

  // useEffect(() => {
  //   fetchUserProfile();
  // }, []);

  // const fetchUserProfile = async () => {
  //   try {
  //     const email = "Ponkavi14256@gmail.com"; 
  
  //     const response = await fetch("http://localhost:8080/CodeFusionUI/ProfileServlet ", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: `email=${encodeURIComponent(email)}`,
  //     });
  //   }

  //   // Socket event listeners
  //   // socket.on('code-update', (newCode) => {
  //   //   if (newCode && newCode.code !== code) {
  //   //     setCode(newCode.code);
  //   //   }
  //   // });


  //   return () => {
  //     socket.off('code-update');
  //   };
  // }, [language]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
  };

  // const handleCursorChange = (selection) => {
    
  // };

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    if (editorRef.current) {
      const editor = editorRef.current.editor;
      const cursor = editor.getCursorPosition();
      console.log(cursor);
      
      socket.emit('code-update', { code: newCode, cursor:cursor ,userId});
    }
  };

  const runCode = () => {
    socket.emit('output', { code, language });
  };

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



