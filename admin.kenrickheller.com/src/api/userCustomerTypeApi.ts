/************************************/
/********                    ********/
/****** user customer type     ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { BusinessType, UserCustomerType } from './models';

export const useGetUserCustomerType = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/user-customer-type`,
      method: 'get',
    }) as Promise<UserCustomerType[]>;
  }, [fetch]);
};

export const useGetUserCustomerTypeById = () => {
  const fetch = useFetch();
  return useCallback(
    (userCustomerTypeId: number) => {
      return fetch({
        url: `pgcore/rest-api/user-customer-type/${userCustomerTypeId}`,
        method: 'get',
      }) as Promise<UserCustomerType>;
    },
    [fetch],
  );
};

export const useDeleteUserCustomerType = () => {
  const fetch = useFetch();
  return useCallback(
    (userCustomerTypeId: number) => {
      return fetch({
        url: `pgcore/rest-api/user-customer-type/${userCustomerTypeId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePostUserCustomerType = () => {
  const fetch = useFetch();
  return useCallback(
    (userCustomerType: UserCustomerType) => {
      return fetch({
        url: `pgcore/rest-api/user-customer-type`,
        method: 'post',
        data: userCustomerType,
      }) as Promise<UserCustomerType>;
    },
    [fetch],
  );
};

export const usePutUserCustomerType = () => {
  const fetch = useFetch();
  return useCallback(
    (userCustomerType: UserCustomerType) => {
      return fetch({
        url: `pgcore/rest-api/user-customer-type`,
        method: 'put',
        data: userCustomerType,
      }) as Promise<UserCustomerType>;
    },
    [fetch],
  );
};

export const useGetBusinessTypeList = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/user-customer-type/business-type`,
      method: 'get',
    }) as Promise<BusinessType[]>;
  }, [fetch]);
};

export const useGetUserCustomerTypeByUserIdAndBusinessType = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number, businessType: number) => {
      return fetch({
        url: `pgcore/rest-api/user-customer-type/user/${userId}/business-type/${businessType}`,
        method: 'get',
      }) as Promise<UserCustomerType[]>;
    },
    [fetch],
  );
};

export const useGetUserCustomerTypeByDateAndBusinessType = () => {
  const fetch = useFetch();
  return useCallback(
    (date: string, businessType: number) => {
      const data = {
        date: date,
      };
      return fetch({
        url: `pgcore/rest-api/user-customer-type/business-type/${businessType}/date`,
        method: 'post',
        data: data,
      }) as Promise<BusinessType[]>;
    },
    [fetch],
  );
};
//End of user customer type
