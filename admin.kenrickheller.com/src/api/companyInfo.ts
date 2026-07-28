/************************************/
/********                    ********/
/********    Company info    ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { CompanyInfoType } from './models';

/***********************************/
export const useGetCompanyInfo = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/company-info`,
      method: 'get',
    }) as Promise<CompanyInfoType[]>;
  }, [fetch]);
};

export const usePostCompanyInfo = () => {
  const fetch = useFetch();
  return useCallback(
    (
      companyInfoKey: string,
      companyInfoTitle: string,
      companyInfoValue: string,
      href?: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/company-info',
        method: 'post',
        data: {
          companyInfoKey,
          companyInfoTitle,
          companyInfoValue,
          href,
          displayOrder,
        },
      }) as Promise<CompanyInfoType>;
    },
    [fetch],
  );
};

export const useGetCompanyInfoById = () => {
  const fetch = useFetch();
  return useCallback(
    (companyInfoId: number) => {
      return fetch({
        url: `pgcore/rest-api/company-info/${companyInfoId}`,
        method: 'get',
      }) as Promise<CompanyInfoType>;
    },
    [fetch],
  );
};

export const usePutCompanyInfo = () => {
  const fetch = useFetch();
  return useCallback(
    (
      companyInfoId: number,
      companyInfoKey: string,
      companyInfoTitle: string,
      companyInfoValue: any,
      href?: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/company-info`,
        method: 'put',
        data: {
          companyInfoId,
          companyInfoKey,
          companyInfoTitle,
          companyInfoValue,
          href,
          displayOrder,
        },
      }) as Promise<CompanyInfoType>;
    },
    [fetch],
  );
};

export const useDeleteCompanyInfo = () => {
  const fetch = useFetch();
  return useCallback(
    (companyInfoId: number) => {
      return fetch({
        url: `pgcore/rest-api/company-info/${companyInfoId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of company info
