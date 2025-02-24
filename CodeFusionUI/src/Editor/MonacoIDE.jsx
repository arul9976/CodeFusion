// import React, { useEffect, useRef, useState } from 'react';
// import * as Y from 'yjs';
// import { WebsocketProvider } from 'y-websocket';
// import { MonacoBinding } from 'y-monaco';
// import { Editor } from '@monaco-editor/react';
// import { Awareness } from 'y-protocols/awareness';
// import styled from 'styled-components';

// // Styled components
// const Container = styled.div`
//   height: 100vh;
//   display: flex;
//   flex-direction: column;
//   padding: 20px;
//   box-sizing: border-box;
// `;

// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 20px;
// `;

// const Controls = styled.div`
//   display: flex;
//   gap: 15px;
// `;

// const Select = styled.select`
//   padding: 8px 12px;
//   border-radius: 4px;
//   border: 1px solid #ccc;
//   background: white;
//   font-size: 14px;

//   &:focus {
//     outline: none;
//     border-color: #007bff;
//   }
// `;

// const Button = styled.button`
//   padding: 8px 16px;
//   background: #007bff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 14px;

//   &:hover {
//     background: #0056b3;
//   }

//   &:disabled {
//     background: #ccc;
//     cursor: not-allowed;
//   }
// `;

// const EditorContainer = styled.div`
//   flex-grow: 1;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   overflow: hidden;
// `;

// const CollaboratorsPanel = styled.div`
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   background: white;
//   padding: 10px;
//   border-radius: 4px;
//   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//   z-index: 1000;
// `;

// const Collaborator = styled.div`
//   display: flex;
//   align-items: center;
//   margin: 5px 0;

//   &::before {
//     content: '';
//     display: inline-block;
//     width: 8px;
//     height: 8px;
//     border-radius: 50%;
//     background: ${props => props.color};
//     margin-right: 8px;
//   }
// `;

// const Output = styled.div`
//   margin-top: 20px;
//   padding: 15px;
//   background: #f8f9fa;
//   border-radius: 4px;
//   font-family: monospace;
//   max-height: 200px;
//   overflow-y: auto;

//   pre {
//     margin: 0;
//     white-space: pre-wrap;
//     word-wrap: break-word;
//   }
// `;

// const CodeEditor = () => {
//   const [username, setUsername] = useState('');
//   const [language, setLanguage] = useState('javascript');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [collaborators, setCollaborators] = useState(new Map());
//   const editorRef = useRef(null);
//   const ydocRef = useRef(null);
//   const providerRef = useRef(null);
//   const bindingRef = useRef(null);

//   const languageOptions = [
//     { value: 'javascript', label: 'JavaScript' },
//     { value: 'python', label: 'Python' },
//     { value: 'java', label: 'Java' }
//   ];

//   useEffect(() => {
//     const initEditor = async () => {
//       // Initialize Yjs document
//       const ydoc = new Y.Doc();
//       ydocRef.current = ydoc;

//       // Get or create username
//       const storedUsername = localStorage.getItem('code_editor_username');
//       const newUsername = storedUsername || prompt('Enter your username:');
//       if (newUsername) {
//         setUsername(newUsername);
//         localStorage.setItem('code_editor_username', newUsername);
//       }

//       // Initialize WebSocket provider
//       const wsProvider = new WebsocketProvider(
//         'ws://localhost:3001',
//         'default-document',
//         ydoc
//       );
//       providerRef.current = wsProvider;

//       // Initialize awareness
//       const awareness = wsProvider.awareness;
//       awareness.setLocalState({
//         user: {
//           name: newUsername,
//           color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
//         },
//         cursor: null
//       });

//       // Track collaborators
//       awareness.on('change', () => {
//         const states = Array.from(awareness.getStates());
//         const newCollaborators = new Map();
//         states.forEach(([clientId, state]) => {
//           if (state.user && clientId !== ydoc.clientID) {
//             newCollaborators.set(clientId, state.user);
//           }
//         });
//         setCollaborators(newCollaborators);
//       });

//       return () => {
//         if (bindingRef.current) {
//           bindingRef.current.destroy();
//         }
//         if (providerRef.current) {
//           providerRef.current.destroy();
//         }
//         if (ydocRef.current) {
//           ydocRef.current.destroy();
//         }
//       };
//     };

//     initEditor();
//   }, []);

//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;

//     // Set up Monaco binding
//     const ytext = ydocRef.current.getText('monaco');
//     const binding = new MonacoBinding(
//       ytext,
//       editor.getModel(),
//       new Set([editor]),
//       providerRef.current.awareness
//     );
//     bindingRef.current = binding;

//     // Set up cursor tracking
//     editor.onDidChangeCursorPosition((e) => {
//       if (providerRef.current) {
//         const awareness = providerRef.current.awareness;
//         const currentState = awareness.getLocalState();
//         awareness.setLocalState({
//           ...currentState,
//           cursor: {
//             position: e.position,
//             selections: editor.getSelections()
//           }
//         });
//       }
//     });
//   };

//   const executeCode = async () => {
//     if (!editorRef.current || !providerRef.current) return;

//     const code = editorRef.current.getValue();
//     setOutput('');
//     setError('');

//     try {
//       const encoder = new TextEncoder();
//       const message = new Uint8Array([
//         3, // messageExec type
//         ...encoder.encode(JSON.stringify({ language, code }))
//       ]);

//       providerRef.current.ws.send(message);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleLanguageChange = (e) => {
//     setLanguage(e.target.value);
//     if (editorRef.current) {
//       const monaco = editorRef.current.getModel()._monaco;
//       monaco.editor.setModelLanguage(editorRef.current.getModel(), e.target.value);
//     }
//   };

