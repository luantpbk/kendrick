import config from '../../config';

export type Configuration = {
  backendUrl: string;
  backendWs: string;
  clientId: string;
  defaultAvatar: string;
};

export const useConfiguration = (): Configuration => {
  return config;
};
