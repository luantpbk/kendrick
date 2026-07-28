import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ApiType, MapApiType } from './models';

/************************************/
/********                    ********/
/******     API Service      ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

export const useGetApi = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgidm/rest-api/api`,
      method: 'get',
    }) as Promise<ApiType[]>;
  }, [fetch]);
};

export const useGetApiById = () => {
  const fetch = useFetch();
  return useCallback(
    (apiId: number) => {
      return fetch({
        url: `pgidm/rest-api/api/${apiId}`,
        method: 'get',
      }) as Promise<ApiType>;
    },
    [fetch],
  );
};

export const usePostApi = () => {
  const fetch = useFetch();
  return useCallback(
    (api: ApiType) => {
      return fetch({
        url: `pgidm/rest-api/api`,
        method: 'post',
        data: api,
      }) as Promise<ApiType>;
    },
    [fetch],
  );
};

export const usePutApi = () => {
  const fetch = useFetch();
  return useCallback(
    (api: ApiType) => {
      return fetch({
        url: `pgidm/rest-api/api`,
        method: 'put',
        data: api,
      }) as Promise<ApiType>;
    },
    [fetch],
  );
};

export const useDeleteApi = () => {
  const fetch = useFetch();
  return useCallback(
    (apiId: number) => {
      return fetch({
        url: `pgidm/rest-api/api/${apiId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useMapApiToFunction = () => {
  const fetch = useFetch();
  return useCallback(
    (apiId: number, functionId: number, displayOrder?: number) => {
      const temp = {
        displayOrder: displayOrder,
        apiId: apiId,
        functionId: functionId,
      };
      return fetch({
        url: `pgidm/rest-api/api/${apiId}/function/${functionId}`,
        method: 'post',
        data: temp,
      }) as Promise<MapApiType>;
    },
    [fetch],
  );
};

export const useRemoveFunction = () => {
  const fetch = useFetch();
  return useCallback(
    (apiId: number, functionId: number) => {
      return fetch({
        url: `pgidm/rest-api/api/${apiId}/function/${functionId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetFunctionByApiId = () => {
  const fetch = useFetch();
  return useCallback(
    (apiId: number) => {
      return fetch({
        url: `pgidm/rest-api/api/${apiId}/function`,
        method: 'get',
      }) as Promise<ApiType[]>;
    },
    [fetch],
  );
};
//End of API Service
