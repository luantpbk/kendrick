import config from '../../config';

export type Configuration = {
  backendUrl: string;
  backendWs: string;
  clientId: string;
  resourceUrl: string;
};

export const useConfiguration = (): Configuration => {
  return config;
};
