/************************************/
/********                    ********/
/******       Service      ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ServiceType } from './models';

export const useGetAllService = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/service`,
      method: 'get',
    }) as Promise<ServiceType[]>;
  }, [fetch]);
};

export const useGetServiceById = () => {
  const fetch = useFetch();
  return useCallback(
    (serviceId: number) => {
      return fetch({
        url: `pgcore/rest-api/service/${serviceId}`,
        method: 'get',
      }) as Promise<ServiceType>;
    },
    [fetch],
  );
};

export const usePostService = () => {
  const fetch = useFetch();
  return useCallback(
    (service: ServiceType) => {
      return fetch({
        url: `pgcore/rest-api/service`,
        method: 'post',
        data: service,
      }) as Promise<ServiceType>;
    },
    [fetch],
  );
};

export const usePutService = () => {
  const fetch = useFetch();
  return useCallback(
    (_service: ServiceType) => {
      return fetch({
        url: `pgcore/rest-api/service`,
        method: 'put',
        data: _service,
      }) as Promise<ServiceType>;
    },
    [fetch],
  );
};

export const useDeleteService = () => {
  const fetch = useFetch();
  return useCallback(
    (serviceId: number) => {
      return fetch({
        url: `pgcore/rest-api/service/${serviceId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of service
