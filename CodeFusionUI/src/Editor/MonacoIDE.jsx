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

import * as Y from 'yjs';
import { ClientContext } from './ClientContext';
import { getFileMode } from '../utils/GetIcon';
const MonacoIDE = () => {

  const { initAndGetProvider, activeFile, getYtext } = useContext(ClientContext);

  const editorRef = useRef(null);

  const awarenessRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  // const [doc, setDoc] = useState(new Y.Doc());
  const [userCursors, setUserCursors] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentUser, setCurrentUser] = useState('User_0');
  const [binding, setBinding] = useState(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const model = editor.getModel();

    const provider = initAndGetProvider(activeFile.url);
    const yText = getYtext(activeFile.url);

    console.log("---> " + yText.toString() + " END");

    awarenessRef.current = provider.awareness;


    provider.on("sync", (isSynced) => {
      if (isSynced) {
        if (provider && yText) {
          const monacoBinding = new MonacoBinding(
            yText,
            model,
            new Set([editor]),
            provider.awareness
          );

          setProvider(provider);
          setBinding(monacoBinding);
          console.log("editor");

        }
      }
      console.log("Synced with server:", isSynced);
    });

    const loadDocumentContent = async () => {
      const existingText = yText.toString();
      console.log(existingText);

    };

    loadDocumentContent();

    // yText.observe(() => {
    //   console.log("Log From Observe--> " + yText.toString());

    // });



    // monacoBinding.on('sync', () => {
    //   console.log('Yjs document synced');
    // });

  }

  const handleCursorChange = (e) => {
    console.log(e);

    const position = editorRef.current?.getPosition();
    console.log(position);
    const cursorPosition = { line: position.lineNumber - 1, column: position.column - 1 };

    awarenessRef.current.setLocalStateField('user', {
      username: currentUser,
      cursorPosition,
    });
  };

  useEffect(() => {

    console.log("editor2");

    if (editorRef.current) {
      console.log("Initiating");


    }

    return () => {
      if (provider) {
        provider.destroy();
      }
    };
  }, [provider]);

  const renderUserCursors = () => {
    const decorations = [];

    Object.entries(userCursors).forEach(([clientId, user]) => {
      const cursor = user.cursorPosition;
      const { username } = user;

      decorations.push({
        range: new MonacoEditor.Range(cursor.line + 1, cursor.column + 1, cursor.line + 1, cursor.column + 1), // 1-indexed
        options: {
          inlineClassName: 'user-cursor',
          hoverMessage: { value: `User: ${username}` },
        },
      });

      const userDecoration = {
        range: new MonacoEditor.Range(cursor.line + 1, cursor.column + 1, cursor.line + 1, cursor.column + 1),
        options: {
          className: 'username-decoration',
        },
      };

      decorations.push(userDecoration);
    });

    editorRef.current?.deltaDecorations([], decorations);
  };

  useEffect(() => {
    if (editorRef.current && userCursors) {
      console.log(userCursors);

      // renderUserCursors();
    }
  }, [userCursors]);


  // useEffect(() => {
  //   if (editorRef.current) {
  // const position = editorRef.current?.getPosition();
  // console.log(position);

  //   }



  // }, [editorRef.current?.getPosition()])

  return (
    <div>
      <h1>Collaborative Code Editor</h1>

      <Editor
        height="90vh"
        theme="vs-dark"
        defaultLanguage={getFileMode(activeFile.name)}
        onMount={handleEditorDidMount}
        onChange={handleCursorChange}
        ref={editorRef} />
    </div>
  );


};

export default MonacoIDE;
