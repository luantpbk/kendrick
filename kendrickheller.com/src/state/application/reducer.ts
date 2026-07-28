import { createReducer, nanoid } from '@reduxjs/toolkit';
import {
  addPopup,
  removePopup,
  login,
  logout,
  reloadTable,
  cleanCart,
  insertCart,
  removeCart,
  editCart,
  setNotificationBadge,
  notifyChat,
  cleanNotifyChat,
  chat,
  cleanChat,
  reloadChat,
  refreshState,
} from './actions';
import { ApplicationState } from './models';

export const initialState: ApplicationState = {
  popupList: [],
  profile: undefined,
  reloadFlag: false,
  cart: [],
  notificationBadge: 0,
  room: undefined,
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
    .addCase(insertCart, (state, { payload: { cartItem } }) => {
      cartItem.key = nanoid();
      state.cart = state.cart ? [...state.cart, cartItem] : [cartItem];
    })
    .addCase(removeCart, (state, { payload: { cartItems } }) => {
      if (state.cart) {
        state.cart = state.cart.filter((c) => !cartItems.some((rc) => rc.key == c.key));
      }
    })
    .addCase(cleanCart, (state) => {
      state.cart = [];
    })
    .addCase(editCart, (state, { payload: { cartItem } }) => {
      const indx = state.cart.findIndex((c) => c.key == cartItem.key);
      if (indx >= 0) state.cart[indx] = cartItem;
    })
    .addCase(setNotificationBadge, (state, { payload: { notificationBadge } }) => {
      state.notificationBadge = notificationBadge;
    })
    .addCase(notifyChat, (state, { payload: { roomId, extendData } }) => {
      state.room = {
        roomId,
        extendData,
      };
    })
    .addCase(cleanNotifyChat, (state) => {
      state.room = undefined;
    })
    .addCase(chat, (state, { payload: { chatUser } }) => {
      state.chatUser = chatUser;
    })
    .addCase(cleanChat, (state) => {
      state.chatUser = undefined;
    })
    .addCase(reloadChat, (state) => {
      state.reloadChat = !state.reloadChat;
    })
    .addCase(refreshState, (state, { payload }) => {
      Object.entries(payload).forEach(([key, value]) => {
        state[key] = value;
      });
    })
);
