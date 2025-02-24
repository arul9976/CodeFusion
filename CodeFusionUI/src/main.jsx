import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
// import './App.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.jsx'
import { UserProvider } from './LogInPage/UserProvider.jsx'
import { TerminalContextProvider } from 'react-terminal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename='CodeFusion'>
      <Provider store={store}>
        <TerminalContextProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </TerminalContextProvider>
      </Provider>
    </BrowserRouter>

  </StrictMode>
)