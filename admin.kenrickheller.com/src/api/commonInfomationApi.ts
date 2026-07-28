/************************************/
/********                    ********/
/******    Common info        ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { ShipInfoType } from './models';

export const useGetShipInfoByZipcode = () => {
  const fetch = useFetch();
  return useCallback(
    (zipcode: string) => {
      return fetch({
        url: `pgcore/rest-api/common-infomation/ship-info?zipcode=${zipcode}`,
        method: 'get',
      }) as Promise<ShipInfoType>;
    },
    [fetch],
  );
};

export const useGetExchangeRate = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/common-infomation/exchange-rate`,
      method: 'get',
    }) as Promise<number>;
  }, [fetch]);
};

//End of common infomation
