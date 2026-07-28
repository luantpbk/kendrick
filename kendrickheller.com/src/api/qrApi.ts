/************************************/
/********                    ********/
/******      QR    ********/
/******   Writen by LuanPT      ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';

export const useReadQRCode = () => {
  const fetch = useFetch(true, true, true);
  return useCallback(
    (data) => {
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
