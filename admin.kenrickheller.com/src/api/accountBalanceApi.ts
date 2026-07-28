/************************************/
/********                    ********/
/******   Account balance    ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/
import { AccountBalanceListType, AccountBalanceMoneyType, PageData } from 'src/api/models';
import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { AccountBalanceType } from './models';

export const useGetAccountBalanceHistory = () => {
  const fetch = useFetch();
  return useCallback(
    (
      keyword: string,
      page: number,
      size: number,
      userId: number,
      fromDate: string,
      toDate: string,
    ) => {
      const temp = {
        fromDate: fromDate,
        toDate: toDate,
      };
      return fetch({
        url: `pgcore/rest-api/account-balance/history?userId=${userId}&page=${page}&size=${size}&keyword=${keyword}`,
        method: 'post',
        data: temp,
      }) as Promise<PageData<AccountBalanceType>>;
    },
    [fetch],
  );
};

export const useGetAgencyAccountBalanceHistory = () => {
  const fetch = useFetch();
  return useCallback(
    (
      keyword: string,
      page: number,
      size: number,
      userId: number,
      fromDate: string,
      toDate: string,
    ) => {
      const temp = {
        fromDate: fromDate,
        toDate: toDate,
      };
      return fetch({
        url: `pgcore/rest-api/account-balance/history/me?keyword=${keyword}&page=${page}&size=${size}&userId=${userId}`,
        method: 'post',
        data: temp,
      }) as Promise<PageData<AccountBalanceType>>;
    },
    [fetch],
  );
};

export const useGetAccountBalanceHistoryById = () => {
  const fetch = useFetch();
  return useCallback(
    (accountHistoryId: number) => {
      return fetch({
        url: `pgcore/rest-api/account-balance/history/${accountHistoryId}`,
        method: 'get',
      }) as Promise<AccountBalanceType>;
    },
    [fetch],
  );
};

export const useGetAccountBalance = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number) => {
      return fetch({
        url: `pgcore/rest-api/account-balance/${userId}`,
        method: 'get',
      }) as Promise<number>;
    },
    [fetch],
  );
};

export const useGetAgencyAccountBalance = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/account-balance/me`,
      method: 'get',
    }) as Promise<number>;
  }, [fetch]);
};

export const useAddMoneyWallet = () => {
  const fetch = useFetch();
  return useCallback(
    (money: AccountBalanceMoneyType) => {
      return fetch({
        url: `pgcore/rest-api/account-balance/add-money`,
        method: 'post',
        data: money,
      }) as Promise<AccountBalanceMoneyType>;
    },
    [fetch],
  );
};

export const useDeductMoneyWallet = () => {
  const fetch = useFetch();
  return useCallback(
    (money: AccountBalanceMoneyType) => {
      return fetch({
        url: `pgcore/rest-api/account-balance/deduct-money`,
        method: 'post',
        data: money,
      }) as Promise<AccountBalanceMoneyType>;
    },
    [fetch],
  );
};

export const useGetAccountBalanceList = () => {
  const fetch = useFetch();
  return useCallback(
    (userIdList: number[]) => {
      return fetch({
        url: `pgcore/rest-api/account-balance`,
        method: 'post',
        data: userIdList,
      }) as Promise<PageData<AccountBalanceListType>>;
    },
    [fetch],
  );
};
//End of Account balance
