import { EnumDuplicateAction } from 'src/api/models';
/************************************/
/********                    ********/
/********         Realm      ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { RealmType } from './models';

/***********************************/
export const useGetProductRealm = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product-realm`,
      method: 'get',
    }) as Promise<RealmType[]>;
  }, [fetch]);
};

export const useGetProductRealmById = () => {
  const fetch = useFetch();
  return useCallback(
    (productRealmId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-realm/${productRealmId}`,
        method: 'get',
        data: {
          productRealmId,
        },
      }) as Promise<RealmType>;
    },
    [fetch],
  );
};

export const usePostProductRealm = () => {
  const fetch = useFetch();
  return useCallback(
    (
      productRealmCode: string,
      productRealmName: string,
      description: string,
      displayOrder?: number,
      isHidden?: boolean,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/product-realm',
        method: 'post',
        data: {
          productRealmCode: productRealmCode,
          productRealmName: productRealmName,
          description: description,
          displayOrder: displayOrder,
          isHidden: isHidden,
        },
      }) as Promise<RealmType>;
    },
    [fetch],
  );
};

export const usePutProductRealm = () => {
  const fetch = useFetch();
  return useCallback(
    (
      productRealmId: number,
      productRealmCode: string,
      productRealmName: string,
      description: string,
      displayOrder?: number,
      isHidden?: boolean,
    ) => {
      return fetch({
        url: `pgcore/rest-api/product-realm`,
        method: 'put',
        data: {
          productRealmId: productRealmId,
          productRealmCode: productRealmCode,
          productRealmName: productRealmName,
          description: description,
          displayOrder: displayOrder,
          isHidden: isHidden,
        },
      }) as Promise<RealmType>;
    },
    [fetch],
  );
};

export const useDeleteProductRealm = () => {
  const fetch = useFetch();
  return useCallback(
    (productRealmId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-realm/${productRealmId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useDownLoadProductRealmExcelTemplate = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product-realm/file/import-template`,
      method: 'get',
    }) as Promise<Blob>;
  }, [fetch]);
};

export const useExportProductRealmExcel = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product-realm/file/export`,
      method: 'get',
    }) as Promise<Blob>;
  }, [fetch]);
};

export const useImportProductRealmExcel = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (
      file: any,
      sheetName: string,
      fromRowNum: number,
      toRowNum: number,
      duplicateAction: EnumDuplicateAction,
    ) => {
      return fetch({
        url: `pgcore/rest-api/product-realm/import?sheetName=${sheetName}&fromRowNum=${fromRowNum}&toRowNum=${toRowNum}&duplicateAction=${duplicateAction}`,
        method: 'post',
        data: file,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of Realm
