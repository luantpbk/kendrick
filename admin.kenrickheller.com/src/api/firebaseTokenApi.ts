import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { FirebaseTokenType } from './models';

//Firebase token Api
export const useInsertFirebaseToken = () => {
  const fetch = useFetch(true);

  return useCallback(
    (fcmToken: string, accessToken: string) => {
      const body = {
        deviceId: fcmToken,
        firebaseToken: fcmToken,
      };
      console.log('access token ' + accessToken);
      return fetch({
        url: `pgcore/rest-api/firebase-token`,
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: body,
      }) as Promise<FirebaseTokenType>;
    },
    [fetch],
  );
};

export const useDeleteFirebaseToken = () => {
  const fetch = useFetch();

  return useCallback(
    (token: string) => {
      return fetch({
        url: `pgcore/rest-api/firebase-token/${token}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

//End of firebase token
