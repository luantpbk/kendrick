/************************************/
/********                    ********/
/******    Company image     ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';

/***********************************/
export const useGetCompanyImage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/company-image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddCompanyImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/company-image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteCompanyImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/company-image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of company image
