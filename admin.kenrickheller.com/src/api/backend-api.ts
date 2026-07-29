import axios, { Method, ResponseType, AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import useProfile from 'src/hooks/useProfile';
import { useRemoveProfileInfo, useSetProfileInfo } from 'src/state/application/hooks';
import { useConfiguration } from '../contexts/ConfigProvider/ConfigProvider';
import { useTranslationPrompt } from '../contexts/TranslationContext/TranslationContext';
import { ChangePasswordResult, ChannelTypeInfo, NfcInfo, ProfileInfo } from './models';

export type ApiRequestOption = {
  method: Method;
  body: any;
  responseType?: ResponseType;
  params?: any;
};

// const https = require('https');

// const instance = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false,
//   }),
// });

const instance = axios.create({});

export const useFetch = (
  anonymous?: boolean,
  file?: boolean,
  download?: boolean,
  text?: boolean,
) => {
  const { backendUrl } = useConfiguration();
  const profile = useProfile();
  const removeProfileInfo = useRemoveProfileInfo();
  const setProfileInfo = useSetProfileInfo();
  
  let showPrompt: (data: any) => void;
  try {
    const context = useTranslationPrompt();
    showPrompt = context.showPrompt;
  } catch (e) {
    // If not within provider, default to no-op
    showPrompt = () => {};
  }

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
          .then((res) => {
            if ((config.method === 'post' || config.method === 'put') && res.data && typeof res.data === 'object') {
              // Ignore login/auth endpoints
              if (!config.url?.includes('login') && !config.url?.includes('renew-token') && !config.url?.includes('auto-translate')) {
                showPrompt(res.data);
              }
            }
            return res.data;
          })
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
      config.responseType = text ? 'text' : !download ? 'json' : 'blob';
      config.params = {
        ...(config.params || {}),
      };
      if (!anonymous) {
        config.headers = {
          Authorization: `Bearer ${profile?.accessToken}`,
          'Content-Type': file ? 'multipart/form-data;' : 'application/json;',
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
      download,
      anonymous,
      profile?.accessToken,
      profile?.refreshToken,
      profile?.info,
      setProfileInfo,
      removeProfileInfo,
      file,
      showPrompt,
    ],
  );

  return fetch;
};

export const useLoginWithEmail = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

export const useGetUserInfo = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fetch = useFetch(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
