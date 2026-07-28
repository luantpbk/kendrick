import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Popups from './components/Popups';
import theme from './theme';
import store from './state';
import { Provider } from 'react-redux';
import { SmartCardProvider } from './contexts/SmartCardProvider/SmartCardProvider';
import FCMNotification from './components/FCMNotification/FCMNotification';
import Chat from './components/Chat/Chat';
import Menu from './contexts/Menu';
import HeaderBar from './contexts/HeaderBar';
import SlideBarProvider from './contexts/SlideBar';
import AppRouters from './contexts/AppRouters';
import ModalsProvider from './contexts/Modals';

const App: React.FC = () => {
  React.useEffect(() => {
    const version = localStorage.getItem('PUGANIGRAVIO_VERSION');
    fetch('/version.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data: { version: string }) {
        if (data && data.version) {
          if (!version) {
            localStorage.setItem('PUGANIGRAVIO_VERSION', data.version);
          } else {
            if (version != data.version) {
              try {
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    names.forEach(async (name) => {
                      await caches.delete(name);
                    });
                  });
                }
              } catch (e) {
                console.log(e);
              }
              localStorage.setItem('PUGANIGRAVIO_VERSION', data.version);
              window.location.reload();
            }
          }
        }
      });
  }, []);

  //Main
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <SmartCardProvider>
          <SlideBarProvider>
            <ModalsProvider>
              <Popups />
              <FCMNotification />
              <BrowserRouter>
                <AppWrapper>
                  <HeaderBar />
                  <Menu />
                  <AppRouters />
                </AppWrapper>
              </BrowserRouter>
              <Chat key={'chat-component'} />
            </ModalsProvider>
          </SlideBarProvider>
        </SmartCardProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;

const AppWrapper = styled.div`
  height: 100vh;
  display: grid;
  align-content: flex-start;
`;
