import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import store from './state';
import { Provider } from 'react-redux';
import ModalsProvider from './contexts/Modals';
import { SmartCardProvider } from './contexts/SmartCardProvider/SmartCardProvider';
import AppRouters from './contexts/AppRouters';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Popups from './components/Popups';
import i18n from './i18n/i18n';
import { I18nextProvider } from 'react-i18next';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <PayPalScriptProvider options={{
            "clientId": "AR90PNiFGlhmBPxydMb1jtjPLrWkzGEXTTQJo6_8WQGKUYQPIRQFLFvk5DH-gVpYQKFaJVp7LW53ifvG",
            "locale": "en_US",
            "currency": "USD"
          }}>
            <SmartCardProvider>
              <ModalsProvider>
                <Popups />
                <BrowserRouter key={'router-base'}>
                  <AppRouters />
                </BrowserRouter>
              </ModalsProvider>
            </SmartCardProvider>
          </PayPalScriptProvider>
        </I18nextProvider>
      </Provider>
    </ThemeProvider>
  );
};


export default App;
