import React, { useContext } from 'react'
import { ClientProvider } from './ClientContext'
import EditorACE from './EditorACE';
import { useParams } from 'react-router-dom';
import { WebSocketProvider } from '../Websocket/WebSocketProvider';

const IDE = () => {

  const { ownername, workspace } = useParams();
  // const {user} = useContext(use);
  return (
    <ClientProvider>
      <WebSocketProvider roomId={(ownername + "$" + workspace)}>
        <EditorACE />
      </WebSocketProvider>
    </ClientProvider>
  )
}

export default IDE