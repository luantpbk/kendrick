/************************************/
/********                    ********/
/******   Order requirement   ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import {
  EnumOrderRequirementProgressStatus,
  OrderRequirementType,
  PageData,
  ProductSerialType,
} from './models';

/***********************************/
export const useGetOrderRequirement = () => {
  const fetch = useFetch();
  return useCallback(
    (keyword: string, page: number, size: number, progressStatus: number | string) => {
      return fetch({
        url: `ccore/rest-api/order-requirement?keyword=${keyword}&page=${page}&size=${size}&${
          progressStatus && progressStatus != '' ? `progressStatus=${progressStatus}` : ''
        }`,
        method: 'get',
      }) as Promise<PageData<OrderRequirementType>>;
    },
    [fetch],
  );
};

export const useGetMyOrderRequirement = () => {
  const fetch = useFetch();
  return useCallback(
    (keyword: string, page: number, size: number, progressStatus: number | string) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/me?keyword=${keyword}&page=${page}&size=${size}&${
          progressStatus && progressStatus != '' ? `progressStatus=${progressStatus}` : ''
        }`,
        method: 'get',
      }) as Promise<PageData<OrderRequirementType>>;
    },
    [fetch],
  );
};

export const usePostOrderRequirementForAdmin = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirement: OrderRequirementType) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/admin`,
        method: 'post',
        data: orderRequirement,
      }) as Promise<OrderRequirementType>;
    },
    [fetch],
  );
};

export const usePostOrderRequirementForCollaborator = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirement: OrderRequirementType) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/collaborator`,
        method: 'post',
        data: orderRequirement,
      }) as Promise<OrderRequirementType>;
    },
    [fetch],
  );
};

export const usePutOrderRequirementForAdmin = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirement: OrderRequirementType) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/admin`,
        method: 'put',
        data: orderRequirement,
      }) as Promise<OrderRequirementType>;
    },
    [fetch],
  );
};

export const usePutOrderRequirementForCollaborator = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirement: OrderRequirementType) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/collaborator`,
        method: 'put',
        data: orderRequirement,
      }) as Promise<OrderRequirementType>;
    },
    [fetch],
  );
};

export const useDeleteOrderRequirement = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirementId: number) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/${orderRequirementId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useDeleteOrderRequirementForAdmin = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirementId: number) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/admin/${orderRequirementId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetOrderRequirementById = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirementId: number) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/${orderRequirementId}`,
        method: 'get',
      }) as Promise<OrderRequirementType>;
    },
    [fetch],
  );
};

export const useSearchSerialByKeyword = () => {
  const fetch = useFetch();
  return useCallback(
    (keyword: string) => {
      return fetch({
        url: `ccore/rest-api/product-serial?keyword=${keyword}&status=1`,
        method: 'get',
      }) as Promise<PageData<ProductSerialType>>;
    },
    [fetch],
  );
};

export const usePutUpdateOrderRequirementProgressStatus = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirementIdList: any, progressStatus: EnumOrderRequirementProgressStatus) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/update-status/${progressStatus}`,
        method: 'put',
        data: orderRequirementIdList,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useDownLoadOrderRequirementExcel = () => {
  const fetch = useFetch(false, false, true);
  return useCallback(
    (orderRequirementIds: number[]) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/file/export`,
        method: 'post',
        data: orderRequirementIds,
      }) as Promise<Blob>;
    },
    [fetch],
  );
};

export const usePrintOrderRequirement = () => {
  const fetch = useFetch(false, false, false);
  return useCallback(
    (orderRequirementIds: number[]) => {
      return fetch({
        url: `ccore/rest-api/order-requirement/print`,
        method: 'post',
        data: orderRequirementIds,
      }) as Promise<string[]>;
    },
    [fetch],
  );
};

//End of Order requirement
