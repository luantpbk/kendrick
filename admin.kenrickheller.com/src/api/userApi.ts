/************************************/
/********                    ********/
/******         User        ********/
/******   Writen by HuyLV      ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, ProfileInfo } from './models';

/***********************************/
export const useGetUserList = () => {
  const fetch = useFetch();
  return useCallback(
    (keyword: string, size?: number, page?: number) => {
      return fetch({
        url: `pgidm/rest-api/user/search?${keyword ? `&keyword=${keyword}` : ''}&${
          size ? `size=${size}` : ''
        }&${page ? `page=${page}` : ''}`,
        method: 'get',
      }) as Promise<PageData<ProfileInfo>>;
    },
    [fetch],
  );
};

export const useGetUserById = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number) => {
      return fetch({
        url: `pgidm/rest-api/user/id/${userId}`,
        method: 'get',
      }) as Promise<ProfileInfo>;
    },
    [fetch],
  );
};

//DONE
export const usePostUser = () => {
  const fetch = useFetch();
  return useCallback(
    (email: string, password: string, fullName: string) => {
      const data = {
        email: email,
        loginName: email,
        password: password,
        confirmPassword: password,
        fullName: fullName,
      };
      return fetch({
        url: `pgidm/rest-api/user`,
        method: 'post',
        data: data,
      }) as Promise<ProfileInfo>;
    },
    [fetch],
  );
};

export const usePutUser = () => {
  const fetch = useFetch();
  return useCallback(
    (user: ProfileInfo) => {
      return fetch({
        url: `pgidm/rest-api/user`,
        method: 'put',
        data: user,
      }) as Promise<ProfileInfo>;
    },
    [fetch],
  );
};

export const useChangeUserPassword = () => {
  const fetch = useFetch();
  return useCallback(
    (user: ProfileInfo) => {
      return fetch({
        url: `pgidm/rest-api/user/change-pass`,
        method: 'put',
        data: user,
      }) as Promise<ProfileInfo>;
    },
    [fetch],
  );
};

export const useDeleteUser = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number) => {
      return fetch({
        url: `pgidm/rest-api/user/id/${userId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

//End of user
