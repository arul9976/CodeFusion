import React from 'react'
import { ClientProvider } from './ClientContext'
import EditorACE from './EditorACE'

const IDE = () => {
  return (
    <ClientProvider>
      <EditorACE />
    </ClientProvider>
  )
}

export default IDE