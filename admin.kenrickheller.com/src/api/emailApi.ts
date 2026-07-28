/************************************/
/********                    ********/
/******         Email       ********/
/******   Writen by HuyLV       ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, EmailType } from './models';

export const useGetEmailList = () => {
  const fetch = useFetch();
  return useCallback(
    (page: number, size: number, keyword: string) => {
      return fetch({
        url: `pgcore/rest-api/email?page=${page}&size=${size}&keyword=${keyword}`,
        method: 'get',
      }) as Promise<PageData<EmailType>>;
    },
    [fetch],
  );
};
//End of email template
