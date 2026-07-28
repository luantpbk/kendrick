/************************************/
/********                    ********/
/******   Order requirement   ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/

import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { OrderRequirementType, PageData } from './models';

/***********************************/
export const useGetOrderRequirement = () => {
  const fetch = useFetch();
  return useCallback(
    (page: number, size: number) => {
      return fetch({
        url: `pgcore/rest-api/order-requirement/me?page=${page}&size=${size}`,
        method: 'get',
      }) as Promise<PageData<OrderRequirementType>>;
    },
    [fetch],
  );
};

export const useGeneratePaymentId = () => {
  const fetch = useFetch();
  return useCallback(
    (id: number) => {
      return fetch({
        url: `pgcore/rest-api/order-requirement/${id}`,
        method: 'post',
      }) as Promise<string>;
    },
    [fetch],
  );
};

export const useCapturePayment = () => {
  const fetch = useFetch();
  return useCallback(
    (paymentId: string) => {
      return fetch({
        url: `pgcore/rest-api/order-requirement/payment/${paymentId}`,
        method: 'post',
      }) as Promise<{[key: string]: any}>;
    },
    [fetch],
  );
};

export const usePostOrderRequirement = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirement: OrderRequirementType) => {
      return fetch({
        url: `pgcore/rest-api/order-requirement`,
        method: 'post',
        data: orderRequirement,
      }) as Promise<OrderRequirementType>;
    },
    [fetch],
  );
};

export const usePutOrderRequirement = () => {
  const fetch = useFetch();
  return useCallback(
    (orderRequirement: OrderRequirementType) => {
      return fetch({
        url: `pgcore/rest-api/order-requirement`,
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
        url: `pgcore/rest-api/order-requirement/admin/${orderRequirementId}`,
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
        url: `pgcore/rest-api/order-requirement/${orderRequirementId}`,
        method: 'get',
      }) as Promise<OrderRequirementType>;
    },
    [fetch],
  );
};

//End of Order requirement
