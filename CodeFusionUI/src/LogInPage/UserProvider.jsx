
import React, { createContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Redux/editorSlice';

// Create a Context for the user data
const UserContext = createContext(null);
// Create a Provider component
const UserProvider = ({ children }) => {

  const dispatchUser = useDispatch();

  const user = useSelector(state => state.editor.user);
  const isLoggedIn = useSelector(state => state.editor.user.isLoggedIn);


  const setUserLoginCredentials = (userInfo) => {
    console.log(user);

    if (!userInfo) { console.log("User Logged Error "); return false; }

    try {
      dispatchUser(setUser({
        name: userInfo.name,
        username: userInfo.username,
        email: userInfo.email,
        isLoggedIn: true,
      }));
      return true;
    } catch (error) {
      console.error('Error setting user credentials:', error);
      return false;
    }
  }

  return (
    <UserContext.Provider value={{ setUserLoginCredentials, user, isLoggedIn, dispatchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };