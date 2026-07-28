import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, TranslationType } from './models';

/***********************************/
export const useGetTranslations = () => {
  const fetch = useFetch();
  return useCallback(
    (keyword: string, page: number, size: number) => {
      return fetch({
        url: `pgcore/rest-api/translation?keyword=${keyword ?? ''}&page=${page}&size=${size}`,
        method: 'get',
      }) as Promise<PageData<TranslationType>>;
    },
    [fetch],
  );
};

export const usePostTranslation = () => {
  const fetch = useFetch();
  return useCallback(
    (data: TranslationType) => {
      return fetch({
        url: 'pgcore/rest-api/translation',
        method: 'post',
        data: data,
      }) as Promise<TranslationType>;
    },
    [fetch],
  );
};

export const useGetTranslationById = () => {
  const fetch = useFetch();
  return useCallback(
    (translationId: number) => {
      return fetch({
        url: `pgcore/rest-api/translation/${translationId}`,
        method: 'get',
      }) as Promise<TranslationType>;
    },
    [fetch],
  );
};

export const usePutTranslation = () => {
  const fetch = useFetch();
  return useCallback(
    (data: TranslationType) => {
      return fetch({
        url: `pgcore/rest-api/translation`,
        method: 'put',
        data: data,
      }) as Promise<TranslationType>;
    },
    [fetch],
  );
};

export const useDeleteTranslation = () => {
  const fetch = useFetch();
  return useCallback(
    (translationId: number) => {
      return fetch({
        url: `pgcore/rest-api/translation/${translationId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGenerateFile = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/translation/generate`,
      method: 'get',
    }) as Promise<boolean>;
  }, [fetch]);
};
