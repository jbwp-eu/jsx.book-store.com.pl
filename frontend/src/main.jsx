import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './scss/style.scss'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import AppProvider from './components/AppProvider.jsx'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <AppProvider>
          <PayPalScriptProvider deferLoading={true}>
            <App />
          </PayPalScriptProvider>
        </AppProvider>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)
