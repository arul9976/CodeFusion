import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, MessageSquare } from 'lucide-react';

const Notification = ({ notificationPanel, setNotificationPanel, notifies }) => {
  const [notifications, setNotifications] = useState([]);
  // const [notificationPanel, setNotificationPanel] = useState(false);

  const styles = {
    container: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '380px',
      zIndex: notificationPanel && 2000,
    },
    toggleButton: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      transition: 'all 0.3s ease',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#ef4444',
      color: '#fff',
      borderRadius: '50%',
      padding: '2px 8px',
      fontSize: '12px',
      fontWeight: 'bold',
      animation: 'pulse 2s infinite',
    },
    panel: {
      backgroundColor: '#1e293b',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      transform: notificationPanel ? 'translateX(0)' : 'translateX(120%)',
      opacity: notificationPanel ? 1 : 0,

      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    header: {
      padding: '20px',
      backgroundColor: '#2a3749',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: '#fff',
      fontSize: '18px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    clearButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
    },
    notificationList: {
      maxHeight: '400px',
      overflowY: 'auto',
    },
    notification: {
      padding: '16px 20px',
      borderBottom: '1px solid #374151',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      backgroundColor: '#1e293b',
      transition: 'all 0.3s ease',
      animation: 'slideIn 0.3s ease forwards',
    },
    iconWrapper: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    content: {
      flex: 1,
    },
    notificationTitle: {
      color: '#fff',
      fontSize: '16px',
      marginBottom: '4px',
      fontWeight: '500',
    },
    message: {
      color: '#94a3b8',
      fontSize: '14px',
    },
    time: {
      color: '#64748b',
      fontSize: '12px',
      marginTop: '4px',
    },
    '@keyframes slideIn': {
      from: { transform: 'translateX(100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.2)' },
      '100%': { transform: 'scale(1)' },
    },
  };

  // Sample notifications
  const demoNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Project Created',
      message: 'Your new workspace "Design System" has been created successfully.',
      time: '2 minutes ago',
      icon: Check,
      color: '#22c55e',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Storage Warning',
      message: 'Your workspace is approaching storage limit. Consider upgrading.',
      time: '15 minutes ago',
      icon: AlertCircle,
      color: '#f59e0b',
    },
    {
      id: 3,
      type: 'info',
      title: 'New Feature Available',
      message: 'Try out our new collaborative coding feature!',
      time: '1 hour ago',
      icon: Info,
      color: '#3b82f6',
    },
    {
      id: 4,
      type: 'message',
      title: 'New Comment',
      message: 'John Doe commented on your recent commit.',
      time: '2 hours ago',
      icon: MessageSquare,
      color: '#8b5cf6',
    },
  ];

  useEffect(() => {
    setNotifications(demoNotifications);
    console.log("Hiiiii");
    // setNotificationPanel(() => notificationPanel);
  }, [notificationPanel]);

  const addNotification = (type) => {
    const newNotification = {
      id: Date.now(),
      type,
      title: `New ${type} Notification`,
      message: `This is a ${type} notification message.`,
      time: 'Just now',
      icon: type === 'success' ? Check : AlertCircle,
      color: type === 'success' ? '#22c55e' : '#f59e0b',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setNotificationPanel(() => false);
  };

  return (
    <div style={styles.container}>
      {/* <button
        style={{
          ...styles.toggleButton,
          transform: notificationPanel ? 'scale(0)' : 'scale(1)',
        }}
        onClick={() => setNotificationPanel(true)}
      >
        <Bell color="white" size={24} />
        {notifications.length > 0 && (
          <span style={styles.badge}>{notifications.length}</span>
        )}
      </button> */}

      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.title}>
            <Bell size={20} /> Notifications
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={styles.clearButton}
              onClick={clearAll}
              onMouseEnter={e => e.target.style.backgroundColor = '#374151'}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              Clear All
            </button>
            <button
              style={styles.clearButton}
              onClick={() => setNotificationPanel(false)}
              onMouseEnter={e => e.target.style.backgroundColor = '#374151'}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={styles.notificationList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={styles.notification}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a3749'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1e293b'}
            >
              <div style={{
                ...styles.iconWrapper,
                backgroundColor: `${notification.color}20`,
              }}>
                <notification.icon size={20} color={notification.color} />
              </div>
              <div style={styles.content}>
                <div style={styles.notificationTitle}>{notification.title}</div>
                <div style={styles.message}>{notification.message}</div>
                <div style={styles.time}>{notification.time}</div>
              </div>
              <button
                style={styles.clearButton}
                onClick={() => removeNotification(notification.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
      }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#22c55e',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => addNotification('success')}
        >
          Add Success
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#f59e0b',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={() => addNotification('warning')}
        >
          Add Warning
        </button>
      </div> */}
    </div>
  );
};

export default Notification;