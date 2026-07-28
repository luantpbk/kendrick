import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { MyNotificationType } from './models';

//Notification Api
export const useGetBadge = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/notification/badge/me`,
      method: 'get',
    }) as Promise<number>;
  }, [fetch]);
};

export const useGetNotification = () => {
  const fetch = useFetch();

  return useCallback(
    (size: number, page: number) => {
      return fetch({
        url: `pgcore/rest-api/notification/me?page=${page}&size=${size}`,
        method: 'get',
      }) as Promise<MyNotificationType>;
    },
    [fetch],
  );
};

export const useSeenNotification = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/notification/seen`,
      method: 'put',
    }) as Promise<number>;
  }, [fetch]);
};

export const useReadAllNotification = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/notification/read/all`,
      method: 'put',
    }) as Promise<number>;
  }, [fetch]);
};

export const useReadNotificationById = () => {
  const fetch = useFetch();
  return useCallback(
    (notificationId: number) => {
      return fetch({
        url: `pgcore/rest-api/notification/read/${notificationId}`,
        method: 'put',
      }) as Promise<number>;
    },
    [fetch],
  );
};
//End of sim
