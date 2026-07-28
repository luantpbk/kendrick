/************************************/
/********                    ********/
/******       Parameter    ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ParameterEnumType, ParameterType } from './models';

export const useGetParameterEnum = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/parameter/enum`,
      method: 'get',
    }) as Promise<ParameterEnumType[]>;
  }, [fetch]);
};

export const useGetParameter = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/parameter`,
      method: 'get',
    }) as Promise<ParameterType[]>;
  }, [fetch]);
};

export const useGetParameterByDate = () => {
  const fetch = useFetch();
  return useCallback(
    (date: string) => {
      const temp = {
        date: date,
      };
      return fetch({
        url: `pgcore/rest-api/parameter/date`,
        method: 'post',
        data: temp,
      }) as Promise<ParameterType[]>;
    },
    [fetch],
  );
};

export const useGetParameterByKey = () => {
  const fetch = useFetch();
  return useCallback(
    (parameterKey: string) => {
      return fetch({
        url: `pgcore/rest-api/parameter/parameter-key/${parameterKey}`,
        method: 'get',
      }) as Promise<ParameterType[]>;
    },
    [fetch],
  );
};

export const useGetParameterById = () => {
  const fetch = useFetch();
  return useCallback(
    (parameterId: number) => {
      return fetch({
        url: `pgcore/rest-api/parameter/${parameterId}`,
        method: 'get',
      }) as Promise<ParameterType>;
    },
    [fetch],
  );
};

export const usePostParameter = () => {
  const fetch = useFetch();
  return useCallback(
    (parameter: ParameterType) => {
      return fetch({
        url: `pgcore/rest-api/parameter`,
        method: 'post',
        data: parameter,
      }) as Promise<ParameterType>;
    },
    [fetch],
  );
};

export const usePutParameter = () => {
  const fetch = useFetch();
  return useCallback(
    (parameter: ParameterType) => {
      return fetch({
        url: `pgcore/rest-api/parameter`,
        method: 'put',
        data: parameter,
      }) as Promise<ParameterType>;
    },
    [fetch],
  );
};

export const useDeleteParameter = () => {
  const fetch = useFetch();
  return useCallback(
    (parameterId: number) => {
      return fetch({
        url: `pgcore/rest-api/parameter/${parameterId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

//End of Parameter
