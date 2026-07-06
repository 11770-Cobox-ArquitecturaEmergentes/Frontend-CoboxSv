import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { AppProviders, Auth0ProviderWithNavigate, Auth0TokenBridge } from './app/providers'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN as string
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppProviders>
        <BrowserRouter>
          <Auth0ProviderWithNavigate
            domain={auth0Domain}
            clientId={auth0ClientId}
            audience={auth0Audience}
          >
            <Auth0TokenBridge>
              <App />
            </Auth0TokenBridge>
          </Auth0ProviderWithNavigate>
        </BrowserRouter>
      </AppProviders>
    </Provider>
  </StrictMode>,
)