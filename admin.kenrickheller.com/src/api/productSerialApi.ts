/************************************/
/********                    ********/
/******   Product Serial     ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { PageData, ProductSerialType, ImageType, EnumDuplicateAction } from './models';

/***********************************/
export const useGetProductSerial = () => {
  const fetch = useFetch();
  return useCallback(
    (productId: number, keyword: string, page: number, size: number, status: number) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/product/${productId}?${
          keyword !== null ? 'keyword=' + keyword + '&' : ''
        }page=${page}&size=${size}${
          status !== 0 ? (status === 1 ? '&status=1' : '&status=2') : ''
        }`,
        method: 'get',
      }) as Promise<PageData<ProductSerialType>>;
    },
    [fetch],
  );
};

export const usePostProductSerial = () => {
  const fetch = useFetch();
  return useCallback(
    (productSerial: ProductSerialType) => {
      return fetch({
        url: `pgcore/rest-api/product-serial`,
        method: 'post',
        data: productSerial,
      }) as Promise<ProductSerialType>;
    },
    [fetch],
  );
};

export const useGetProductSerialById = () => {
  const fetch = useFetch();
  return useCallback(
    (productSerialId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/${productSerialId}`,
        method: 'get',
      }) as Promise<ProductSerialType>;
    },
    [fetch],
  );
};

export const usePutProductSerial = () => {
  const fetch = useFetch();
  return useCallback(
    (productSerial: ProductSerialType) => {
      return fetch({
        url: 'pgcore/rest-api/product-serial',
        method: 'put',
        data: productSerial,
      }) as Promise<ProductSerialType>;
    },
    [fetch],
  );
};

export const useUpdateProductSerialAvatar = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (id: number, data: any) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/avatar/${id}`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useAddProducSerialImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (id: number, data: any) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/image/${id}`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteProductSerialImage = () => {
  const fetch = useFetch();
  return useCallback(
    (productSerialId: number, fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/${productSerialId}/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useDeleteProductSerial = () => {
  const fetch = useFetch();
  return useCallback(
    (productSerialId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/${productSerialId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useSellProductSerial = () => {
  const fetch = useFetch();
  return useCallback(
    (productSerialId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/${productSerialId}/sell`,
        method: 'put',
        data: {
          productSerialId,
        },
      }) as Promise<ProductSerialType>;
    },
    [fetch],
  );
};

export const useDownLoadProductSerialExcelTemplate = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(
    (productId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/file/import-template?productId=${productId}`,
        method: 'get',
      }) as Promise<Blob>;
    },
    [fetch],
  );
};

export const useExportProductSerialExcel = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(
    (productId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/file/export?productId=${productId}`,
        method: 'get',
      }) as Promise<Blob>;
    },
    [fetch],
  );
};

export const useImportProductSerialExcel = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (
      file: any,
      sheetName: string,
      fromRowNum: number,
      toRowNum: number,
      duplicateAction: EnumDuplicateAction,
      productId: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/product-serial/import?sheetName=${sheetName}&fromRowNum=${fromRowNum}&toRowNum=${toRowNum}&duplicateAction=${duplicateAction}&productId=${productId}`,
        method: 'post',
        data: file,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of Product serial
