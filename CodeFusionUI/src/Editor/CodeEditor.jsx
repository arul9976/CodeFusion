import React, { useCallback, useEffect, useRef, useState } from 'react';
// import FileExplorer from './FileExpo/FileExplorer';

import AceEditor from 'react-ace';
import Term from '../Terminal';
import ace from 'ace-builds';
import * as Y from 'yjs';
import _ from 'lodash';


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
import { useDispatch, useSelector } from 'react-redux';
import { setCode } from '../Redux/editorSlice';

// const socket = io('http://172.17.22.225:3000');

const socket = io('http://localhost:3000');

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

const CodeEditor = () => {
  const dispatch = useDispatch();
  const code = useSelector((state) => state.editor.code);
  // const cursor = useSelector((state) => state.editor.cursor);

  const errRef = useRef(null);
  const connectRef = useRef(false);

  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('github');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);

  const editorRef = useRef(null);

  const ydoc = new Y.Doc();
  const yText = ydoc.getText('editor');

  const isLocalChangeRef = useRef(false);
  const cursorRef = useRef({ row: 0, column: 0 });

  const updated = useRef(false);
  const pendingDeltas = useRef([]);

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

  let isObserved = false;

  const applyYjsDeltaToEditor = (yDelta) => {
    const editor = editorRef.current.editor;
    console.log(yDelta);
    if (code !== yDelta.lines) {
      editor.session.getDocument().applyDeltas(yDelta);
      console.log("Binded...");
    }
  };

  const joinRoom = (roomId) => {
    if (currentRoom) {
      socket.emit("leave-room", currentRoom);
    }
    console.log(roomId);
    socket.emit("join-room", roomId);
    setCurrentRoom(roomId);
  };

  const leaveRoom = () => {
    if (currentRoom) {
      socket.emit("leave-room", currentRoom);
      setCurrentRoom(null);
    }
  };



  const sendUpdate = useCallback(
    _.debounce(() => {
      if (pendingDeltas.current.length > 0) {
        socket.emit('codeUpdate', pendingDeltas.current);
        pendingDeltas.current = [];
      }
    }, 500), []
  );

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    dispatch(setCode(getDefaultCode(newLang)));
  };

  const handleCursorChange = () => {
    if (editorRef.current) {
      const cur = editorRef.current.editor.getCursorPosition();
      cursorRef.current = cur;

    }
  };

  const handlerRef = useRef();

  const handleCodeChange = useCallback((delta) => {

    const { start, end, lines, action } = delta;

    const session = editorRef.current.editor.getSession();

    const startIdx = session.getDocument().positionToIndex(start);
    const endIdx = session.getDocument().positionToIndex(end);
    const changedTxt = lines.join("\n");

    console.log(updated.current, yText.toString());

    if (action == 'insert') {
      yText.applyDelta([
        { retain: startIdx },
        { insert: changedTxt }
      ]);
    }

    else if (action == 'remove') {
      yText.applyDelta([
        { retain: startIdx },
        { delete: changedTxt.length }
      ]);
    }

    if (!updated.current) {
      pendingDeltas.current.push({
        yDelta: { start: startIdx, end: endIdx, lines: changedTxt, action: action },
        aceDelta: delta, cursor: cursorRef.current
      });

      sendUpdate();
    }
    else
      updated.current = false;

    console.log("client to --> serv", yText.toString());

  }, []);


  const runCode = () => {
    socket.emit('output', { code, language });
  };


  useEffect(() => {
    handlerRef.current = handleCodeChange;
  }, [handleCodeChange]);

  useEffect(() => {
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

      const stableChangeHandler = (e) => {
        if (handlerRef.current) {
          handlerRef.current(e);
        }
      };


      editor.on('change', stableChangeHandler);

      return () => {
        editor.off('change', stableChangeHandler);
      };
    }
  }, []);


  useEffect(() => {
    return () => {
      sendUpdate.cancel();
    };
  }, [sendUpdate]);


  useEffect(() => {

    socket.on('connect', () => {
      connectRef.current = true;
      errRef.current = null;
      console.log("You are connected");

    });



    socket.on('disconnect', () => {
      connectRef.current = false;
      console.log('Disconnected from server');
    });

    socket.on('updatedCode', (data) => {

      const { cursors, aceDelta } = data;
      const { start, end, lines } = aceDelta;

      if (lines !== code) {
        updated.current = true;
        applyYjsDeltaToEditor([aceDelta]);
      }

      console.log("serv to --> cli " + yText.toString());

      console.log(`Update applied for client ${socket.id}`);


    });

    socket.on('error', (err) => {
      errRef.current = err.message || 'An error occurred';
      console.error('Socket error:', err);
    });

    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });

    socket.on('reconnect_error', (err) => {
      console.error('Reconnection failed:', err);
    });

    socket.on('reconnect_failed', () => {
      console.error('Reconnection failed after multiple attempts');
    });

    const syncHandler = (data) => {
      console.log("syncing");

      const { update } = data;
      if (yText) {
        updated.current = true;
        applyYjsDeltaToEditor([
          {
            action: 'insert',
            start: { row: 0, column: 0 },
            end: { row: 0, column: 0 },
            lines: (update || getDefaultCode(language)).split("\n"),
          },
        ]);


      }
    };

    socket.on('sync', syncHandler);


    return () => {
      socket.off('updatedCode');
      if (isObserved) {
        yText.unobserve(handler);
        isObserved = false;
      }
      socket.off('sync', syncHandler);
      // socket.off('code-change', handleServerData);
      // socket.disconnect();
    };

  }, []);


  return (
    <>
    <div className= {`app ${connectRef.current ? "connected" : "disconnected"}`
}>
  <header className="header" >
    <div className="container" >
      <h1 className="logo" > CodeCollab { connectRef.current ? "connected" : "disconnected" } </h1>
        < nav >
        <button
                className="btn nav-btn"
onClick = {() => joinRoom("room1")}
              >
  Join Room 1
    </button>
    < button
className = "btn nav-btn"
onClick = {() => joinRoom("room2")}
              >
  Join Room 2
    </button>
{
  currentRoom && (
    <button className="btn leave-btn" onClick = { leaveRoom } >
      Leave Room
        </button>
              )
}
</nav>
  </div>
  </header>

  < main className = "main-content" >
    <div className="container" >
      <div className="editor-container" >
        <h2>Collaborative Code Editor </h2>
          < div style = { styles.container } >
            <div style={ styles.controls }>
              <div>
              <label style={ styles.label }> Language: </label>
                < select
value = { language }
onChange = { handleLanguageChange }
style = { styles.select }
  >
{
  languageOptions.map(option => (
    <option key= { option.value } value = { option.value } >
    { option.label }
    </option>
  ))
}
  </select>
  </div>

  < div >
  <label style={ styles.label }> Theme: </label>
    < select
value = { theme }
onChange = {(e) => setTheme(e.target.value)}
style = { styles.select }
  >
{
  themeOptions.map(option => (
    <option key= { option.value } value = { option.value } >
    { option.label }
    </option>
  ))
}
  </select>
  </div>
  </div>

  < AceEditor
ref = { editorRef }
mode = { languageOptions.find(l => l.value === language)?.mode }
theme = { theme }
name = "code-editor"
value = { code }
width = "1200px"
height = "400px"
fontSize = { 14}
onCursorChange = { handleCursorChange }
showPrintMargin = { true}
showGutter = { true}
highlightActiveLine = { true}
setOptions = {{
  enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
      enableSnippets: true,
        showLineNumbers: true,
          tabSize: 2,
                  }}
                />

  < button onClick = { runCode } style = { styles.button } >
    Run Code
      </button>

      < Term socket = { socket } />

        </div>
        </div>
        < div className = "rooms-list" >
          <h3>Available Rooms </h3>
            <ul>
{
  rooms.map((room, index) => (
    <li key= { index } >
    <button
                      className="room-btn"
                      onClick = {() => joinRoom(room)}
disabled = { currentRoom === room}
                    >
  { room }
  </button>
  </li>
                ))}
</ul>
  </div>
  </div>
  </main>
  </div>
  </>

  );

};

export default CodeEditor;