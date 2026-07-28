/************************************/
/********                    ********/
/******        File      ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';

export const usePostSheetExcel = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/file/excel/sheet`,
        method: 'post',
        data: data,
      }) as Promise<string[]>;
    },
    [fetch],
  );
};

export const useGetImages = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/file/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/file/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/file/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of File
