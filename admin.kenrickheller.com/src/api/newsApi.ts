/************************************/
/********                    ********/
/********        News        ********/
/******   Writen by LuanPT  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, NewsType, ImageType, CommentType } from './models';

/***********************************/
export const useGetNews = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/news`,
      method: 'get',
    }) as Promise<PageData<NewsType>>;
  }, [fetch]);
};

export const usePostNews = () => {
  const fetch = useFetch();
  return useCallback(
    (
      newTitle: string,
      newValue: string,
      newAvatar: string,
      description: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/news',
        method: 'post',
        data: {
          newTitle,
          newValue,
          newAvatar,
          description,
          displayOrder,
        },
      }) as Promise<NewsType>;
    },
    [fetch],
  );
};

export const useGetNewsById = () => {
  const fetch = useFetch();
  return useCallback(
    (newId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/${newId}`,
        method: 'get',
      }) as Promise<NewsType>;
    },
    [fetch],
  );
};

export const usePutNews = () => {
  const fetch = useFetch();
  return useCallback(
    (
      newId: number,
      newTitle: string,
      newValue: string,
      newAvatar: string,
      description: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/news`,
        method: 'put',
        data: {
          newId,
          newTitle,
          newValue,
          newAvatar,
          description,
          displayOrder,
        },
      }) as Promise<NewsType>;
    },
    [fetch],
  );
};

export const useDeleteNews = () => {
  const fetch = useFetch();
  return useCallback(
    (staticPageId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/${staticPageId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetNewsImage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/news/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddNewsImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/news/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteNewsImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetAllComment = () => {
  const fetch = useFetch();
  return useCallback(
    (newsId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/${newsId}/comment`,
        method: 'get',
      }) as Promise<CommentType[]>;
    },
    [fetch],
  );
};

export const useGetCommentByCommentId = () => {
  const fetch = useFetch();
  return useCallback(
    (commentId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/parent/${commentId}/comment`,
        method: 'get',
      }) as Promise<CommentType[]>;
    },
    [fetch],
  );
};

export const usePostNewComment = () => {
  const fetch = useFetch();
  return useCallback(
    (comment: CommentType) => {
      return fetch({
        url: `pgcore/rest-api/news/comment`,
        method: 'post',
        data: comment,
      }) as Promise<CommentType>;
    },
    [fetch],
  );
};

//End of news
