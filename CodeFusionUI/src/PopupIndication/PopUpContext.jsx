// PopupContext.js
import React, { createContext, useContext, useState } from 'react';
import Popup from './Popup';

const PopupContext = createContext();

const usePopup = () => {
  return useContext(PopupContext);
};

const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState(0);

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

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {isOpen && <Popup message={message} setIsOpen={setIsOpen} type={type} duration={duration} />}
    </PopupContext.Provider>
  );
};

export { usePopup, PopupProvider }