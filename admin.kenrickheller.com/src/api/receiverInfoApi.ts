/************************************/
/********                    ********/
/******      Receiver info    ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, ReceiverInfoType } from './models';

export const useGetReceiverInfo = () => {
  const fetch = useFetch();
  return useCallback(
    (page: number, size: number, keyword: string, userId: number) => {
      return fetch({
        url: `pgcore/rest-api/receiver-info?page=${page}&size=${size}&keyword=${keyword}${
          userId ? `&userId=${userId}` : ''
        }`,
        method: 'get',
      }) as Promise<PageData<ReceiverInfoType>>;
    },
    [fetch],
  );
};

export const useGetMyReceiverInfo = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/receiver-info/me`,
      method: 'get',
    }) as Promise<ReceiverInfoType[]>;
  }, [fetch]);
};

export const useGetReceiverInfoById = () => {
  const fetch = useFetch();
  return useCallback(
    (receiverInfoId: number) => {
      return fetch({
        url: `pgcore/rest-api/receiver-info/${receiverInfoId}`,
        method: 'get',
      }) as Promise<ReceiverInfoType>;
    },
    [fetch],
  );
};

export const useGetMyReceiverInfoById = () => {
  const fetch = useFetch();
  return useCallback(
    (receiverInfoId: number) => {
      return fetch({
        url: `pgcore/rest-api/receiver-info/me/${receiverInfoId}`,
        method: 'get',
      }) as Promise<ReceiverInfoType>;
    },
    [fetch],
  );
};

export const usePostReceiverInfo = () => {
  const fetch = useFetch();
  return useCallback(
    (receiverInfo: ReceiverInfoType) => {
      return fetch({
        url: `pgcore/rest-api/receiver-info`,
        method: 'post',
        data: receiverInfo,
      }) as Promise<ReceiverInfoType>;
    },
    [fetch],
  );
};

export const usePutReceiverInfo = () => {
  const fetch = useFetch();
  return useCallback(
    (receiverInfo: ReceiverInfoType) => {
      return fetch({
        url: `pgcore/rest-api/receiver-info`,
        method: 'put',
        data: receiverInfo,
      }) as Promise<ReceiverInfoType>;
    },
    [fetch],
  );
};

export const useDeleteReceiverInfo = () => {
  const fetch = useFetch();
  return useCallback(
    (receiverInfoId: number) => {
      return fetch({
        url: `pgcore/rest-api/receiver-info/${receiverInfoId}`,
        method: 'put',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useDeleteSim = () => {
  const fetch = useFetch();
  return useCallback(
    (simId: number) => {
      return fetch({
        url: `pgcore/rest-api/sim/${simId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of receiver info
