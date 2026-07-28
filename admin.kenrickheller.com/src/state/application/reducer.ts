import { createReducer, nanoid } from '@reduxjs/toolkit';
import { PopupList, Profile, RealmType } from 'src/api/models';
import {
  addPopup,
  removePopup,
  login,
  logout,
  reloadTable,
  reloadNotification,
  notifyChat,
  cleanNotifyChat,
  chat,
  cleanChat,
  reloadChat,
} from './actions';

export interface ApplicationState {
  popupList: PopupList;
  profile: Profile;
  reloadFlag: boolean;
  reloadNotification: boolean;
  listRealm: RealmType[] | null;
  roomId: string;
  chatUser: number;
  reloadChat: boolean;
}

export const initialState: ApplicationState = {
  popupList: [],
  profile: undefined,
  reloadFlag: false,
  reloadNotification: false,
  listRealm: undefined,
  roomId: undefined,
  chatUser: undefined,
  reloadChat: false,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(removePopup, (state, { payload: { key, isCleanAll } }) => {
      if (isCleanAll) {
        state.popupList = [];
      } else {
        const index = state.popupList.findIndex((p) => p.key == key);
        state.popupList.splice(index, 1);
      }
    })
    .addCase(addPopup, (state, { payload: { insert, content, key, removeAfterMs } }) => {
      if ('txn' in content || 'error' in content) removeAfterMs = removeAfterMs ?? 1000;
      state.popupList = insert
        ? key
          ? state.popupList.filter((popup) => popup.key !== key)
          : state.popupList
        : [];
      state.popupList.push({
        key: key || nanoid(),
        content,
        removeAfterMs,
      });
    })
    .addCase(login, (state, { payload: { profile } }) => {
      state.profile = profile;
    })
    .addCase(logout, (state) => {
      state.profile = undefined;
    })
    .addCase(reloadTable, (state) => {
      state.reloadFlag = !state.reloadFlag;
    })
    .addCase(reloadNotification, (state) => {
      state.reloadNotification = !state.reloadNotification;
    })
    .addCase(notifyChat, (state, { payload: { roomId } }) => {
      state.roomId = roomId;
    })
    .addCase(cleanNotifyChat, (state) => {
      state.roomId = undefined;
    })
    .addCase(chat, (state, { payload: { chatUser } }) => {
      state.chatUser = chatUser;
    })
    .addCase(cleanChat, (state) => {
      state.chatUser = undefined;
    })
    .addCase(reloadChat, (state) => {
      state.reloadChat = !state.reloadChat;
    }),
);
