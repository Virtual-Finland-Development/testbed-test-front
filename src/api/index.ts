import axios from 'axios';

// constants
import {
  appContextUrlEncoded,
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKEN,
} from '../constants';
import { JSONLocalStorage } from '../context/AppContext';

export enum AuthProvider {
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type AuthTokens = {
  accessToken: string; // UserInfoRequest
  idToken: string; // Other requests (except for Sinuna, which uses accessToken instead)
};

const AUTH_GW_ENDPOINT =
  'https://q88uo5prmh.execute-api.eu-north-1.amazonaws.com';

const FIGURES_URL =
  'https://statfin.stat.fi/PXWeb/api/v1/fi/Kuntien_avainluvut/2021/kuntien_avainluvut_2021_aikasarja.px';

/**
 * Open data (kuntien avainluvut) endpoint.
 *
 * testbed-test-api endpoint, serverless AWS function that routes api call to testbed environment
 */
const OPEN_DATA_PRODUCTION_ENDPOINT =
  'https://9drrjton12.execute-api.eu-north-1.amazonaws.com';
const OPEN_DATA_ENDPOINT_PATH = 'getPopulation'; // The data path

const OPEN_DATA_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? OPEN_DATA_PRODUCTION_ENDPOINT
    : 'http://localhost:3001';
const OPEN_DATA_URL = `${OPEN_DATA_BASE_URL}/${OPEN_DATA_ENDPOINT_PATH}`;

// Create axios instance for api service
const axiosInstance = axios.create();

// Axios request interceptor. Pass token to request Authorization for selected routes, if found.
axiosInstance.interceptors.request.use(config => {
  const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);
  const authTokens = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKEN);

  if (config.url !== undefined && config.headers !== undefined) {
    if (authTokens && [OPEN_DATA_URL].includes(config.url)) {
      // The token that is used to authorize the user in the protected, external API queries
      let authorizationToken = authTokens.idToken;
      // The exception: Sinuna does not operate with idToken, use accessToken instead
      if (provider === AuthProvider.SINUNA) {
        authorizationToken = authTokens.accessToken;
      }

      config.headers.Authorization = authorizationToken
        ? `Bearer ${authorizationToken}`
        : '';
      config.headers['X-authorization-provider'] = provider
        ? `${provider}`
        : '';
    }
  }

  return config;
});

/**
 * AUTH
 */
function directToAuthGwLogin(authProvider: AuthProvider) {
  const authRoute = authProvider === AuthProvider.SINUNA ? 'openid' : 'saml2';
  window.location.assign(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/login-request?appContext=${appContextUrlEncoded}`
  );
}

function directToAuthGwLogout(authProvider: AuthProvider) {
  const authRoute = authProvider === AuthProvider.SINUNA ? 'openid' : 'saml2';
  const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKEN).idToken;
  window.location.assign(
    `${api.AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/logout-request?appContext=${appContextUrlEncoded}&idToken=${idToken}`
  );
}

async function getAuthTokens(
  authPayload: {
    loginCode: string;
    appContext: string;
  },
  authProvider: AuthProvider
): Promise<AuthTokens> {
  const authRoute = authProvider === AuthProvider.SINUNA ? 'openid' : 'saml2';
  const response = await axiosInstance.post(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/auth-token-request`,
    authPayload,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

async function getUserInfo(
  authProvider: AuthProvider,
  payload: { accessToken: string; appContext: string }
) {
  const authRoute = authProvider === AuthProvider.SINUNA ? 'openid' : 'saml2';
  return axiosInstance.post(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/user-info-request`,
    payload,
    {
      withCredentials: true,
    }
  );
}

/**
 * DATA
 */
async function getKeyFigures() {
  return axiosInstance.get(`${FIGURES_URL}`);
}

async function getData(payload: { city: string; year: string }) {
  return axiosInstance.post(`${OPEN_DATA_URL}`, payload);
}

const api = {
  AUTH_GW_ENDPOINT,
  OPEN_DATA_URL,
  directToAuthGwLogin,
  directToAuthGwLogout,
  getAuthTokens,
  getUserInfo,
  getKeyFigures,
  getData,
};

export default api;
