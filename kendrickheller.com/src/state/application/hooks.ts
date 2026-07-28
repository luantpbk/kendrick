import { useCallback } from 'react';
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
  cleanNotifyChat,
  notifyChat,
  chat,
  cleanChat,
  reloadChat,
  refreshState,
} from './actions';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../index';
import { ApplicationState, CartItemType, Profile } from './models';
import { ExtendDataModel, PopupContent } from 'src/api/models';

// returns a function that allows adding a popup
export function useAddPopup(): (
  content: PopupContent,
  key?: string,
  insert?: boolean,
  removeAfterMs?: number,
) => void {
  const dispatch = useDispatch();
  return useCallback(
    (content: PopupContent, key?: string, insert?: boolean, removeAfterMs?: number) => {
      dispatch(addPopup({ content, insert, key, removeAfterMs }));
    },
    [dispatch],
  );
}

export function useRemovePopup(): (isCleanAll: boolean, key?: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (isCleanAll: boolean, key?: string) => {
      dispatch(removePopup({ isCleanAll, key }));
    },
    [dispatch],
  );
}

export function useActivePopups(): AppState['application']['popupList'] {
  try {
    return useSelector((state: AppState) => state.application.popupList);
  } catch (error) {
    console.log(error);
    return [];
  }
}

//Writen by Le Van Huy
export function useInsertCart(): (cartItem: CartItemType) => void {
  const dispatch = useDispatch();
  return useCallback(
    (cartItem: CartItemType) => {
      dispatch(insertCart({ cartItem }));
    },
    [dispatch],
  );
}

export function useEditCart(): (cartItem: CartItemType) => void {
  const dispatch = useDispatch();
  return useCallback(
    (cartItem: CartItemType) => {
      dispatch(editCart({ cartItem }));
    },
    [dispatch],
  );
}

export function useRemoveCart(): (cartItems: CartItemType[]) => void {
  const dispatch = useDispatch();
  return useCallback(
    (cartItems: CartItemType[]) => {
      dispatch(removeCart({ cartItems }));
    },
    [dispatch],
  );
}

export function useCleanCart(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(cleanCart());
  }, [dispatch]);
}

export function useSetProfileInfo(): (profile: Profile) => void {
  const dispatch = useDispatch();
  return useCallback(
    (profile: Profile) => {
      dispatch(login({ profile }));
    },
    [dispatch],
  );
}

export function useRemoveProfileInfo(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
}

export function useGetProfileInfo() {
  const profile = useSelector((state: AppState) => state.application.profile);
  return profile;
}

export function useReloadTable(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(reloadTable());
  }, [dispatch]);
}

export function useGetStatusReload() {
  const reload = useSelector((state: AppState) => state.application.reloadFlag);
  return reload;
}

export function useGetCart() {
  const list = useSelector((state: AppState) => state.application.cart);
  return list;
}

//Notification
export function useSetNotificationBadge(): (notificationBadge: number) => void {
  const dispatch = useDispatch();
  return useCallback(
    (notificationBadge: number) => {
      dispatch(setNotificationBadge({ notificationBadge }));
    },
    [dispatch],
  );
}

export function useGetnotificationBadge() {
  const notificationBadge = useSelector(
    (state: AppState) => state.application.notificationBadge,
  );
  return notificationBadge;
}
//End of notification

export function useNotifyChat(): (roomId: string, extendData?: ExtendDataModel) => void {
  const dispatch = useDispatch();
  return useCallback(
    (roomId: string, extendData?: ExtendDataModel) => {
      dispatch(notifyChat({ roomId, extendData }));
    },
    [dispatch],
  );
}

export function useCleanNotifyChat(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(cleanNotifyChat());
  }, [dispatch]);
}

export function useGetNotifyChat() {
  const room = useSelector((state: AppState) => state.application.room);
  return room;
}

export function useChat(): (chatUser: number) => void {
  const dispatch = useDispatch();
  return useCallback(
    (chatUser: number) => {
      dispatch(chat({ chatUser }));
    },
    [dispatch],
  );
}

export function useCleanChat(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(cleanChat());
  }, [dispatch]);
}

export function useGetChat() {
  const chatUser = useSelector((state: AppState) => state.application.chatUser);
  return chatUser;
}

export function useReloadChat(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(reloadChat());
  }, [dispatch]);
}

export function useGetReloadChatlg() {
  const reloadChat = useSelector((state: AppState) => state.application.reloadChat);
  return reloadChat;
}

export function useRefreshState(): (state: ApplicationState) => void {
  const dispatch = useDispatch();
  return useCallback(
    (state: ApplicationState) => {
      dispatch(refreshState(state));
    },
    [dispatch],
  );
}
