import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ImageType } from './models';

export const useGetAdvertisingBanner = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/advertising-banner`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};
