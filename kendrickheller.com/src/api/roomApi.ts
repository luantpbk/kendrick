/************************************/
/********                    ********/
/******         Room        ********/
/******   Writen by LuanPT      ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, RoomType } from './models';

/***********************************/
export const useGetRooms = () => {
  const fetch = useFetch();
  return useCallback(
    (size: number, page: number) => {
      return fetch({
        url: `pgws/rest-api/room?size=${size}&page=${page}`,
        method: 'get',
      }) as Promise<PageData<RoomType>>;
    },
    [fetch],
  );
};

export const useGetRoomBadge = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgws/rest-api/room/badge`,
      method: 'get',
    }) as Promise<number>;
  }, [fetch]);
};

export const useGetRoomByUser = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number) => {
      return fetch({
        url: `pgws/rest-api/room/user/${userId}`,
        method: 'get',
      }) as Promise<RoomType>;
    },
    [fetch],
  );
};

export const useGetConsulationRoom = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgws/rest-api/room/consulation`,
      method: 'get',
    }) as Promise<RoomType>;
  }, [fetch]);
};

export const useGetRoomById = () => {
  const fetch = useFetch();
  return useCallback(
    (roomId: string) => {
      return fetch({
        url: `pgws/rest-api/room/${roomId}`,
        method: 'get',
      }) as Promise<RoomType>;
    },
    [fetch],
  );
};
//End of room
