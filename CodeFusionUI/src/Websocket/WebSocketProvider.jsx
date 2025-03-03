import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider as YWebsocketProvider } from "y-websocket";
import { UserContext } from "../LogInPage/UserProvider";
import { usePopup } from "../PopupIndication/PopUpContext";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, roomId }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState(null);
  const reconnectRef = useRef(null);
  const workspaceProviders = useRef(new Map());
  const { user } = useContext(UserContext);

  const { showSocketConnection, showPopup, socketConnected } = usePopup();

  const connectWebSocket = () => {
    console.log("Socket connection Called ------");

    if (!user) {
      console.log("User not specified");
      return;

    }
    const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}?username=${user.username}&roomId=${roomId}`);

    ws.onopen = () => {
      socketConnected();
      showPopup("Workspace Connected Successfully", 'success', 3000);
      console.log(`Connected to Global WebSocket for room ${roomId} as ${user.username}`);
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "id") {
        setClientId(data.id); // Store the unique ID from server
        console.log(`Assigned client ID: ${data.id} for ${user.username} in room ${roomId}`);
      } else {
        console.log(`Received in room ${roomId} (${user.username}):`, data.message);
      }
    };

    ws.onclose = () => {
      showSocketConnection(connectWebSocket);
      console.log(`Global WebSocket for room ${roomId} disconnected. Reconnecting...`);
      setIsConnected(false);
      setSocket(null);
      clearTimeout(reconnectRef.current);
      reconnectRef.current = setTimeout(() => {
        console.log("Called After 5 seconds");

        connectWebSocket();
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for room ${roomId}:`, error);
      ws.close();
    };
  };

  useEffect(() => {
    if (user.username && roomId) {
      connectWebSocket();
    } else {
      console.warn("Username or roomId missing, skipping WebSocket connection");
    }

    return () => {
      if (socket) socket.close();
      clearTimeout(reconnectRef.current);
      workspaceProviders.current.forEach((provider) => provider.destroy());
      workspaceProviders.current.clear();
    };
  }, [user, roomId]);

  const getWorkspaceProvider = (workspaceId) => {
    const fullRoomId = `${roomId}-${workspaceId}`;
    console.log("Full Room ID " + fullRoomId);
    console.log(workspaceProviders.current.get(fullRoomId));

    if (!workspaceProviders.current.has(fullRoomId)) {
      const doc = new Y.Doc();
      const provider = new YWebsocketProvider(
        `${import.meta.env.VITE_WEBSOCKET_URL}?username=${user.username}&fullRoomId=${encodeURIComponent(fullRoomId)}&`,
        fullRoomId,
        doc
      );

      provider.on("status", (event) => {
        console.log(`Yjs WebSocket for ${fullRoomId} (user: ${user.username}) status: ${event.status}`);
      });

      provider.on('connection-close', () => {
        if (provider.wsconnected === false && workspaceProviders.has(fullRoomId)) {
          provider.destroy();
          workspaceProviders.delete(fullRoomId);
          console.log(`Cleaned up provider for ${roomId}`);
        }
      });

      workspaceProviders.current.set(fullRoomId, provider);
    }
    return workspaceProviders.current.get(fullRoomId);
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, clientId, roomId, getWorkspaceProvider }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);