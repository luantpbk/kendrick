/************************************/
/********                    ********/
/********    Static Page    ********/
/******   Writen by LuanPT  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { StaticPageType, ImageType } from './models';

/***********************************/
export const useGetStaticPage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/static-page`,
      method: 'get',
    }) as Promise<StaticPageType[]>;
  }, [fetch]);
};

export const usePostStaticPage = () => {
  const fetch = useFetch();
  return useCallback(
    (data: StaticPageType) => {
      return fetch({
        url: 'pgcore/rest-api/static-page',
        method: 'post',
        data: data,
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const useGetStaticPageByKey = () => {
  const fetch = useFetch();
  return useCallback(
    (key: string) => {
      return fetch({
        url: `pgcore/rest-api/static-page/key/${key}`,
        method: 'get',
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const useGetStaticPageById = () => {
  const fetch = useFetch();
  return useCallback(
    (staticPageId: number) => {
      return fetch({
        url: `pgcore/rest-api/static-page/${staticPageId}`,
        method: 'get',
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const usePutStaticPage = () => {
  const fetch = useFetch();
  return useCallback(
    (data: StaticPageType) => {
      return fetch({
        url: `pgcore/rest-api/static-page`,
        method: 'put',
        data: data,
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const useDeleteStaticPage = () => {
  const fetch = useFetch();
  return useCallback(
    (staticPageId: number) => {
      return fetch({
        url: `pgcore/rest-api/static-page/${staticPageId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

//End of static page
