// import React, { useState, useEffect, useRef } from 'react';
// import "./App.css";
// // import CodeMirror from '@uiw/react-codemirror';

// import AceEditor from "react-ace";
// import * as ace from 'ace-builds';




// import "ace-builds/webpack-resolver"; // To resolve Ace dependency
// import 'ace-builds/src-noconflict/ext-language_tools';

// // import "ace-builds/src-noconflict/theme-monokai"; // Monokai is a popular dark theme
// // import "ace-builds/src-noconflict/mode-javascript"; // You can replace it with the language of your choice (like "mode-python")
// import "ace-builds/src-noconflict/keybinding-vim";
// import 'ace-builds/src-noconflict/ext-emmet';
// import 'ace-builds/src-noconflict/ext-beautify';
// import 'ace-builds/src-noconflict/ext-code_lens';
// import 'ace-builds/src-noconflict/ext-command_bar';
// import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite';

// import 'brace/mode/javascript';
// import 'brace/theme/github';
// import 'brace/theme/monokai';
// import 'brace/ext/language_tools';

// import { useDispatch, useSelector } from 'react-redux';

// import { io } from 'socket.io-client';
// import { setCode } from './Redux/editorSlice';

// const socket = io('http://localhost:3000');

// const App = () => {
//   // const [code, setCode] = useState('');
//   const [cursor, setCursor] = useState({ line: 0, ch: 0 });
//   const [otherCursors, setOtherCursors] = useState({});
//   const [theme, setTheme] = useState('vs-light');

//   const editorRef = useRef(null);

//   const dispatch = useDispatch();
//   const code = useSelector((state) => state.editor.code);



//   const [language, setLanguage] = useState('javascript');

//   // const handleLanguageChange = (event) => {
//   //   setLanguage(event.target.value);
//   //   console.log(language);

//   // };


//   const handleCodeChange = (value, event) => {
//     console.log(value, cursor);

//     if (value !== undefined) {
//       dispatch(setCode(value));
//       socket.emit('code-update', { code: value, cursor: cursor });
//     }

//   };



//   const handleCursorChange = (selection) => {
//     const { row, column } = selection.getCursor();
//     console.log(row, column);

//     setCursor({ row, column });
//     // socket.emit('cursor-update', { row, column });
//   };

//   // const languageModes = {
//   //   python,
//   //   javascript,
//   //   java,
//   //   go,
//   //   // ruby,
//   // };

//   // const extensions = [
//   //   basicSetup,
//   //   languageModes[language]() // Dynamically set the language mode
//   // ];


//   const runCode = () => {
//     if (code.length > 0) {
//       socket.emit('output', { code, language });
//     }
//   };


//   useEffect(() => {
//     // const editor = editorRef.current;
//     // if (editor) {
//     //   // Listen for cursor activity using the CodeMirror API directly
//     //   const editorInstance = editor.view;
//     //   const cursorActivityHandler = () => {
//     //     const cursor = editorInstance.state.selection.main.head; // Get the cursor position
//     //     console.log('Cursor position:', cursor);
//     //     setCursor(cursor); // Update the cursor state in your React component
//     //   };

//     //   // Bind the cursor activity event
//     //   editorInstance.setProps({
//     //     handleDOMEvents: {
//     //       cursorActivity: cursorActivityHandler, // Trigger when cursor activity happens
//     //     }
//     //   });
//     // }

//     if (typeof ace !== 'undefined') {
//       ace.config.set('workerPath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/workers');
//     }

//     // ace.config.set('workerPath', '/path/to/ace-builds/src-min-noconflict');
//     // const edi = ace.edit('code-editor');
//     // edi.setTheme('ace/theme/github');
//     // edi.session.setMode('ace/mode/python');

//     socket.on('code-update', (newCode) => {
//       // console.log("--> " + newCode);
//       if (newCode != null) {
//         dispatch(setCode(newCode.code));
//         setCursor(newCode.cursor)
//       }
//     });


//     const editor = editorRef.current.editor;
//     editor.setOptions({
//       enableSnippets: true,
//       enableBasicAutocompletion: true,
//       enableLiveAutocompletion: true,
//     });



//     // socket.on('cursor-position', (position) => {
//     //   setCursor(position);
//     // });

