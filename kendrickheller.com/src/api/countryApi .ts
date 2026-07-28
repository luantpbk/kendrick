import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { CountryType } from './models';

export const useGetCountries = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/country`,
      method: 'get',
    }) as Promise<CountryType[]>;
  }, [fetch]);
};

//End of receiver info
