/************************************/
/********                    ********/
/****  Notification template  ******/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

//TODO
import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';
import { NotificationTemplateType } from './models';

export const useGetNotificationTemplate = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/notification-template`,
      method: 'get',
    }) as Promise<NotificationTemplateType[]>;
  }, [fetch]);
};

export const useGetNotificationTemplateById = () => {
  const fetch = useFetch();
  return useCallback(
    (notificationTemplateId: number) => {
      return fetch({
        url: `pgcore/rest-api/notification-template/${notificationTemplateId}`,
        method: 'get',
      }) as Promise<NotificationTemplateType>;
    },
    [fetch],
  );
};

export const useGetNotificationTemplateByKey = () => {
  const fetch = useFetch();
  return useCallback(
    (notificationTemplateKey: string) => {
      return fetch({
        url: `pgcore/rest-api/function/notification-template/key/${notificationTemplateKey}`,
        method: 'get',
      }) as Promise<NotificationTemplateType>;
    },
    [fetch],
  );
};

export const usePostNotificationTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (notificationTemplate: NotificationTemplateType) => {
      return fetch({
        url: `pgcore/rest-api/notification-template`,
        method: 'post',
        data: notificationTemplate,
      }) as Promise<NotificationTemplateType>;
    },
    [fetch],
  );
};

export const usePutNotificationTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (notificationTemplate: NotificationTemplateType) => {
      return fetch({
        url: `pgcore/rest-api/notification-template`,
        method: 'put',
        data: notificationTemplate,
      }) as Promise<NotificationTemplateType>;
    },
    [fetch],
  );
};

export const useDeleteNotificationTemplate = () => {
  const fetch = useFetch();
  return useCallback(
    (notificationTemplateId: number) => {
      return fetch({
        url: `pgcore/rest-api/notification-template/${notificationTemplateId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePostNotificationTemplateImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/notification-template/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useGetNotificationTemplateImage = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/notification-template/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useDeleteNotificationTemplateImage = () => {
  const fetch = useFetch();
  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/notification-template/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of notification template
