import { useCallback, useMemo } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../index';
import { PopupContent, Profile } from 'src/api/models';
import { uniqueId } from 'lodash';

/************************************/
/********                    ********/
/******        Popup       ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/
export function useAddPopup(): (content: PopupContent, key?: string, insert?: boolean, removeAfterMs?: number) => void {
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
    console.log(error)
    return [];
  }
}

//End of popup

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


/************************************/
/********                    ********/
/******    profile info    ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/
export function useSetProfileInfo(): (profile: Profile) => void {
  const dispatch = useDispatch();
  return useCallback(
    (profile: Profile) => {
      dispatch(login({ profile }));
    },
    [dispatch],
  );
}

export function useGetProfileInfo() {
  const profile = useSelector((state: AppState) => state.application.profile);
  return profile;
}

export function useRemoveProfileInfo(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
}
//End of profile info

export function useReloadNotification(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(reloadNotification());
  }, [dispatch]);
}

export function useGetReloadNotificationFlg() {
  const reloadNotification = useSelector(
    (state: AppState) => state.application.reloadNotification,
  );
  return reloadNotification;
}

export function useNotifyChat(): (roomId: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (roomId: string) => {
      dispatch(notifyChat({ roomId }));
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
  const roomId = useSelector((state: AppState) => state.application.roomId);
  return roomId;
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
