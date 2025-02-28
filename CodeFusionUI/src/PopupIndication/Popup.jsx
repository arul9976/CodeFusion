import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import "./Popup.css";
import { AlertTriangle } from "lucide-react";

const Popup = ({ message, setIsOpen, type = "default", duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    const animationDuration = 500;
    setTimeout(() => {
      setIsVisible(false);
      setIsOpen(prev => false);
    }, animationDuration);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <AiOutlineCheckCircle className="status-icon success" />;
      case "error":
        return <AiOutlineWarning className="status-icon error" />;
      case "warning":
        return <AlertTriangle className="status-icon warning" />;
      default:
        return null;
    }
  };

  return (
    <div className={`popup-container ${type} ${isLeaving ? 'leaving' : ''}`}>
      <div className="popup-content">
        {getIcon()}
        <p className="popup-message">{message}</p>
        <AiOutlineClose className="close-icon" onClick={handleClose} />
      </div>
    </div>
  );
};

export default Popup;