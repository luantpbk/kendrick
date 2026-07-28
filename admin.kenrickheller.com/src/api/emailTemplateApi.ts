/************************************/
/********                    ********/
/******     Email template    ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { EmailTemplateType, ImageType } from './models';

export const useGetEmailTemplate = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/email-template`,
      method: 'get',
    }) as Promise<EmailTemplateType[]>;
  }, [fetch]);
};

export const useGetEmailTemplateById = () => {
  const fetch = useFetch();
  return useCallback(
    (emailTemplateId: number) => {
      return fetch({
        url: `pgcore/rest-api/email-template/${emailTemplateId}`,
        method: 'get',
      }) as Promise<EmailTemplateType>;
    },
    [fetch],
  );
};

export const useGetEmailTemplateByKey = () => {
  const fetch = useFetch();
  return useCallback(
    (emailTemplateKey: string) => {
      return fetch({
        url: `pgcore/rest-api/function/email-template/key/${emailTemplateKey}`,
        method: 'get',
      }) as Promise<EmailTemplateType>;
    },
    [fetch],
  );
};

export const usePostEmailTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (emailTemplate: EmailTemplateType) => {
      return fetch({
        url: `pgcore/rest-api/email-template`,
        method: 'post',
        data: emailTemplate,
      }) as Promise<EmailTemplateType>;
    },
    [fetch],
  );
};

export const usePutEmailTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (emailTemplate: EmailTemplateType) => {
      return fetch({
        url: `pgcore/rest-api/email-template`,
        method: 'put',
        data: emailTemplate,
      }) as Promise<EmailTemplateType>;
    },
    [fetch],
  );
};

export const useDeleteEmailTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (emailTemplateId: number) => {
      return fetch({
        url: `pgcore/rest-api/email-template/${emailTemplateId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePostEmailTemplateImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/email-template/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useGetEmailTemplateImage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/email-template/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useDeleteEmailTemplateImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/email-template/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of email template
