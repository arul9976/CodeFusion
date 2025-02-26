
import React, { createContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Redux/editorSlice';
import { WebsocketProvider } from 'y-websocket';

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
  const webSocketRef = useRef(null);
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

  const initWebSocketConnection = (username, roodId) => {
    if (webSocketRef.current) {
      if (webSocketRef.current.wsId === roodId) {
        return webSocketRef;
      }

      webSocketRef.current.websoc.destroy();
      webSocketRef.current = null;
    }

    const provider = makeProvider(username, roodId);

    webSocketRef.current = {
      wsId: roodId,
      websoc: provider,
    }
  }

  const makeProvider = (username, roodId) => {
    console.log('Making provider for', username, roodId);
    // yDocRef.c
    return new WebsocketProvider(
      `ws://localhost:3000?username=${username}&roodId=${roodId}&`,
      roodId,
      ""
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