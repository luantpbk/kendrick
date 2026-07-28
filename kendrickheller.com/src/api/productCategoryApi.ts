/************************************/
/********                    ********/
/********      Category      ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/
/***********************************/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { CategoryType, ImageType, CategoryAttributeType } from './models';

export const useGetCategory = () => {
  const fetch = useFetch();

  return useCallback(
    (realmId?: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category${realmId ? '?realmId=' + realmId : ''}`,
        method: 'get',
      }) as Promise<CategoryType[]>;
    },
    [fetch],
  );
};

export const useGetProductCategoryById = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    (productCategoryId: string) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}`,
        method: 'get',
      }) as Promise<CategoryType>;
    },
    [fetch],
  );
};

export const usePostCategory = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    (
      productRealmId: number,
      productCategoryCode: string,
      productCategoryName: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/product-category',
        method: 'post', //Post
        data: {
          productRealmId,
          productCategoryCode,
          productCategoryName,
          displayOrder,
        },
      }) as Promise<CategoryType>;
    },
    [fetch],
  );
};

export const usePutIdCategory = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    (
      productCategoryId: number,
      productRealmId: number,
      productCategoryCode: string,
      productCategoryName: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/product-category`,
        method: 'put', //put
        data: {
          productCategoryId,
          productRealmId,
          productCategoryCode,
          productCategoryName,
          displayOrder,
        },
      }) as Promise<CategoryType>;
    },
    [fetch],
  );
};

export const useDeleteCategory = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

//Display option
export const usePutCategoryDisplayOption = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    (productCategoryId: number, listConfig: CategoryAttributeType[]) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}/config`,
        method: 'put',
        data: listConfig,
      }) as Promise<CategoryAttributeType[]>;
    },
    [fetch],
  );
};

//Display option
export const useGetCategoryDisplayOption = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    (productCategoryId: number) => {
      return fetch({
        url: `pgcore/rest-api/product-category/${productCategoryId}/config`,
        method: 'get',
      }) as Promise<CategoryAttributeType[]>;
    },
    [fetch],
  );
};

export const useGetCategoryAttribute = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback(
    (ids: number[]) => {
      return fetch({
        url: `pgcore/rest-api/product-category/config`,
        method: 'post',
        data: ids,
      }) as Promise<{ [productCategoryId: number]: CategoryAttributeType[] }>;
    },
    [fetch],
  );
};

export const usePostProductCategoryAvatar = () => {
  const fetch = useFetch(false, true);
  return useCallback(
    (file, productCategoryId: number) => {
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
