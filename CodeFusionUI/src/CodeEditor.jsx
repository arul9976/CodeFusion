import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror'; // Default import for CodeMirror
import { python } from '@codemirror/lang-python'; // Import Python language support
import { basicSetup } from 'codemirror'; // Basic setup for CodeMirror editor

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const editorRef = useRef(null); // Create a ref to hold the editor instance

  // Handle changes in the editor
  const handleCodeChange = (value) => {
    setCode(value);
  };

  // Effect to set the cursor after the editor mounts
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.view;
      if (editor) {
        // Set the cursor position to line 0, character 0
        editor.setCursor({ line: 0, ch: 0 });
      }
    }
  }, []); // Empty dependency array means this runs once after the component mounts

  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <h2>Python Code Editor</h2>
      <CodeMirror
        ref={editorRef}
        value={code}
        onChange={handleCodeChange}
        extensions={[python(), basicSetup]} 
        height="80dvh"
        theme="dark" 
        style={{ width: '100%' }}
      />
      <button onClick={() => console.log(code)}>Run Code</button>
    </div>
  );
};

export default CodeEditor;