//     // return () => {
//     //   const editor = editorRef.current;
//     //   if (editor) {
//     //     const editorInstance = editor.view;
//     //     editorInstance.setProps({
//     //       handleDOMEvents: {} // Remove the event listener during cleanup
//     //     });
//     //   }
//     // };

//   }, []);


//   return (

//     <>
//       <div style={{ width: '1200px', margin: '20px auto', display: 'grid', gap: '1em' }}>
//         <h2>Live Python Code Editor</h2>

//         <div style={{ width: '200px', height: '60px' }}>
//           <label>Select Language: </label>
//           <select onChange={(e) => setLanguage(e.target.value)} value={language}>
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="java">Java</option>
//             <option value="go">Go</option>
//             <option value="c">C</option>
//             <option value="cpp">C++</option>
//             <option value="ruby">Ruby</option>
//           </select>

//           <br />

//           <label>Select Theme: </label>
//           <select onChange={(e) => setTheme(e.target.value)}>
//             <option value="vs-light">Light</option>
//             <option value="vs-dark">Dark</option>
//           </select>
//         </div>

//         {/* <CodeMirror
//           ref={editorRef}
//           value={code}
//           onChange={handleCodeChange}
//           onEditorViewUpdate={handleEditorChange}
//           extensions={extensions}
//           height="400px"
//           theme={oneDark}
//           style={{ width: '100%', display: 'block', textAlign: 'start' }}
//         />  */}

//         <AceEditor
//         ref={editorRef}
//           placeholder="Placeholder Text"
//           mode="javascript"
//           theme="terminal"
//           name="blah2"
//           // onLoad={handleCodeChange}
//           onChange={handleCodeChange}
//           fontSize={14}
//           width='100%'
//           lineHeight={19}
//           showPrintMargin={true}
//           showGutter={true}
//           highlightActiveLine={true}
//           value={code}
//           setOptions={{
//             enableBasicAutocompletion: true,
//             enableLiveAutocompletion: true,
//             enableSnippets: true,
//             enableMobileMenu: true,
//             showLineNumbers: true,
//             tabSize: 2,
//           }} />

//         <button onClick={runCode}>Run Code</button>
//       </div>


// <Term socket={socket} />
//     </>

//   );
// };

// export default App;



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

import { io } from 'socket.io-client';
const socket = io('http://172.17.22.225:3000');

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
  const editorRef = useRef(null);

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

  const getDefaultCode = (lang) => {
    const examples = {
      javascript: '// JavaScript Example\nconsole.log("Hello World!");',
      python: '# Python Example\nprint("Hello World!")',
      java: '// Java Example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
      golang: '// Go Example\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World!")\n}',
      c_cpp: '// C++ Example\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}',
      ruby: '# Ruby Example\nputs "Hello World!"'
    };
    return examples[lang] || '';
  };

  useEffect(() => {
    setCode(getDefaultCode(language));

    if (editorRef.current) {
      const editor = editorRef.current.editor;
      editor.setOptions({
        useWorker: false,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      });
    }

    // Socket event listeners
    socket.on('code-update', (newCode) => {
      if (newCode && newCode.code !== code) {
        setCode(newCode.code);
      }
    });


    return () => {
      socket.off('code-update');
    };
  }, [language]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
  };

  const handleCursorChange = (selection) => {
    if (editorRef.current) {
      const cursor = editorRef.current.editor.getCursorPosition();
      // socket.emit('cursor-update', cursor);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);

    if (editorRef.current) {
      const editor = editorRef.current.editor;
      const cursor = editor.getCursorPosition();
      console.log(cursor);
      
      socket.emit('code-update', { code: newCode, cursor:cursor });
    }
  };

  const runCode = () => {
    socket.emit('output', { code, language });
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <div>
          <label style={styles.label}>Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={styles.select}
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={styles.select}
          >
            {themeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AceEditor
        ref={editorRef}
        mode={languageOptions.find(l => l.value === language)?.mode}
        theme={theme}
        name="code-editor"
        value={code}
        onChange={handleCodeChange}
        onCursorChange={handleCursorChange}
        width="1200px"
        height="400px"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />

      <button onClick={runCode} style={styles.button}>
        Run Code
      </button>

      <Term socket={socket} />

    </div>
  );
};

export default App;