import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import * as dotenv from 'dotenv';
import { TokenService } from '../token/token.service';

dotenv.config();

const TokenInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_SECRET;

  const token = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  if (token) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.headers.Authorization = `Basic ${token}`;
  }

  return config;
};

const baseTokenInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const tokenService = new TokenService();

  const token = await tokenService.getRefreshToken();

  if (token) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const githubTokenInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    config.headers['Content-Type'] = 'application/json';
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const ResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const ErrorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  console.error(
    'Error:',
    (error.response && error.response.data) || error.message,
  );
  return Promise.reject(error);
};

interface ClientConfig {
  baseUrl: string | undefined;
  name: string;
}

interface Clients {
  [key: string]: AxiosInstance;
}

const { baseClient, authClient, githubClient } = [
  {
    baseUrl: process.env.SPOTIFY_API_URL,
    name: 'baseClient',
  },
  {
    baseUrl: process.env.SPOTIFY_ACCOUNT_URL,
    name: 'authClient',
  },
  {
    baseUrl: process.env.GITHUB_API_URL,
    name: 'githubClient',
  },
].reduce<Clients>((acc, { baseUrl, name }: ClientConfig) => {
  acc[name] = axios.create({
    baseURL: baseUrl,
  });

  if (name === 'authClient') {
    acc[name].interceptors.request.use(TokenInterceptor);
  } else if (name === 'baseClient') {
    acc[name].interceptors.request.use(baseTokenInterceptor);
  } else {
    acc[name].interceptors.request.use(githubTokenInterceptor);
  }
  acc[name].interceptors.response.use(ResponseInterceptor, ErrorInterceptor);

  return acc;
}, {});

export { baseClient, authClient, githubClient };
