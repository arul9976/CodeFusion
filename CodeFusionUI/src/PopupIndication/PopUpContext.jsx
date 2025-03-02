// PopupContext.js
import React, { createContext, useContext, useRef, useState } from 'react';
import Popup from './Popup';
import Reconnect from './Reconnect';

const PopupContext = createContext();

const usePopup = () => {
  return useContext(PopupContext);
};

const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState(0);


  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectRef = useRef(null);

  const showPopup = (msg, type, duration = 3500) => {
    setType(type);
    setDuration(duration);
    setMessage(msg);
    setIsOpen(true);
  };

  const hidePopup = () => {
    setIsOpen(false);
    setMessage('');
  };


  const showSocketConnection = (reconnecting) => {
    reconnectRef.current = reconnecting;
    console.log(reconnectRef.current);
    
    setIsReconnecting(true);

  }

  const socketConnected = () => {
    setIsReconnecting(false);
  }

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, showSocketConnection, socketConnected }}>
      {children}
      {isOpen && <Popup message={message} setIsOpen={setIsOpen} type={type} duration={duration} />}
      {isReconnecting && <Reconnect reconnecting={reconnectRef.current} setIsReconnecting={setIsReconnecting} />}
    </PopupContext.Provider>
  );
};

export { usePopup, PopupProvider }