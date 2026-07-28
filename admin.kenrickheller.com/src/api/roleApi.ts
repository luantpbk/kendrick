import { useCallback } from 'react';
import { useFetch } from './backend-api';
import { RoleType, RolePermisionType } from './models';

/************************************/
/********                    ********/
/******        Role         ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

export const useGetRole = () => {
  const fetch = useFetch();
  return useCallback(() => {
    return fetch({
      url: `pgidm/rest-api/role`,
      method: 'get',
    }) as Promise<RoleType[]>;
  }, [fetch]);
};

export const useGetRoleById = () => {
  const fetch = useFetch();
  return useCallback(
    (roleId: number) => {
      return fetch({
        url: `pgidm/rest-api/role/${roleId}`,
        method: 'get',
      }) as Promise<RoleType>;
    },
    [fetch],
  );
};

export const useGetRoleUserId = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number) => {
      return fetch({
        url: `pgidm/rest-api/user/${userId}/role`,
        method: 'get',
      }) as Promise<RoleType[]>;
    },
    [fetch],
  );
};

export const useMapRoleWithUser = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number, roleId: number) => {
      const temp = {
        roleId: roleId,
        userId: userId,
      };
      return fetch({
        url: `pgidm/rest-api/user/${userId}/role/${roleId}`,
        method: 'post',
        data: temp,
      }) as Promise<RoleType>;
    },
    [fetch],
  );
};

export const useRemoveRoleWithUser = () => {
  const fetch = useFetch();
  return useCallback(
    (userId: number, roleId: number) => {
      return fetch({
        url: `pgidm/rest-api/user/${userId}/role/${roleId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const usePostRole = () => {
  const fetch = useFetch();
  return useCallback(
    (role: RoleType) => {
      return fetch({
        url: `pgidm/rest-api/role`,
        method: 'post',
        data: role,
      }) as Promise<RoleType>;
    },
    [fetch],
  );
};

export const usePutRole = () => {
  const fetch = useFetch();
  return useCallback(
    (role: RoleType) => {
      return fetch({
        url: `pgidm/rest-api/role`,
        method: 'put',
        data: role,
      }) as Promise<RoleType>;
    },
    [fetch],
  );
};

export const useDeleteRole = () => {
  const fetch = useFetch();
  return useCallback(
    (roleId: number) => {
      return fetch({
        url: `pgidm/rest-api/role/${roleId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetRolePermision = () => {
  const fetch = useFetch();
  return useCallback(
    (roleId: number, moduleId: number) => {
      return fetch({
        url: `pgidm/rest-api/role/${roleId}/module/${moduleId}/permision`,
        method: 'get',
      }) as Promise<RolePermisionType[]>;
    },
    [fetch],
  );
};

export const usePutRolePermision = () => {
  const fetch = useFetch();
  return useCallback(
    (roleId: number, moduleId: number, rolePermision: RolePermisionType[]) => {
      return fetch({
        url: `pgidm/rest-api/role/${roleId}/module/${moduleId}/permision`,
        method: 'put',
        data: rolePermision,
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of role
