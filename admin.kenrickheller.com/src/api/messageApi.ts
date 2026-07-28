/************************************/
/********                    ********/
/******        Message       ********/
/******   Writen by LuanPT      ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, MessageType } from './models';

/***********************************/
export const useGetMessages = () => {
  const fetch = useFetch();
  return useCallback(
    (roomId: string, size: number, page: number) => {
      return fetch({
        url: `pgws/rest-api/message/${roomId}?size=${size}&page=${page}`,
        method: 'get',
      }) as Promise<PageData<MessageType>>;
    },
    [fetch],
  );
};

export const useGetLastestMessages = () => {
  const fetch = useFetch();
  return useCallback(
    (roomIds: string[]) => {
      return fetch({
        url: `pgws/rest-api/message/lastest/`,
        method: 'post',
        data: roomIds,
      }) as Promise<{ [roomId: string]: MessageType }>;
    },
    [fetch],
  );
};

//End of Message
