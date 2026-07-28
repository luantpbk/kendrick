/************************************/
/********                    ********/
/********    Guide Page    ********/
/******   Writen by LuanPT  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';
import { GuidePageType } from './models';

/***********************************/
export const useGetGuidePage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/guide-page`,
      method: 'get',
    }) as Promise<GuidePageType[]>;
  }, [fetch]);
};

export const usePostGuidePage = () => {
  const fetch = useFetch();
  return useCallback(
    (
      guidePageKey: string,
      guidePageTitle: string,
      guidePageValue: string,
      description: string,
      guideAvatar?: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/guide-page',
        method: 'post',
        data: {
          guidePageKey,
          guidePageTitle,
          guidePageValue,
          description,
          guideAvatar,
          displayOrder,
        },
      }) as Promise<GuidePageType>;
    },
    [fetch],
  );
};

export const useGetGuidePageById = () => {
  const fetch = useFetch();
  return useCallback(
    (guidePageId: number) => {
      return fetch({
        url: `pgcore/rest-api/guide-page/${guidePageId}`,
        method: 'get',
      }) as Promise<GuidePageType>;
    },
    [fetch],
  );
};

export const usePutGuidePage = () => {
  const fetch = useFetch();
  return useCallback(
    (
      guidePageId: number,
      guidePageKey: string,
      guidePageTitle: string,
      guidePageValue: string,
      description: string,
      guideAvatar?: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/guide-page`,
        method: 'put',
        data: {
          guidePageId,
          guidePageKey,
          guidePageTitle,
          guidePageValue,
          description,
          guideAvatar,
          displayOrder,
        },
      }) as Promise<GuidePageType>;
    },
    [fetch],
  );
};

export const useDeleteGuidePage = () => {
  const fetch = useFetch();
  return useCallback(
    (guidePageId: number) => {
      return fetch({
        url: `pgcore/rest-api/guide-page/${guidePageId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetGuidePageImage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/guide-page/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddGuidePageImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/guide-page/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteGuidePageImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/guide-page/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of guide page
