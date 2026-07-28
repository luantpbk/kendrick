/************************************/
/********                    ********/
/******      QR    ********/
/******   Writen by LuanPT      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';

export const useGetQRCode = () => {
  const fetch = useFetch(true, false, true, false);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/qr-code`,
        method: 'post',
        data: data,
      }) as Promise<Blob>;
    },
    [fetch],
  );
};

export const useReadQRCode = () => {
  const fetch = useFetch(true, true, false, true);
  return useCallback(
    (data: any) => {
      return fetch({
        url: `pgcore/rest-api/qr-code/parser`,
        method: 'post',
        data: data,
      }) as Promise<string>;
    },
    [fetch],
  );
};

//End of QR code
