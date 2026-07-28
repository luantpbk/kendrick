/************************************/
/********                    ********/
/******       Store      ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { StoreType } from './models';

export const useGetStore = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/store`,
      method: 'get',
    }) as Promise<StoreType[]>;
  }, [fetch]);
};

export const useGetStoreById = () => {
  const fetch = useFetch();
  return useCallback(
    (storeId: number) => {
      return fetch({
        url: `pgcore/rest-api/store/${storeId}`,
        method: 'get',
      }) as Promise<StoreType>;
    },
    [fetch],
  );
};

export const useGetStoreByCode = () => {
  const fetch = useFetch();
  return useCallback(
    (storeCode: string) => {
      return fetch({
        url: `pgcore/rest-api/store/code/${storeCode}`,
        method: 'get',
      }) as Promise<StoreType>;
    },
    [fetch],
  );
};

export const usePostStore = () => {
  const fetch = useFetch();
  return useCallback(
    (store: StoreType) => {
      return fetch({
        url: `pgcore/rest-api/store`,
        method: 'post',
        data: store,
      }) as Promise<StoreType>;
    },
    [fetch],
  );
};

export const usePutStore = () => {
  const fetch = useFetch();
  return useCallback(
    (store: StoreType) => {
      return fetch({
        url: `pgcore/rest-api/store`,
        method: 'put',
        data: store,
      }) as Promise<StoreType>;
    },
    [fetch],
  );
};

export const useDeleteStore = () => {
  const fetch = useFetch();
  return useCallback(
    (storeId: number) => {
      return fetch({
        url: `pgcore/rest-api/store/${storeId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

//End of  Store
