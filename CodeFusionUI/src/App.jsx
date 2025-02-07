import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';  // Default import for CodeMirror
import { python } from '@codemirror/lang-python';  // Import Python language support
import { basicSetup } from 'codemirror';  // Basic setup for CodeMirror editor
import { oneDark } from '@codemirror/theme-one-dark';  // Modern Dark Theme
import { io } from 'socket.io-client'; // Import Socket.IO client

const socket = io('http://172.17.22.225:3000');  // Connect to the WebSocket server

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [cursor, setCursor] = useState({ line: 0, ch: 0 });  // Track cursor position
  const editorRef = useRef(null);

  useEffect(() => {
    // Listen for code updates from other clients
    socket.on('code-update', (newCode) => {
      console.log("--> " + newCode);
      if (newCode != null)
        setCode(newCode);
    });

    // Listen for cursor position updates from other clients
    socket.on('cursor-position', (position) => {
      setCursor(position);
    });

    return () => {
      // Cleanup on component unmount
      socket.off('code-update');
      socket.off('cursor-position');
    };
  }, []);

  const handleCodeChange = (editor, data, value) => {
    console.log('handleCodeChange called, value:', editor, data);  // Log the value of code change
    console.log(editor);

    if (editor !== undefined) {
      setCode(editor);  // Update the state with the new editor
      socket.emit('code-update', editor);  // Send the new code to the server
    }
  };


  const handleCursorChange = (editor, changeObj) => {
    const cursorPosition = editor.getCursor();
    setCursor(cursorPosition);
    // Send cursor position to the server
    socket.emit('cursor-position', cursorPosition);
  };

  return (
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
      <button onClick={() => console.log(code)}>Run Code</button>
    </div>
  );
};

export default CodeEditor;
