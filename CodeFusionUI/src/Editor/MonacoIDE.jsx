

import React, { useContext, useEffect, useRef, useState } from 'react';
import { MonacoBinding } from 'y-monaco';
import Editor from '@monaco-editor/react';

import { ClientContext } from './ClientContext';
import { getFileMode } from '../utils/GetIcon';
import { getFileContent } from '../utils/Fetch';
import { setCode, setLang } from '../Redux/editorSlice';
import { debounce } from 'lodash';
const MonacoIDE = ({ activeFile }) => {

  const { initAndGetProvider, getYtext, editorsRef, bindings, dispatch, language } = useContext(ClientContext);

  const editorRef = useRef(null);
  const currFile = useRef(null);
  const monacoRef = useRef(null);


  const initiateFile = (file) => {
    currFile.current = file;
    console.log(file);

    if (!editorRef.current) {
      console.log("Editor is not available");
      return;

    }

    editorsRef.current.get(file.id);

    const provider = initAndGetProvider(file.url);

    console.log("Commit");
    const model = editorRef.current.getModel();

    getFileContent(file.url).then((res) => {
      console.log(res);
      model.setValue(res);

    })

    // provider.on("sync", (isSynced) => {

    //   const model = editorRef.current.getModel();

    //   console.log("synced Initialized");

    //   if (isSynced) {
    //     console.log("synced");

    //   }
    //   console.log("Synced with server:", isSynced);
    // });
  }

  function handleEditorDidMount(editor, monaco, file) {
    console.log(file);
    currFile.current = file;
    if (!file) return;
    monacoRef.current = monaco;
    editorRef.current = editor;
    editorsRef.current.set(file.id, editor);
    initiateFile(file);

    // getFileContent(file.url).then((res) => {
    //   // yText.insert(0, res);
    // editorRef.current.getModel().setValue(res);
    // })
  }

  const handleChange = (value) => {
    console.log(value);
    dispatch(setCode(value));
  }



  useEffect(() => {
    console.log("Runned");

    const lan = getFileMode(activeFile.name);
    dispatch(setLang(lan))
    console.log(language);

    if (editorRef.current && currFile.current.id !== activeFile.id) {
      console.log(activeFile);

      monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), lan)
      // initiateFile(activeFile);
      console.log("Initiated");

    }
  })

  const beforeMount = (monaco) => {
    monaco.editor.defineTheme('modernDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: '9ca3af' },
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '93c5fd' },
        { token: 'string', foreground: '86efac' },
        { token: 'number', foreground: 'fca5a5' },
        { token: 'regexp', foreground: 'fdba74' },
        { token: 'function', foreground: 'c4b5fd' },
        { token: 'variable', foreground: 'd1d5db' },
        { token: 'variable.predefined', foreground: '93c5fd' },
        { token: 'constant', foreground: 'f9a8d4' },
        { token: 'type', foreground: '93c5fd' },
        { token: 'delimiter', foreground: '6b7280' },
        { token: 'delimiter.bracket', foreground: '9ca3af' },
        { token: 'tag', foreground: '93c5fd' },
        { token: 'attribute.name', foreground: 'c4b5fd' },
        { token: 'attribute.value', foreground: '86efac' },
        { token: 'class', foreground: 'c4b5fd', fontStyle: 'bold' },
        { token: 'interface', foreground: '93c5fd', fontStyle: 'bold' }
      ],
      colors: {
        'editor.background': '#1a1d24',
        'editor.foreground': '#9ca3af',
        'editor.lineHighlightBackground': '#2d323c',
        'editor.selectionBackground': '#3b4252',
        'editor.inactiveSelectionBackground': '#2e3440',
        'editorWidget.background': '#1f2937',
        'editorWidget.border': '#374151',
        'editorSuggestWidget.background': '#1f2937',
        'editorSuggestWidget.border': '#374151',
        'editorSuggestWidget.selectedBackground': '#3b4252',
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#374151',
        'scrollbarSlider.hoverBackground': '#4b5563',
        'scrollbarSlider.activeBackground': '#6b7280',
        'activityBar.background': '#1a1d24',
        'activityBar.foreground': '#9ca3af',
        'sideBar.background': '#1a1d24',
        'sideBar.foreground': '#9ca3af',
        'editorLineNumber.foreground': '#4b5563',
        'editorLineNumber.activeForeground': '#9ca3af',
        'editorGutter.background': '#1a1d24',
        'editorIndentGuide.background': '#2d323c',
        'editorIndentGuide.activeBackground': '#4b5563',
        'editorBracketMatch.border': '#4f46e5',
        'editorBracketMatch.background': '#3b4252'
      }
    });
  };

  return (

    <div style={{
      height: '100%',
      width: '100%',
    }}>
      <Editor
        heigh={"100%"}
        width={"100%"}
        defaultLanguage={getFileMode(activeFile.name)}
        theme="modernDark"
        beforeMount={beforeMount}
        onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, activeFile)}
        onChange={handleChange}
        options={{
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          fontLigatures: true,
          lineHeight: 1.5,
          letterSpacing: 0.5,
          padding: { top: 16, bottom: 16 },
          minimap: {
            enabled: false
          },
          scrollbar: {
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8
          },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          renderLineHighlight: 'all',
          roundedSelection: true,
          wordWrap: 'on',
          wordWrapColumn: 100,
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          links: true,
          mouseWheelZoom: true,
          suggest: {
            insertMode: 'replace',
            snippetsPreventQuickSuggestions: false,
          },
          bracketPairColorization: {
            enabled: true,
          }
        }}
      />
    </div >

  )






};

export default MonacoIDE;