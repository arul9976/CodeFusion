import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
// import FileExplorer from './FileExpo/FileExplorer';

import AceEditor from 'react-ace';
import Term from '../Terminal/Terminal';
import ace from 'ace-builds';
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
import { getFileMode } from '../utils/GetIcon';
import { ClientContext } from './ClientContext';
import { YEvent } from 'yjs';

// const socket.current = io('http://172.17.22.225:3000');

// const socket.current = io('http://localhost:3000');

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

  const { socket, code, language, dispatch, activeFile, editorTheme, yText, isInit, bindToYtext } = useContext(ClientContext);

  // const cursor = useSelector((state) => state.editor.cursor);

  const errRef = useRef(null);
  const connectRef = useRef(false);

  // const [theme, setTheme] = useState('github');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);

  const editorRef = useRef(null);



  const isLocalChangeRef = useRef(false);
  const cursorRef = useRef({ row: 0, column: 0 });

  const pendingDeltas = useRef([]);
  const pendingDeltasLines = useRef([]);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', mode: 'javascript' },
    { value: 'python', label: 'Python', mode: 'python' },
    { value: 'java', label: 'Java', mode: 'java' },
    { value: 'golang', label: 'Go', mode: 'golang' },
    { value: 'c_cpp', label: 'C/C++', mode: 'c_cpp' },
    { value: 'ruby', label: 'Ruby', mode: 'ruby' }
  ];

  // const themeOptions = [
  //   { value: 'github', label: 'Light' },
  //   { value: 'monokai', label: 'Dark' },
  //   { value: 'terminal', label: 'Terminal' },
  //   { value: 'solarized_dark', label: 'Solarized Dark' }
  // ];

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
    // console.log(yDelta);
    if (code !== yDelta.lines) {
      editor.session.getDocument().applyDeltas(yDelta);
      console.log("Binded...");
    }
  };

  // const joinRoom = (roomId) => {
  //   if (currentRoom) {
  //     socket.current.emit("leave-room", currentRoom);
  //   }
  //   console.log(roomId);
  //   socket.current.emit("join-room", roomId);
  //   setCurrentRoom(roomId);
  // };

  // const leaveRoom = () => {
  //   if (currentRoom) {
  //     socket.current.emit("leave-room", currentRoom);
  //     setCurrentRoom(null);
  //   }
  // };


  const sendUpdateLine = useCallback(
    _.debounce(() => {
      if (pendingDeltasLines.current.length > 0) {
        socket.current.emit('codeUpdate', { pendingDeltas: pendingDeltasLines.current, path: activeFile.url });
        pendingDeltasLines.current = [];
      }
    }, 1400), []
  );

  const sendUpdate = useCallback(
    _.debounce(() => {
      if (pendingDeltas.current.length > 0) {
        socket.current.emit('codeUpdate', { pendingDeltas: pendingDeltas.current, path: activeFile.url });
        pendingDeltas.current = [];
      }
    }, 800), []
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

    console.log(isInit.current);

    if (isInit.current > 0) {
      console.log("Ended................................................................");
      isInit.current--;
      return;
    }

    const { start, end, lines, action } = delta;

    const session = editorRef.current.editor.getSession();
    // console.log(delta);

    const startIdx = session.getDocument().positionToIndex(start);
    const endIdx = session.getDocument().positionToIndex(end);
    const changedTxt = lines.join("\n");
    const yDelta = { start: startIdx, end: endIdx, lines: changedTxt, action: action, totalLines: yText.toString().split("\n").length };


    if (bindToYtext(yDelta)) {
      if (changedTxt == '\n') {
        pendingDeltasLines.current.push({
          yDelta,
          aceDelta: delta, cursor: cursorRef.current
        });
        console.log("Pending Line Deltas Added", yText.toString());
        sendUpdateLine();
        return;
      }
      console.log("Pending Deltas Added", yText.toString());
      // yDelta['totalLines'] = yText.toString().split("\n").length;
      pendingDeltas.current.push({
        yDelta,
        aceDelta: delta, cursor: cursorRef.current
      });

      sendUpdate();

    }





    // console.log("client to --> serv", yText.toString());

  }, []);


  const runCode = () => {
    socket.current.emit('output', { code, language });
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
      // console.log("Editor Setter");


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

    // socket.current.on('connect', () => {
    //   connectRef.current = true;
    //   errRef.current = null;
    //   console.log("You are connected");

    // });



    // socket.current.on('disconnect', () => {
    //   connectRef.current = false;
    //   console.log('Disconnected from server');
    // });

    socket.current.on('updatedCode', (data) => {
      // console.log(data);

      const { pendingDeltas, path } = data;
      if (path === activeFile.file) return;

      let aceDeltas = [];
      const rows = editorRef.current.editor.getSession().getLength();
      console.log("Rows: " + rows);
      console.log(pendingDeltasLines.current);
      
      let updatedLine = pendingDeltasLines.current.at(-1)?.aceDelta.start.row || 25;
      if (pendingDeltas.every(d => {
        let cLine = rows - d.yDelta.totalLines;
        let startRow = d.aceDelta.start.row;
        console.log("Updated and startRow: " + updatedLine, startRow);

        if (updatedLine < startRow) {
          console.log("cline: " + cLine);
          console.log("aceRowCol Before --> " + d.aceDelta.start.row, d.aceDelta.end.row);
          d.aceDelta['start']['row'] += cLine;
          d.aceDelta['end']['row'] += cLine;
          console.log("aceRowCol After --> " + d.aceDelta.start.row, d.aceDelta.end.row);

        } else console.log("Updated Line is Greater");


        aceDeltas.push(d.aceDelta);
        return bindToYtext(d.yDelta);
      })) {
        console.log(aceDeltas);
        // aceDeltas = aceDeltas.map(d => {
        //   let curr = d.start.row;
        //   console.log("Curr Row Len : " + curr);
        //   d.start.row = curr != rows ? rows : curr;
        //   return d;
        // })
        isInit.current = aceDeltas.length;
        console.log("EveryThing True", aceDeltas);
        applyYjsDeltaToEditor(aceDeltas);
      } else {
        console.log("Not EveryThing True");

      }

      // pendingDeltas.forEach(del => {
      //   const { cursors, aceDelta, yDelta } = del;
      //   const { start, end, lines } = aceDelta;
      //   // console.log(aceDelta, yDelta);

      //   if (lines !== code) {
      //     // updated.current = true;
      //     if (bindToYtext(yDelta)) {
      //       applyYjsDeltaToEditor([aceDelta]);
      //     }
      //     isInit.current = false;

      //   }
      // })
      isInit.current = false;;


      console.log("serv to --> cli\n" + yText.toString());
      console.log(`Update applied for client ${socket.current.id}`);


    });

    // socket.current.on('error', (err) => {
    //   errRef.current = err.message || 'An error occurred';
    //   console.error('Socket.current error:', err);
    // });

    // socket.current.on('reconnect_attempt', () => {
    //   console.log('Attempting to reconnect...');
    // });

    // socket.current.on('reconnect_error', (err) => {
    //   console.error('Reconnection failed:', err);
    // });

    // socket.current.on('reconnect_failed', () => {
    //   console.error('Reconnection failed after multiple attempts');
    // });

    // const syncHandler = (data) => {
    //   console.log("syncing");

    //   const { update } = data;
    //   if (yText) {
    //     updated.current = true;
    //     applyYjsDeltaToEditor([
    //       {
    //         action: 'insert',
    //         start: { row: 0, column: 0 },
    //         end: { row: 0, column: 0 },
    //         lines: (update || getDefaultCode(language)).split("\n"),
    //       },
    //     ]);


    //   }
    // };

    // socket.current.on('sync', syncHandler);


    return () => {
      socket.current.off('updatedCode');
      // if (isObserved) {
      //   yText.unobserve(handler);
      //   isObserved = false;
      // }
      // socket.current.off('sync', syncHandler);
      // socket.current.off('code-change', handleServerData);
      // socket.current.disconnect();
    };

  }, []);


  return (
    <>
      < AceEditor
        ref={editorRef}
        mode={getFileMode(activeFile.file)}
        theme={editorTheme}
        name="code-editor"
        value={code}
        width="100%"
        height="80%"
        fontSize={14}
        onCursorChange={handleCursorChange}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',

        }}


      />

      {/* <AceEditor
        mode={getFileMode(activeFile.name)}
        theme={editorTheme}
        onChange={handleFileChange}
        value={code}
        name="ace-editor"
        width="100%"
        height="100%"
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        }}
      /> */}
    </>
  );

};

export default CodeEditor;