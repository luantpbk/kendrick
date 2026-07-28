/************************************/
/********                    ********/
/******      Module       ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ModuleType } from './models';

export const useGetModule = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgidm/rest-api/module`,
      method: 'get',
    }) as Promise<ModuleType[]>;
  }, [fetch]);
};

export const useGetModuleById = () => {
  const fetch = useFetch();
  return useCallback(
    (moduleId: number) => {
      return fetch({
        url: `pgidm/rest-api/module/${moduleId}`,
        method: 'get',
      }) as Promise<ModuleType>;
    },
    [fetch],
  );
};

export const usePostModule = () => {
  const fetch = useFetch();
  return useCallback(
    (module: ModuleType) => {
      return fetch({
        url: `pgidm/rest-api/module`,
        method: 'post',
        data: module,
      }) as Promise<ModuleType>;
    },
    [fetch],
  );
};

export const usePutModule = () => {
  const fetch = useFetch();
  return useCallback(
    (module: ModuleType) => {
      return fetch({
        url: `pgidm/rest-api/module`,
        method: 'put',
        data: module,
      }) as Promise<ModuleType>;
    },
    [fetch],
  );
};

export const useDeleteModule = () => {
  const fetch = useFetch();
  return useCallback(
    (moduleId: number) => {
      return fetch({
        url: `pgidm/rest-api/module/${moduleId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of module
