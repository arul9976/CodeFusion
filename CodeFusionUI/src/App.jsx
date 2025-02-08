import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror'; 
import { python } from '@codemirror/lang-python';
import { basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { io } from 'socket.io-client';
import { Output } from './Output';
import axios from 'axios';
import Term from './Terminal';

const socket = io('http://localhost:3000');  // Connect to the WebSocket server

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [out, setOut] = useState('');
  const [cursor, setCursor] = useState({ line: 0, ch: 0 });  // Track cursor position
  const editorRef = useRef(null);

  useEffect(() => {
    socket.on('code-update', (newCode) => {
      console.log("--> " + newCode);
      if (newCode != null)
        setCode(newCode);
    });

    socket.on('cursor-position', (position) => {
      setCursor(position);
    });

    socket.on('output', (output) => {
      setOut(output);
    });

    return () => {
      socket.off('code-update');
      socket.off('cursor-position');
    };
  }, []);

  const handleCodeChange = (editor, data, value) => {
    console.log('handleCodeChange called, value:', editor, data);
    console.log(editor);

    if (editor !== undefined) {
      setCode(editor);
      socket.emit('code-update', editor);
    }
  };


  const handleCursorChange = (editor, changeObj) => {
    const cursorPosition = editor.getCursor();
    setCursor(cursorPosition);
    socket.emit('cursor-position', cursorPosition);
  };

  const runCode = () => {
    if (code.length > 0) {
      socket.emit('output', code);
    }
  };

  return (

    <>
      <div style={{ width: '1200px', margin: '0 auto' }}>
        <h2>Live Python Code Editor</h2>
        <CodeMirror
          ref={editorRef}
          value={code}
          onChange={handleCodeChange}
          onCursorActivity={(editor) => handleCursorChange(editor)}
          extensions={[python(), basicSetup]}
          height="400px"
          theme={oneDark}
          style={{ width: '100%' }}
        />
        <button onClick={runCode}>Run Code</button>
      </div>

      <Output output={out} />

      <Term />
    </>

  );
};

export default CodeEditor;
