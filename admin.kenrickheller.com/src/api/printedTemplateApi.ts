/************************************/
/********                   ********/
/******   Printed template  ********/
/******   Writen by LuanPT      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PrintedTemplateType, ImageType } from './models';

export const useGetPrintedTemplate = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/printed-template`,
      method: 'get',
    }) as Promise<PrintedTemplateType[]>;
  }, [fetch]);
};

export const useGetPrintedTemplateById = () => {
  const fetch = useFetch();
  return useCallback(
    (printedTemplateId: number) => {
      return fetch({
        url: `pgcore/rest-api/printed-template/${printedTemplateId}`,
        method: 'get',
      }) as Promise<PrintedTemplateType>;
    },
    [fetch],
  );
};

export const useGetPrintedTemplateByKey = () => {
  const fetch = useFetch();
  return useCallback(
    (printedTemplateKey: string) => {
      return fetch({
        url: `pgcore/rest-api/function/printed-template/key/${printedTemplateKey}`,
        method: 'get',
      }) as Promise<PrintedTemplateType>;
    },
    [fetch],
  );
};

export const usePostPrintedTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (printedTemplate: PrintedTemplateType) => {
      return fetch({
        url: `pgcore/rest-api/printed-template`,
        method: 'post',
        data: printedTemplate,
      }) as Promise<PrintedTemplateType>;
    },
    [fetch],
  );
};

export const usePutPrintedTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (printedTemplate: PrintedTemplateType) => {
      return fetch({
        url: `pgcore/rest-api/printed-template`,
        method: 'put',
        data: printedTemplate,
      }) as Promise<PrintedTemplateType>;
    },
    [fetch],
  );
};

export const useDeletePrintedTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (printedTemplateId: number) => {
      return fetch({
        url: `pgcore/rest-api/printed-template/${printedTemplateId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePostPrintedTemplateImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/printed-template/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useGetPrintedTemplateImage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/printed-template/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useDeletePrintedTemplateImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/printed-template/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of printed template
