/************************************/
/********                    ********/
/******       Banner       ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';

/***********************************/
export const useGetBanner = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/banner`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddBannerImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/banner`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteBannerImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/banner/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of banner
