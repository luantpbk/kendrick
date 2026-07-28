/************************************/
/********                    ********/
/******    customer type     ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { CustomerType } from './models';

export const useGetCustomerType = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/customer-type`,
      method: 'get',
    }) as Promise<CustomerType[]>;
  }, [fetch]);
};

export const useGetCustomerTypeById = () => {
  const fetch = useFetch();
  return useCallback(
    (customerTypeId: number) => {
      return fetch({
        url: `pgcore/rest-api/customer-type/${customerTypeId}`,
        method: 'get',
      }) as Promise<CustomerType>;
    },
    [fetch],
  );
};

export const usePostCustomerType = () => {
  const fetch = useFetch();
  return useCallback(
    (customerType: CustomerType) => {
      return fetch({
        url: `pgcore/rest-api/customer-type`,
        method: 'post',
        data: customerType,
      }) as Promise<CustomerType>;
    },
    [fetch],
  );
};

export const usePutCustomerType = () => {
  const fetch = useFetch();
  return useCallback(
    (customerType: CustomerType) => {
      return fetch({
        url: `pgcore/rest-api/customer-type`,
        method: 'put',
        data: customerType,
      }) as Promise<CustomerType>;
    },
    [fetch],
  );
};

export const useDeleteCustomerType = () => {
  const fetch = useFetch();
  return useCallback(
    (customerTypeId: number) => {
      return fetch({
        url: `pgcore/rest-api/customer-type/${customerTypeId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of user customer type
