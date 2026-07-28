import { PageData } from 'src/api/models';
/************************************/
/********                    ********/
/******   purchaseAccount    ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PurchaseAccountType } from './models';

export const useGetAdminPurchaseAccount = () => {
  const fetch = useFetch();
  return useCallback(
    (keyword: string, page: number, size: number, userId: number | string) => {
      return fetch({
        url: `pgcore/rest-api/purchase-account?page=${page}&size=${size}${
          keyword && keyword != '' ? `&keyword=${keyword}` : ''
        }${userId ? `&userId=${userId}` : ''}`,
        method: 'get',
      }) as Promise<PageData<PurchaseAccountType>>;
    },
    [fetch],
  );
};

export const useGetMyPurchaseAccount = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/purchase-account/me`,
      method: 'get',
    }) as Promise<PageData<PurchaseAccountType>>;
  }, [fetch]);
};

export const useGetMyPurchaseAccountById = () => {
  const fetch = useFetch();
  return useCallback(
    (purchaseAccountId: number) => {
      return fetch({
        url: `pgcore/rest-api/purchase-account/me${purchaseAccountId}`,
        method: 'get',
      }) as Promise<PurchaseAccountType>;
    },
    [fetch],
  );
};

export const useGetPurchaseAccountById = () => {
  const fetch = useFetch();
  return useCallback(
    (purchaseAccountId: number) => {
      return fetch({
        url: `pgcore/rest-api/purchase-account/${purchaseAccountId}`,
        method: 'get',
      }) as Promise<PurchaseAccountType>;
    },
    [fetch],
  );
};

export const usePostPurchaseAccount = () => {
  const fetch = useFetch();
  return useCallback(
    (purchaseAccount: PurchaseAccountType) => {
      return fetch({
        url: `pgcore/rest-api/purchase-account`,
        method: 'post',
        data: purchaseAccount,
      }) as Promise<PurchaseAccountType>;
    },
    [fetch],
  );
};

export const usePutPurchaseAccount = () => {
  const fetch = useFetch();
  return useCallback(
    (purchaseAccount: PurchaseAccountType) => {
      return fetch({
        url: `pgcore/rest-api/purchase-account`,
        method: 'put',
        data: purchaseAccount,
      }) as Promise<PurchaseAccountType>;
    },
    [fetch],
  );
};

export const useDeletePurchaseAccount = () => {
  const fetch = useFetch();
  return useCallback(
    (purchaseAccountId: number) => {
      return fetch({
        url: `pgcore/rest-api/purchase-account/${purchaseAccountId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of purchaseAccount
