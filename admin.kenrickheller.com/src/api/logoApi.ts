/************************************/
/********                    ********/
/******       Logo       ********/
/******   Writen by LuanPT      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';

export const useGetLogos = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/logo`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useGetLogo = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/logo/final`,
      method: 'get',
    }) as Promise<ImageType>;
  }, [fetch]);
};

export const useAddLogoImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/logo`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteLogoImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/logo/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of logo
