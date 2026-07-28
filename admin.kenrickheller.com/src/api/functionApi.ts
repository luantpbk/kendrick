/************************************/
/********                    ********/
/******      Function       ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { FunctionType, RolePermisionType } from './models';

export const useGetFunctionById = () => {
  const fetch = useFetch();
  return useCallback(
    (functionId: number) => {
      return fetch({
        url: `pgidm/rest-api/function/${functionId}`,
        method: 'get',
      }) as Promise<FunctionType>;
    },
    [fetch],
  );
};

export const useGetFunctionListByModuleId = () => {
  const fetch = useFetch();
  return useCallback(
    (moduleId: number) => {
      return fetch({
        url: `pgidm/rest-api/function/module/${moduleId}`,
        method: 'get',
      }) as Promise<FunctionType[]>;
    },
    [fetch],
  );
};

export const useGetFunctionByUserId = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number) => {
      return fetch({
        url: `pgidm/rest-api/user/${userId}/role-function`,
        method: 'get',
      }) as Promise<RolePermisionType[]>;
    },
    [fetch],
  );
};

export const usePostFunction = () => {
  const fetch = useFetch();
  return useCallback(
    (f: FunctionType) => {
      return fetch({
        url: `pgidm/rest-api/function`,
        method: 'post',
        data: f,
      }) as Promise<FunctionType>;
    },
    [fetch],
  );
};

export const usePutFunction = () => {
  const fetch = useFetch();
  return useCallback(
    (f: FunctionType) => {
      return fetch({
        url: `pgidm/rest-api/function`,
        method: 'put',
        data: f,
      }) as Promise<FunctionType>;
    },
    [fetch],
  );
};

export const useDeleteFunction = () => {
  const fetch = useFetch();
  return useCallback(
    (functionId: number) => {
      return fetch({
        url: `pgidm/rest-api/function/${functionId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of function
