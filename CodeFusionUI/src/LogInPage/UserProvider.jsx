
import React, { createContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Redux/editorSlice';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

// Create a Context for the user data
const UserContext = createContext(null);
// Create a Provider component
const UserProvider = ({ children }) => {

  const dispatchUser = useDispatch();

  const user = useSelector(state => state.editor.user);
  const terminalHistory = useSelector(state => state.editor.terminalHistory);
  const inputWant = useSelector(state => state.editor.inputWant);
  const isLoggedIn = useSelector(state => state.editor.user.isLoggedIn);
  const notifications = useSelector(state => state.editor.notifications);
  const webSocketRef = useRef(new Map());
  const yDocRef = useRef(null);

  const setUserLoginCredentials = (userInfo) => {
    console.log(user);

    if (!userInfo) { console.log("User Logged Error "); return false; }

    try {
      dispatchUser(setUser({
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
        isLoggedIn: true,
        profilePic: userInfo.profilePic

      }));
      return true;
    } catch (error) {
      console.error('Error setting user credentials:', error);
      return false;
    }
  }

  const initWebSocketConnection = (username, roomId) => {

    if (!username || !roomId) {
      console.log("Not Username or Room ID Valid");
      return;
    }
    if (webSocketRef.current.size > 0) {
      if (webSocketRef.current.has(roomId)) {
        return webSocketRef.current.get(roomId);
      }

      webSocketRef.current.get.destroy();
      webSocketRef.current = new Map();
    }

    const provider = makeProvider(username, roomId);
    console.log("In Initializing Provider");


    webSocketRef.current.set(roomId, provider);
    return provider;
  }

  const makeProvider = (username, roomId) => {
    console.log('Making provider for', username, roomId);
    yDocRef.current = new Y.Doc();
    return new WebsocketProvider(
      `ws://localhost:3000?username=${username}&roomId=${roomId}&`,
      roomId,
      yDocRef.current
    );
  }

  return (
    <UserContext.Provider value={{
      setUserLoginCredentials, user, isLoggedIn, dispatchUser, terminalHistory, inputWant,
      notifications, initWebSocketConnection
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };