/************************************/
/********                    ********/
/********      Product      ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import {
  PageData,
  ProductType,
  ImageType,
  ProductGiftType,
  EnumDuplicateAction,
} from './models';

/***********************************/
export const useGetProduct = () => {
  const fetch = useFetch();
  return useCallback(
    (
      keyword: string,
      page: number,
      size: number,
      realmIds?: number[],
      categoryIds?: number[],
      stopSelling?: boolean,
      sortField?: string,
      sortOrder?: string,
    ) => {
      let listRealms = '';
      let listCategorys = '';
      if (realmIds) {
        if (realmIds.length > 0) {
          realmIds.map((realmId: number) => {
            listRealms += realmId + ',';
          });
          listRealms = listRealms.slice(0, listRealms.length - 1);
        }
      }

      if (categoryIds) {
        if (categoryIds.length > 0) {
          categoryIds.map((categoryId: number) => {
            listCategorys += categoryId + ',';
          });
          listCategorys = listCategorys.slice(0, listCategorys.length - 1);
        }
      }

      return fetch({
        url: `pgcore/rest-api/product?${
          keyword !== null && keyword !== undefined && keyword !== '' ? 'keyword=' + keyword + '&' : ''
        }page=${page}&size=${size}${
          realmIds ? (realmIds.length > 0 ? '&realmIds=' + listRealms : '') : ''
        }${categoryIds ? (categoryIds.length > 0 ? '&categoryIds=' + listCategorys : '') : ''}${
          stopSelling == false ? '&stopSelling=false' : ''
        }${sortField ? '&sortField=' + sortField : ''}${sortOrder ? '&sortOrder=' + sortOrder : ''}`,
        method: 'get',
      }) as Promise<PageData<ProductType>>;
    },
    [fetch],
  );
};

export const usePostProduct = () => {
  const fetch = useFetch();
  return useCallback(
    (product: ProductType) => {
      return fetch({
        url: 'pgcore/rest-api/product',
        method: 'post',
        data: product,
      }) as Promise<ProductType>;
    },
    [fetch],
  );
};

export const usePutProduct = () => {
  const fetch = useFetch();
  return useCallback(
    (product: ProductType) => {
      return fetch({
        url: `pgcore/rest-api/product/${product.productId}`,
        method: 'put',
        data: product,
      }) as Promise<ProductType>;
    },
    [fetch],
  );
};

export const useGetProductById = () => {
  const fetch = useFetch();
  return useCallback(
    (productId: number) => {
      return fetch({
        url: `pgcore/rest-api/product/${productId}`,
        method: 'get',
      }) as Promise<ProductType>;
    },
    [fetch],
  );
};

export const useUpdateProductAvatar = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (id: number, data: any) => {
      return fetch({
        url: `pgcore/rest-api/product/avatar/${id}`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useAddProductImage = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (id: number, data: any) => {
      return fetch({
        url: `pgcore/rest-api/product/image/${id}`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useAddProductImageFromLibrary = () => {
  const fetch = useFetch(false, false);
  return useCallback(
    (id: number, fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/product/image-from-library/${id}`,
        method: 'post',
        data: { fileId },
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteProduct = () => {
  const fetch = useFetch();
  return useCallback(
    (productId: number) => {
      return fetch({
        url: `pgcore/rest-api/product/${productId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useDeleteProductImage = () => {
  const fetch = useFetch();
  return useCallback(
    (productId: number, fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/product/${productId}/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePutProductGift = () => {
  const fetch = useFetch();
  return useCallback(
    (productId: number, listGift: ProductGiftType[]) => {
      return fetch({
        url: `pgcore/rest-api/product/${productId}/gift`,
        method: 'put',
        data: listGift,
      }) as Promise<ProductGiftType[]>;
    },
    [fetch],
  );
};

export const useGetProductGift = () => {
  const fetch = useFetch();
  return useCallback(
    (productId: number) => {
      return fetch({
        url: `pgcore/rest-api/product/${productId}/gift`,
        method: 'get',
      }) as Promise<ProductGiftType[]>;
    },
    [fetch],
  );
};

export const useCopyProductGift = () => {
  const fetch = useFetch();
  return useCallback(
    (toId: number, fromId: number) => {
      return fetch({
        url: `pgcore/rest-api/product/${toId}/copy-gift/${fromId}`,
        method: 'post',
        data: {},
      }) as Promise<ProductGiftType[]>;
    },
    [fetch],
  );
};

export const useDownLoadProductExcelTemplate = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product/file/import-template`,
      method: 'get',
    }) as Promise<Blob>;
  }, [fetch]);
};

export const useDownLoadFullProductExcelTemplate = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product/file/import-full-template`,
      method: 'get',
    }) as Promise<Blob>;
  }, [fetch]);
};

export const useExportProductExcel = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/product/file/export`,
      method: 'get',
    }) as Promise<Blob>;
  }, [fetch]);
};

export const useImportProductExcel = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (
      file: any,
      sheetName: string,
      fromRowNum: number,
      toRowNum: number,
      duplicateAction: EnumDuplicateAction,
      productCategoryId: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/product/import?sheetName=${sheetName}&fromRowNum=${fromRowNum}&toRowNum=${toRowNum}&duplicateAction=${duplicateAction}&productCategoryId=${productCategoryId}`,
        method: 'post',
        data: file,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useImportFullProductExcel = () => {
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
        url: `pgcore/rest-api/product/import-full?sheetName=${sheetName}&fromRowNum=${fromRowNum}&toRowNum=${toRowNum}&duplicateAction=${duplicateAction}`,
        method: 'post',
        data: file,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useImportProductImages = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (file: any, duplicateAction: any) => {
      return fetch({
        url: `pgcore/rest-api/product/image/import?duplicateAction=${duplicateAction}`,
        method: 'post',
        data: file,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useImportProductAvatars = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (file: any) => {
      return fetch({
        url: `pgcore/rest-api/product/avatar/import`,
        method: 'post',
        data: file,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of Product
