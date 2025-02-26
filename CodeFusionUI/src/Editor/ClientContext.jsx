// // UserContext.js
// import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { io } from 'socket.io-client';
// import { setCode } from '../Redux/editorSlice';
// import * as Y from 'yjs';

// // Create a Context for the user data
// const ClientContext = createContext(null);
// const ydoc = new Y.Doc();
// const yText = ydoc.getText('editor');

// // Create a Provider component
// const ClientProvider = ({ children }) => {
//   const socket = useRef(null);
//   const dispatch = useDispatch();
//   const isInit = useRef(0);

//   const currentTheme = useSelector(state => state.editor.currentTheme);
//   const language = useSelector(state => state.editor.language);
//   const code = useSelector(state => state.editor.code);
//   const editorTheme = useSelector(state => state.editor.editorTheme);
//   const activeFile = useSelector(state => state.editor.activeFile);
//   const cursor = useSelector(state => state.editor.cursor);
//   const output = useSelector(state => state.editor.output);


//   const fileOpenAndDocCreate = (file) => {
//     isInit.current = 1;
//     const { url, content } = file;
//     // console.log("File open and doc create " + content);

//     // dispatch(setCode(content));
//     socket.current.emit('fileOpenAndDocCreate', { path: url, content, language });

//     socket.current.on('fileLoaded', (data) => {
//       // console.log(socket.current.id, data.id);
//       if (socket.current.id !== data.id) { console.log("Socket not Match"); return; }
//       console.log("file dispatched in server document \n" + data);
//       dispatch(setCode(data.content));
//       yText.delete(0, yText.toString().length);
//       yText.insert(0, data.content);
//       console.log("yText " + yText.toString());

//     })
//   }

//   const bindToYtext = (yDelta) => {
//     const { action, start, end, lines, totalLines } = yDelta;
//     let s = start;

//     // cursors.set(socket.id, cursor);
//     if (lines !== yText.toString()) {
//       console.log("\nDelta ==> " + start, end, lines, action);

//       // console.log("\nBefore\n" + yText.toString());

//       if (action == 'insert') {
//         console.log(yText.toString().split('\n').length, totalLines, (yText.toString().split('\n').length - totalLines));
//         let n = (yText.toString().split('\n').length - totalLines);
//         s += n > 0 ? n : 0;

//         ydoc.transact(() => {
//           yText.delete(s, 0);
//           yText.insert(s, lines);
//         });
//       }
//       else if (action == 'remove') {
//         ydoc.transact(() => {
//           yText.delete(start, lines.length);
//         })
//       }
//     }
//     // console.log("After bindToYtext " + yText.toString() + "\nCompleted bind");
//     return true;
//   }


//   // const checkInternalCodeUpdateAndPush = () => {

//   // }

//   const applyYjsDeltaToEditor = (editorRef, yDelta) => {
//     const editor = editorRef.current.editor;
//     // console.log(yDelta);
//     if (code !== yDelta.lines) {
//       editor.session.getDocument().applyDeltas(yDelta);
//       console.log("Binded...");
//     }
//   };

//   const sendMsgToUsers = (message, userId) => {
//     // dispatch(setCode(content));
//     socket.current.emit('sendmsg', { message, to: userId });

//   }

//   useEffect(() => {

//     // socket.current = io('http://localhost:3000');
//     socket.current = io('http://172.17.22.225:3000');


//     socket.current.emit('newuser', "User created");

//     console.log("socket created " + socket.current);

//     // socket.current.on('updatedCode', (data) => {
//     //   const { aceDelta } = data;

//     // });

//     return () => {

//       if (socket.current) {
//         socket.current.off("fileLoaded")
//         // socket.current.disconnect();
//       }

//     }
//   }, [])

//   // const returner = {

//   // }


//   // const logIn = () => setUser({ name: 'Jane Doe', loggedIn: true });
//   // const logOut = () => setUser({ name: '', loggedIn: false });

//   return (
//     <ClientContext.Provider value={{
//       socket, dispatch, currentTheme, language, code, fileOpenAndDocCreate,
//       sendMsgToUsers, editorTheme, activeFile, cursor, output, ydoc, yText, isInit, bindToYtext,
//       applyYjsDeltaToEditor

//     }}>
//       {children}
//     </ClientContext.Provider>
//   );
// };

// export { ClientContext, ClientProvider };






// UserContext.js

import React, { createContext, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { UserContext } from '../LogInPage/UserProvider';

// Create a Context for the user data
const ClientContext = createContext(null);
// Create a Provider component
const ClientProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const userRef = useRef(0);
  const currentTheme = useSelector(state => state.editor.currentTheme);
  const language = useSelector(state => state.editor.language);
  const code = useSelector(state => state.editor.code);
  const editorTheme = useSelector(state => state.editor.editorTheme);
  const activeFile = useSelector(state => state.editor.activeFile);
  const cursor = useSelector(state => state.editor.cursor);
  const output = useSelector(state => state.editor.output);
  const ydocsRef = useRef(new Map());
  const ydocRef = useRef(null);
  const editorsRef = useRef(new Map());
  const bindings = useRef(new Map());
  const yTextRef = useRef(null);

  const providersRef = useRef(new Map());
  const currentProvider = useRef(null);

  const currWorkSpace = useRef(null);

  const initAndGetProvider = (path) => {
    console.log(providersRef.current);

    if (!path) {
      console.error('No file path provided');
      return null;
    }

    if (!ydocsRef.current.has(path)) {
      const ydoc = new Y.Doc();
      ydocsRef.current.set(path, ydoc);
      console.log(`New Y.Doc created for ${path}`);
    }

    if (!providersRef.current.has(path)) {
      const ydoc = ydocsRef.current.get(path);


      const provider = new WebsocketProvider(
        `ws://localhost:3000?username=${user.username}&filePath=${path}&`,
        path,
        ydoc
      );

      // const provider = new WebsocketProvider(
      //   `ws://172.17.22.225:3000?username=${user.username}&filePath=${path}&`,
      //   path,
      //   ydoc,

      // );
      currentProvider.current = provider;
      providersRef.current.set(path, provider);
      console.log(`Initialized provider for ${path}`);
    }

    return providersRef.current.get(path);
  };

  const getYtext = (path) => {
    if (!path) {
      console.error('No file path provided for getYtext');
      return null;
    }

    const ydoc = ydocsRef.current.get(path);
    if (ydoc) {
      const ytext = ydoc.getText(path);
      // ytext.delete(0, ytext.toString().length);

      console.log(`Retrieved Y.Text for ${path}: ${ytext.toString()}...`);
      return ytext;
    }
    console.warn(`No Y.Doc found for ${path}`);
    return null;
  };

  const getBindings = (path) => {
    if (!path || !bindings.current.has(path)) {
      console.error('No file path provided for getBindings');
      return null;
    }
    return bindings.current.get(path);
  }


  const setCurrentWorkSpace = (wsName) => {
    currWorkSpace.current = wsName;
  }

  return (
    <ClientContext.Provider value={{
      dispatch, currentTheme, language, code,
      editorTheme, activeFile, cursor, output, ydocRef, getYtext,
      initAndGetProvider, editorsRef, getBindings, bindings,
      providersRef, currentProvider, setCurrentWorkSpace, currWorkSpace


    }}>
      {children}
    </ClientContext.Provider>
  );
};

export { ClientContext, ClientProvider };
