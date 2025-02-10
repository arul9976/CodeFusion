import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from 'codemirror';

import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { go } from '@codemirror/lang-go';
import { ruby } from '@codemirror/lang-ruby';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const editorRef = useRef(null);

  const handleCodeChange = (value) => {
    setCode(value);
  };


  const [language, setLanguage] = useState('javascript'); // Default language is JavaScript

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const extensions = [
    basicSetup,
    languageModes[language]() // Dynamically set the language mode
  ];

  const languageModes = {
    python,
    javascript,
    java,
    go,
    ruby,
  };

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.view;
      editor.on('cursorActivity', () => {
        const cursor = editorInstance.getCursor();
        console.log('Cursor position:', cursor);
      });
    }
  }, []);


  return (
    <div style={{ width: '1200px', margin: '0 auto' }}>
      <h2>Python Code Editor</h2>

      <div style={{ width: '60px', height: '50px' }}>
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
        extensions={extensions}
        height="80dvh"
        theme="dark"
        style={{ width: '100%' }}
      />
      <button onClick={() => console.log(code)}>Run Code</button>
    </div>
  );
};

export default CodeEditor;
