import { createAction } from '@reduxjs/toolkit';
import { PopupContent, Profile } from 'src/api/models';

export const addPopup =
  createAction<{
    insert?: boolean;
    key?: string;
    removeAfterMs?: number | null;
    content: PopupContent;
  }>('app/addPopup');

export const removePopup =
  createAction<{ key?: string; isCleanAll: boolean }>('app/removePopup');

export const login = createAction<{ profile: Profile }>('app/login');

export const logout = createAction('app/logout');

export const reloadTable = createAction('app/reloadTable');

export const reloadNotification = createAction('app/reloadNotification');

export const notifyChat = createAction<{ roomId: string }>('app/notifyChat');

export const cleanNotifyChat = createAction('app/cleanNotifyChat');

export const chat = createAction<{ chatUser: number }>('app/chat');

export const cleanChat = createAction('app/cleanChat');

export const reloadChat = createAction('app/reloadChat');

