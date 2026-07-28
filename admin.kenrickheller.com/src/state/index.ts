import { configureStore } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';
import application, { initialState as appInitialState } from './application/reducer';

const PERSISTED_KEYS: string[] = [];

const store = configureStore({
  reducer: {
    application,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    save({ states: PERSISTED_KEYS, namespace: 'AdminKenrickheller' }),
  ],
  preloadedState: load({
    states: PERSISTED_KEYS,
    namespace: 'AdminKenrickheller',
    preloadedState: {
      application: { ...appInitialState },
    },
  }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