//   return (
//     <Container>
//       <Header>
//         <Controls>
//           <Select value={language} onChange={handleLanguageChange}>
//             {languageOptions.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </Select>
//           <Button onClick={executeCode}>
//             Run Code
//           </Button>
//         </Controls>
//       </Header>

//       <CollaboratorsPanel>
//         <h4>Collaborators</h4>
//         {Array.from(collaborators.entries()).map(([clientId, user]) => (
//           <Collaborator key={clientId} color={user.color}>
//             {user.name}
//           </Collaborator>
//         ))}
//       </CollaboratorsPanel>

//       <EditorContainer>
//         <Editor
//           height="100%"
//           defaultLanguage="javascript"
//           theme="vs-dark"
//           onMount={handleEditorDidMount}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14
//           }}
//         ></Editor>
//       </EditorContainer>
//     </Container>
//   )
// }




import React, { useContext, useEffect, useRef, useState } from 'react';
import { MonacoBinding } from 'y-monaco';
import Editor from '@monaco-editor/react';

import { ClientContext } from './ClientContext';
import { getFileMode } from '../utils/GetIcon';
import { getFileContent } from '../utils/Fetch';
import { setLang } from '../Redux/editorSlice';
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
    // awarenessRef.current = provider.awareness;
    // provider.onopen = () => console.log('Connected');


    provider.on("sync", (isSynced) => {

      const model = editorRef.current.getModel();

      if (isSynced) {

        const yText = getYtext(file.url);
        console.log("Before sync " + yText.toString());

        if (provider && yText) {
          const monacoBinding = new MonacoBinding(
            yText,
            model,
            new Set([editorRef.current]),
            provider.awareness
          );
          console.log("After sync", yText.toString());

          // fileEntry.binding = monacoBinding;
          bindings.current.set(file.url, monacoBinding);

          if (yText.toString().length === 0) {
            getFileContent(file.url).then((res) => {
              yText.insert(0, res);
            })

          }

        }
      }
      console.log("Synced with server:", isSynced);
    });
  }

  function handleEditorDidMount(editor, monaco, file) {
    console.log(file);

    if (!file) return;
    monacoRef.current = monaco;
    editorRef.current = editor;
    editorsRef.current.set(file.id, editor);
    initiateFile(file);

  }



  useEffect(() => {
    console.log("Runned");

    const lan = getFileMode(activeFile.name);
    dispatch(setLang(lan))
    console.log(language);

    if (editorRef.current && currFile.current.id !== activeFile.id) {
      console.log(activeFile);

      monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), lan)
      initiateFile(activeFile);
      console.log("Initiated");

    }
  })

  // const handleCursorChange = (e) => {
  //   console.log(e);

  //   const position = editorRef.current?.getPosition();
  //   console.log(position);
  //   const cursorPosition = { line: position.lineNumber - 1, column: position.column - 1 };

  //   awarenessRef.current.setLocalStateField('user', {
  //     username: currentUser,
  //     cursorPosition,
  //   });
  // };

  // useEffect(() => {
  //   if (provider) {
  //     provider.ws.onmessage = (event) => {
  //       if (typeof event.data === 'string') {
  //         try {
  //           const data = JSON.parse(event.data);
  //           if (data.type === 'users') {
  //             setUsers(data.users);
  //             console.log(data.message);
  //           }
  //         } catch (e) {
  //           console.error('Error parsing JSON message:', e);
  //         }
  //       } else if (event.data instanceof ArrayBuffer) {
  //         // Convert ArrayBuffer to Uint8Array
  //         const update = new Uint8Array(event.data);
  //         console.log('Received Yjs binary update:', update, 'bytes');

  //         // Manually apply the update to Y.Doc
  //         try {
  //           Y.applyUpdate(ydoc, update);
  //           const content = yText.toString();
  //           console.log('Applied update manually. Y.Text:', content);
  //           if (content && !isReady) {
  //             setIsReady(true);
  //           }
  //         } catch (e) {
  //           console.error('Error applying Yjs update:', e);
  //         }
  //       }
  //     };
  //   }
  // }, [provider]);

  // const renderUserCursors = () => {
  //   const decorations = [];

  //   Object.entries(userCursors).forEach(([clientId, user]) => {
  //     const cursor = user.cursorPosition;
  //     const { username } = user;

  //     decorations.push({
  //       range: new MonacoEditor.Range(cursor.line + 1, cursor.column + 1, cursor.line + 1, cursor.column + 1), // 1-indexed
  //       options: {
  //         inlineClassName: 'user-cursor',
  //         hoverMessage: { value: `User: ${username}` },
  //       },
  //     });

  //     const userDecoration = {
  //       range: new MonacoEditor.Range(cursor.line + 1, cursor.column + 1, cursor.line + 1, cursor.column + 1),
  //       options: {
  //         className: 'username-decoration',
  //       },
  //     };

  //     decorations.push(userDecoration);
  //   });

  //   editorRef.current?.deltaDecorations([], decorations);
  // };

  // useEffect(() => {
  //   if (editorRef.current && userCursors) {
  //     console.log(userCursors);

  //     // renderUserCursors();
  //   }
  // }, [userCursors]);


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
      {/* <Editor
        height="100%"
        width={"100%"}
        theme="vs-dark"
        defaultLanguage={getFileMode(activeFile.name)}
        onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, activeFile)}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          wordWrap: 'on'
        }} /> */}
    </div >

  )






};

export default MonacoIDE;