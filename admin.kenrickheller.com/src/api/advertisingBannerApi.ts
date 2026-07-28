/************************************/
/********                    ********/
/******  Advertising Banner  ********/
/******   Writen by LuanPT      ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';

/***********************************/
export const useGetAdvertisingBanner = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/advertising-banner`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddAdvertisingBannerImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/advertising-banner`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteAdvertisingBannerImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/advertising-banner/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of advertising banner
