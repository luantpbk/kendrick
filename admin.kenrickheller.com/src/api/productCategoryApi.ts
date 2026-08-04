import { ImageType } from 'src/api/models';
/************************************/
/********                    ********/
/********      Category      ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import {
  ProductCategoryType,
  EnumDuplicateAction,
  ProductAttributeResultType,
  ProductCategoryAttributeType,
} from './models';

/***********************************/
export const useGetProductCategory = () => {
  const fetch = useFetch();
  return useCallback(
    (realmId?: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category${realmId ? '?realmId=' + realmId : ''}`,
        method: 'get',
      }) as Promise<ProductCategoryType[]>;
    },
    [fetch],
  );
};

export const useGetProductCategoryById = () => {
  const fetch = useFetch();
  return useCallback(
    (productCategoryId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}`,
        method: 'get',
      }) as Promise<ProductCategoryType>;
    },
    [fetch],
  );
};

export const usePostProductCategory = () => {
  const fetch = useFetch();
  return useCallback(
    (
      productRealmId: number,
      productCategoryCode: string,
      productCategoryName: string,
      displayOrder?: number,
      avatar?: number,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/product-category',
        method: 'post',
        data: {
          productRealmId,
          productCategoryCode,
          productCategoryName,
          displayOrder,
          avatar,
        },
      }) as Promise<ProductCategoryType>;
    },
    [fetch],
  );
};

export const usePutProductCategory = () => {
  const fetch = useFetch();
  return useCallback(
    (
      productCategoryId: number,
      productRealmId: number,
      productCategoryCode: string,
      productCategoryName: string,
      displayOrder: number,
      avatar?: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}`,
        method: 'put',
        data: {
          productCategoryId,
          productRealmId,
          productCategoryCode,
          productCategoryName,
          displayOrder,
          avatar,
        },
      }) as Promise<ProductCategoryType>;
    },
    [fetch],
  );
};

export const useDeleteProductCategory = () => {
  const fetch = useFetch();
  return useCallback(
    (productCategoryId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePutProductCategoryDisplayOption = () => {
  const fetch = useFetch();
  return useCallback(
    (productCategoryId: number, listConfig: ProductCategoryAttributeType[]) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}/config`,
        method: 'put',
        data: listConfig,
      }) as Promise<ProductCategoryAttributeType[]>;
    },
    [fetch],
  );
};

export const useGetProductCategoryDisplayOption = () => {
  const fetch = useFetch();
  return useCallback(
    (productCategoryId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}/config`,
        method: 'get',
      }) as Promise<ProductCategoryAttributeType[]>;
    },
    [fetch],
  );
};

export const useCopyProductCategoryDisplayOption = () => {
  const fetch = useFetch();
  return useCallback(
    (toId: number, fromId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${toId}/copy-config/${fromId}`,
        method: 'post',
        data: {},
      }) as Promise<ProductCategoryAttributeType[]>;
    },
    [fetch],
  );
};

export const useGetAttributeList = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product-category/attribute`,
      method: 'get',
    }) as Promise<ProductAttributeResultType[]>;
  }, [fetch]);
};

export const useDownLoadProductCategoryExcelTemplate = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product-category/file/import-template`,
      method: 'get',
    }) as Promise<Blob>;
  }, [fetch]);
};

export const useExportProductCategoryExcel = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product-category/file/export`,
      method: 'get',
    }) as Promise<Blob>;
  }, [fetch]);
};

export const useImportProductCategoryExcel = () => {
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
        url: `pgcore/rest-api/product-category/import?sheetName=${sheetName}&fromRowNum=${fromRowNum}&toRowNum=${toRowNum}&duplicateAction=${duplicateAction}`,
        method: 'post',
        data: file,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePostProductCategoryAvatar = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (file: any, productCategoryId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category/avatar/${productCategoryId}`,
        method: 'post',
        data: file,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};
//End of Category
