import { createAction } from '@reduxjs/toolkit';
import { ExtendDataModel, PopupContent } from 'src/api/models';
import { AppState } from '..';
import { Profile, CartItemType, ApplicationState } from './models';

export const addPopup = createAction<{
  insert?: boolean;
  key?: string;
  removeAfterMs?: number | null;
  content: PopupContent;
}>('app/addPopup');

export const removePopup = createAction<{ key?: string; isCleanAll: boolean }>(
  'app/removePopup',
);

export const login = createAction<{ profile: Profile }>('app/login');

export const logout = createAction('app/logout');

export const reloadTable = createAction('app/reloadTable');

export const insertCart = createAction<{ cartItem: CartItemType }>('app/insertCart');

export const removeCart = createAction<{ cartItems: CartItemType[] }>('app/removeCart');

export const cleanCart = createAction('app/cleanCart');

export const editCart = createAction<{ cartItem: CartItemType }>('app/editCart');

export const setNotificationBadge = createAction<{ notificationBadge: number }>(
  'app/setNotificationBadge',
);

export const notifyChat = createAction<{ roomId: string; extendData?: ExtendDataModel }>(
  'app/notifyChat',
);

export const cleanNotifyChat = createAction('app/cleanNotifyChat');

export const chat = createAction<{ chatUser: number }>('app/chat');

export const cleanChat = createAction('app/cleanChat');

export const reloadChat = createAction('app/reloadChat');

export const refreshState = createAction<ApplicationState>('app/refreshState');