import { getApps, initializeApp, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAI_O_9Ffe0Km_SXlhdxQuXGNHcH-XOP3g',
  authDomain: 'jvsconnection.firebaseapp.com',
  projectId: 'jvsconnection',
  storageBucket: 'jvsconnection.appspot.com',
  messagingSenderId: '413172745752',
  appId: '1:413172745752:web:4cdad8445b073576e2e56d',
  measurementId: 'G-L9YHP76243',
};
const firebaseApp = !getApps.length ? initializeApp(firebaseConfig) : getApp();

const messaging = getMessaging(firebaseApp);

export const getFCMToken = () => {
  return getToken(messaging, {
    vapidKey:
      'BFovZ__aJAJh-nVc1Gj7SDf4UUlg9x6iRRTBm7H0W3EM-Mlws0_V6SiION9yt_aPME-RRo8vjOooskxSc-42ENM',
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload: any) => {
      resolve(payload);
    });
  });
