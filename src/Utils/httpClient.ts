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
  // const tokenService = new TokenService();

  // const token = await tokenService.getRefreshToken();
  const token =
    'BQAc7elGcgFY2su1w3Y95oGeCjOEXPxMnpXDdYJRDeqEB5jAl7uPf3x6PhdWSuPOnc6PVc2hTKVqaV9jG4C1LWMbcTyUqLIvPT1JyVt7RtTyG_wXDwRAswZLpjyUtlVpeujbFOZ_fVYOqqKhirq69xFams0tjOcCGew0YdDZIuoYTapc2imwOzsXc38Kfyf8gFY7Zk9LqJY02WEA38In9V201OGM7eZfZ2e3p_xDAdefRVoP';
  if (token) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const ResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const ErrorInterceptor = (error: AxiosError): Promise<AxiosError> => {
  console.error('Error:', (error.response as any)?.data?.error?.message);
  return Promise.reject(error);
};

interface ClientConfig {
  baseUrl: string | undefined;
  name: string;
}

interface Clients {
  [key: string]: AxiosInstance;
}

const { baseClient, authClient } = [
  {
    baseUrl: process.env.SPOTIFY_API_URL,
    name: 'baseClient',
  },
  {
    baseUrl: process.env.SPOTIFY_ACCOUNT_URL,
    name: 'authClient',
  },
].reduce<Clients>((acc, { baseUrl, name }: ClientConfig) => {
  acc[name] = axios.create({
    baseURL: baseUrl,
  });

  if (name === 'authClient') {
    acc[name].interceptors.request.use(TokenInterceptor);
  } else {
    acc[name].interceptors.request.use(baseTokenInterceptor);
  }
  acc[name].interceptors.response.use(ResponseInterceptor, ErrorInterceptor);

  return acc;
}, {});

export { baseClient, authClient };
