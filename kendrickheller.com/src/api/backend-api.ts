import axios, { Method, ResponseType, AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import useProfile from 'src/hooks/useProfile';
import { useRemoveProfileInfo, useSetProfileInfo } from 'src/state/application/hooks';
import { ProfileInfo } from 'src/state/application/models';
import { useConfiguration } from '../contexts/ConfigProvider/ConfigProvider';
import {
  CompanyInfoType,
  ImageType,
  NewsType,
  PageData,
  ProductGiftType,
  ProductType,
  RealmType,
  StaticPageType,
  CommentType,
  ServiceType,
  TrackingType,
  ChangePasswordResult,
} from './models';

export type ApiRequestOption = {
  method: Method;
  body: any;
  responseType?: ResponseType;
  params?: any;
};

const instance = axios.create({});

export const useFetch = (anonymous?: boolean, file?: boolean, text?: boolean) => {
  const { backendUrl } = useConfiguration();
  const profile = useProfile();
  const removeProfileInfo = useRemoveProfileInfo();
  const setProfileInfo = useSetProfileInfo();

  const fetch = useCallback(
    async <T = any>(config: AxiosRequestConfig) => {
      const renewToken = async () => {
        const config: AxiosRequestConfig = {
          baseURL: backendUrl,
          responseType: 'json',
          params: {},
          headers: {
            'Content-Type': 'application/json;',
          },
          url: 'pgidm/rest-api/security/renew-token',
          method: 'post',
          data: {
            token: profile?.accessToken,
            refreshToken: profile?.refreshToken,
          },
        };
        try {
          const res = await instance.request(config);
          return res.status == 200 ? res.data : undefined;
        } catch (e) {
          return undefined;
        }
      };

      const request = async (config: AxiosRequestConfig) => {
        return instance
          .request(config)
          .then((res) => res.data)
          .catch(async (e) => {
            if (e.response && e.response.status == 401) {
              const newToken = await renewToken();
              if (newToken) {
                setProfileInfo({
                  accessToken: newToken.token,
                  refreshToken: newToken.refreshToken,
                  info: profile?.info,
                });
                config.headers['Authorization'] = `Bearer ${newToken.token}`;
                const res = (await request(config)) as Promise<any>;
                return res;
              } else {
                removeProfileInfo();
                return e.response && e.response.data
                  ? Promise.reject(e.response.data)
                  : Promise.reject(e.response || new Error('General error'));
              }
            } else {
              return e.response && e.response.data
                ? Promise.reject(e.response.data)
                : Promise.reject(e.response || new Error('General error'));
            }
          });
      };

      if (!backendUrl) {
        return;
      }
      config.baseURL = backendUrl;
      config.responseType = text ? 'text' : 'json';
      config.params = {
        ...(config.params || {}),
      };
      if (!anonymous) {
        config.headers = {
          Authorization: `Bearer ${profile?.accessToken}`,
          'Content-Type': !file ? 'application/json;' : 'multipart/form-data;',
        };
      } else if (!config.headers) {
        config.headers = {
          'Content-Type': 'application/json;',
        };
      }

      return request(config) as Promise<T>;
    },
    [
      backendUrl,
      text,
      anonymous,
      profile?.accessToken,
      profile?.refreshToken,
      profile?.info,
      setProfileInfo,
      removeProfileInfo,
      file,
    ],
  );

  return fetch;
};

export const useFetchRaw = () => {
  const fetch = useCallback(async (config: AxiosRequestConfig) => {
    config.responseType = 'json';
    return axios
      .request(config)
      .then((res) => res.data)
      .catch((e) => {
        if (e.response && e.response.status === 400) {
          return Promise.reject(e.response.data);
        }
        return Promise.reject(e.response || new Error('General error'));
      });
  }, []);

  return fetch;
};

export const useChangePassword = () => {
  const fetch = useFetch(true);

  return useCallback(
    (email: string, currentPassword: string, password: string, confirmPassword: string) => {
      const item = {
        loginName: email,
        currentPassword: currentPassword,
        password: password,
        confirmPassword: confirmPassword,
      };
      return fetch({
        url: `pgidm/rest-api/user/change-pass`,
        method: 'put',
        data: item,
      }) as Promise<ChangePasswordResult>;
    },
    [fetch],
  );
};

export const useForgotPassword = () => {
  const fetch = useFetch(true);

  return useCallback(
    (email: string, password: string, confirmPassword: string, otp: string) => {
      const item = {
        loginName: email,
        password: password,
        confirmPassword: confirmPassword,
        otp: otp,
      };
      return fetch({
        url: `pgidm/rest-api/user/change-pass`,
        method: 'put',
        data: item,
      }) as Promise<ChangePasswordResult>;
    },
    [fetch],
  );
};

export const useGenOtp = () => {
  const fetch = useFetch(true);

  return useCallback(
    (email: string) => {
      return fetch({
        url: `pgidm/rest-api/user/forgot/${email}`,
        method: 'post',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useReSentOtp = () => {
  const fetch = useFetch(true);

  return useCallback(
    (email: string) => {
      return fetch({
        url: `pgidm/rest-api/user/otp/re-sent/${email}`,
        method: 'post',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useLoginWithEmail = () => {
  const fetch = useFetch(true);

  return useCallback(
    (loginName: string, password: string) => {
      return fetch({
        url: 'pgidm/rest-api/security/login',
        method: 'post',
        data: {
          loginName,
          password,
        },
      }) as Promise<{ token: string; refreshToken: string }>;
    },
    [fetch],
  );
};

export const useLoginGoogle = () => {
  const fetch = useFetch(true);

  return useCallback(
    (googleAccessToken: string) => {
      return fetch({
        url: 'pgidm/rest-api/security/login',
        method: 'post',
        data: {
          googleAccessToken,
        },
      }) as Promise<{ token: string; refreshToken: string }>;
    },
    [fetch],
  );
};

export const useRegisterWithEmail = () => {
  const fetch = useFetch(true);

  return useCallback(
    (
      email: string,
      loginName: string,
      fullName: string,
      password: string,
      confirmPassword: string,
    ) => {
      return fetch({
        url: 'pgidm/rest-api/user/register',
        method: 'post',
        data: {
          email,
          loginName,
          fullName,
          password,
          confirmPassword,
        },
      }) as Promise<ProfileInfo>;
    },
    [fetch],
  );
};

export const useVerify = () => {
  const fetch = useFetch(true);

  return useCallback(
    (email: string, otp: string) => {
      return fetch({
        url: `pgidm/rest-api/user/register-confirm-otp/${email}/${otp}`,
        method: 'post',
      }) as Promise<ProfileInfo>;
    },
    [fetch],
  );
};

export const useGetUserInfo = () => {
  const fetch = useFetch(true);

  return useCallback(
    (accessToken: string) => {
      return fetch({
        url: 'pgidm/rest-api/user/user-info',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }) as Promise<ProfileInfo>;
    },
    [fetch],
  );
};

/************************************/
/********                    ********/
/********         Realm      ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/
/***********************************/

export const useGetRealm = () => {
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

export const usePostRealm = () => {
  const fetch = useFetch();

  return useCallback(
    (
      productRealmId: null,
      productRealmCode: string,
      productRealmName: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/product-realm',
        method: 'post',
        data: {
          productRealmId,
          productRealmCode,
          productRealmName,
          displayOrder,
        },
      }) as Promise<RealmType>;
    },
    [fetch],
  );
};

export const usePutIdRealm = () => {
  const fetch = useFetch();

  return useCallback(
    (
      productRealmId: number,
      productRealmCode: string,
      productRealmName: string,
      displayOrder?: number,
    ) => {
      return fetch({
        url: `pgcore/rest-api/product-realm`,
        method: 'put',
        data: {
          productRealmId,
          productRealmCode,
          productRealmName,
          displayOrder,
        },
      }) as Promise<RealmType>;
    },
    [fetch],
  );
};

export const useDeleteRealm = () => {
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
//End of Realm

/************************************/
/********                    ********/
/********      Product      ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/
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
        url: `pgcore/rest-api/product?isStockRemain=true&${
          keyword !== null ? 'keyword=' + keyword + '&' : ''
        }page=${page}&size=${size}${
          realmIds ? (realmIds.length > 0 ? '&realmIds=' + listRealms : '') : ''
        }${categoryIds ? (categoryIds.length > 0 ? '&categoryIds=' + listCategorys : '') : ''}`,
        method: 'get',
      }) as Promise<PageData<ProductType>>;
    },
    [fetch],
  );
};

export const useGetHotProduct = () => {
  const fetch = useFetch();

  return useCallback(
    (page: number, size: number) => {
      //TODO
      return fetch({
        url: `pgcore/rest-api/product?isStockRemain=true&hot=true&page=${page}&size=${size}`,
        method: 'get',
      }) as Promise<PageData<ProductType>>;
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

export const useGetListProductByIds = () => {
  const fetch = useFetch();
  return useCallback(
    (productIds: number[]) => {
      return fetch({
        url: `pgcore/rest-api/product/ids`,
        method: 'post',
        data: productIds,
      }) as Promise<ProductType[]>;
    },
    [fetch],
  );
};

export const useUpdateProductAvatar = () => {
  const fetch = useFetch(false, true);

  return useCallback(
    (id: number, data) => {
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
    (id: string, data) => {
      return fetch({
        url: `pgcore/rest-api/product/image/${id}`,
        method: 'post',
        data: data,
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

//Display option
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

//Display option
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

//Display option
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
//End of Product

export const useGetBanner = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/banner`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddBannerImage = () => {
  const fetch = useFetch(false, true);

  return useCallback(
    (data) => {
      return fetch({
        url: `pgcore/rest-api/banner`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteBannerImage = () => {
  const fetch = useFetch();

  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/banner/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of banner

/************************************/
/********                    ********/
/******    Company image     ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/
/***********************************/

export const useGetCompanyImage = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/company-image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddCompanyImage = () => {
  const fetch = useFetch(false, true);

  return useCallback(
    (data) => {
      return fetch({
        url: `pgcore/rest-api/company-image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteCompanyImage = () => {
  const fetch = useFetch();

  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/company-image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of company image

/************************************/
/********                    ********/
/********    Company info    ********/
/******   Writen by Le Van Huy  ****/
/********                   ********/
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

export const useGetCompanyInfoByKey = () => {
  const fetch = useFetch();

  return useCallback(
    (key: string) => {
      return fetch({
        url: `pgcore/rest-api/company-info/key/${key}`,
        method: 'get',
      }) as Promise<CompanyInfoType>;
    },
    [fetch],
  );
};

export const usePostCompanyInfo = () => {
  const fetch = useFetch();

  return useCallback(
    (
      companyInfoKey: string,
      companyInfoTitle: string,
      companyInfoValue: string,
      href?: string,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/company-info',
        method: 'post',
        data: {
          companyInfoKey,
          companyInfoTitle,
          companyInfoValue,
          href,
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
      companyInfoValue,
      href?: string,
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

/************************************/
/********                    ********/
/********    Static Page    ********/
/******   Writen by LuanPT  ****/
/********                   ********/
/***********************************/

export const useGetStaticPage = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/static-page`,
      method: 'get',
    }) as Promise<StaticPageType[]>;
  }, [fetch]);
};

export const usePostStaticPage = () => {
  const fetch = useFetch();

  return useCallback(
    (
      staticPageKey: string,
      staticPageTitle: string,
      staticPageValue: string,
      description: string,
    ) => {
      return fetch({
        url: 'pgcore/rest-api/static-page',
        method: 'post',
        data: {
          staticPageKey,
          staticPageTitle,
          staticPageValue,
          description,
        },
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const useGetStaticPageById = () => {
  const fetch = useFetch();

  return useCallback(
    (staticPageId: number) => {
      return fetch({
        url: `pgcore/rest-api/static-page/${staticPageId}`,
        method: 'get',
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const useGetStaticPageByKey = () => {
  const fetch = useFetch();

  return useCallback(
    (key: string) => {
      return fetch({
        url: `pgcore/rest-api/static-page/key/${key}`,
        method: 'get',
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const usePutStaticPage = () => {
  const fetch = useFetch();

  return useCallback(
    (
      staticPageId: number,
      staticPageKey: string,
      staticPageTitle: string,
      staticPageValue: string,
      description: string,
    ) => {
      return fetch({
        url: `pgcore/rest-api/static-page`,
        method: 'put',
        data: {
          staticPageId,
          staticPageKey,
          staticPageTitle,
          staticPageValue,
          description,
        },
      }) as Promise<StaticPageType>;
    },
    [fetch],
  );
};

export const useDeleteStaticPage = () => {
  const fetch = useFetch();

  return useCallback(
    (staticPageId: number) => {
      return fetch({
        url: `pgcore/rest-api/static-page/${staticPageId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetStaticPageImage = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/static-page/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddStaticPageImage = () => {
  const fetch = useFetch(false, true);

  return useCallback(
    (data) => {
      return fetch({
        url: `pgcore/rest-api/static-page/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteStaticPageImage = () => {
  const fetch = useFetch();

  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/static-page/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of static page

/************************************/
/********                    ********/
/********        News        ********/
/******   Writen by LuanPT  ****/
/********                   ********/
/***********************************/

export const useGetNews = () => {
  const fetch = useFetch();

  return useCallback(
    (page?: number, size?: number) => {
      return fetch({
        url: `pgcore/rest-api/news${page ? '?page=' + page : ''}${size ? '&size=' + size : ''}`,
        method: 'get',
      }) as Promise<PageData<NewsType>>;
    },
    [fetch],
  );
};

export const usePostNews = () => {
  const fetch = useFetch();

  return useCallback(
    (newTitle: string, newValue: string, newAvatar: string, description: string) => {
      return fetch({
        url: 'pgcore/rest-api/news',
        method: 'post',
        data: {
          newTitle,
          newValue,
          newAvatar,
          description,
        },
      }) as Promise<NewsType>;
    },
    [fetch],
  );
};

export const useGetNewsById = () => {
  const fetch = useFetch();

  return useCallback(
    (newId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/${newId}`,
        method: 'get',
      }) as Promise<NewsType>;
    },
    [fetch],
  );
};

export const usePutNews = () => {
  const fetch = useFetch();

  return useCallback(
    (
      newId: number,
      newTitle: string,
      newValue: string,
      newAvatar: string,
      description: string,
    ) => {
      return fetch({
        url: `pgcore/rest-api/news`,
        method: 'put',
        data: {
          newId,
          newTitle,
          newValue,
          newAvatar,
          description,
        },
      }) as Promise<NewsType>;
    },
    [fetch],
  );
};

export const useDeleteNews = () => {
  const fetch = useFetch();

  return useCallback(
    (staticPageId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/${staticPageId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetNewsImage = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/news/image`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useAddNewsImage = () => {
  const fetch = useFetch(false, true);

  return useCallback(
    (data) => {
      return fetch({
        url: `pgcore/rest-api/news/image`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteNewsImage = () => {
  const fetch = useFetch();

  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/image/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};

export const useGetAllComment = () => {
  const fetch = useFetch();

  return useCallback(
    (newsId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/${newsId}/comment`,
        method: 'get',
      }) as Promise<CommentType[]>;
    },
    [fetch],
  );
};

export const useGetCommentByCommentId = () => {
  const fetch = useFetch();

  return useCallback(
    (commentId: number) => {
      return fetch({
        url: `pgcore/rest-api/news/parent/${commentId}/comment`,
        method: 'get',
      }) as Promise<CommentType[]>;
    },
    [fetch],
  );
};

export const usePostNewComment = () => {
  const fetch = useFetch();

  return useCallback(
    (comment: CommentType) => {
      return fetch({
        url: `pgcore/rest-api/news/comment`,
        method: 'post',
        data: comment,
      }) as Promise<CommentType>;
    },
    [fetch],
  );
};

//End of news

/************************************/
/********                    ********/
/******       Logo       ********/
/******   Writen by LuanPT      ****/
/********                   ********/
/***********************************/

export const useGetLogos = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/logo`,
      method: 'get',
    }) as Promise<ImageType[]>;
  }, [fetch]);
};

export const useGetLogo = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/logo/final`,
      method: 'get',
    }) as Promise<ImageType>;
  }, [fetch]);
};

export const useAddLogoImage = () => {
  const fetch = useFetch(false, true);

  return useCallback(
    (data) => {
      return fetch({
        url: `pgcore/rest-api/logo`,
        method: 'post',
        data: data,
      }) as Promise<ImageType>;
    },
    [fetch],
  );
};

export const useDeleteLogoImage = () => {
  const fetch = useFetch();

  return useCallback(
    (fileId: number) => {
      return fetch({
        url: `pgcore/rest-api/logo/${fileId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of logo

/************************************/
/********                    ********/
/******       Service      ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/

export const useGetAllService = () => {
  const fetch = useFetch();

  return useCallback(() => {
    return fetch({
      url: `pgcore/rest-api/service`,
      method: 'get',
    }) as Promise<ServiceType[]>;
  }, [fetch]);
};

export const useGetServiceById = () => {
  const fetch = useFetch();

  return useCallback(
    (serviceId: number) => {
      return fetch({
        url: `pgcore/rest-api/service/${serviceId}`,
        method: 'get',
      }) as Promise<ServiceType>;
    },
    [fetch],
  );
};

export const usePostService = () => {
  const fetch = useFetch();

  return useCallback(
    (service: ServiceType) => {
      return fetch({
        url: `pgcore/rest-api/service`,
        method: 'post',
        data: service,
      }) as Promise<ServiceType>;
    },
    [fetch],
  );
};

export const usePutService = () => {
  const fetch = useFetch();

  return useCallback(
    (_service: ServiceType) => {
      return fetch({
        url: `pgcore/rest-api/service`,
        method: 'put',
        data: _service,
      }) as Promise<ServiceType>;
    },
    [fetch],
  );
};

export const useDeleteService = () => {
  const fetch = useFetch();

  return useCallback(
    (serviceId: number) => {
      return fetch({
        url: `pgcore/rest-api/service/${serviceId}`,
        method: 'delete',
      }) as Promise<boolean>;
    },
    [fetch],
  );
};
//End of service

/************************************/
/********                    ********/
/******       Tracking      ********/
/******   Writen by HuyLV      ****/
/********                   ********/
/***********************************/
export const useGetOrderTracking = () => {
  const fetch = useFetch();

  return useCallback(
    (trackingId: string) => {
      return fetch({
        url: `pgcore/rest-api/tracking`,
        method: 'post',
        data: {
          trackingId: trackingId,
        },
      }) as Promise<TrackingType>;
    },
    [fetch],
  );
};
//End of tracking
