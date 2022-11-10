import axios from 'axios';

// constants
import {
  appContextUrlEncoded,
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKENS,
} from '../constants';
import { JSONLocalStorage } from '../context/AppContext';

export enum AuthProvider {
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type LoggedInState = {
  idToken: string; // Other requests (except for Sinuna, which uses accessToken instead)
  profileData: {
    email: string;
    [key: string]: any;
  };
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
  const loggedInState = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS);

  if (config.url !== undefined && config.headers !== undefined) {
    if (loggedInState && [OPEN_DATA_URL].includes(config.url)) {
      // The token that is used to authorize the user in the protected, external API queries
      const authorizationToken = loggedInState.idToken;

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
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/authentication-request?appContext=${appContextUrlEncoded}`
  );
}

function directToAuthGwLogout(authProvider: AuthProvider) {
  const authRoute = authProvider === AuthProvider.SINUNA ? 'openid' : 'saml2';
  const idToken = JSONLocalStorage.get(LOCAL_STORAGE_AUTH_TOKENS).idToken;
  window.location.assign(
    `${api.AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/logout-request?appContext=${appContextUrlEncoded}&idToken=${idToken}`
  );
}

async function logIn(
  authPayload: {
    loginCode: string;
    appContext: string;
  },
  authProvider: AuthProvider
): Promise<LoggedInState> {
  const authRoute = authProvider === AuthProvider.SINUNA ? 'openid' : 'saml2';
  const response = await axiosInstance.post(
    `${AUTH_GW_ENDPOINT}/auth/${authRoute}/${authProvider}/login-request`,
    authPayload,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * throws 401 if not authorized
 *
 * @param authProvider
 * @param loggedInState
 */
async function verifyLogin(
  authProvider: AuthProvider,
  loggedInState: LoggedInState
) {
  await axiosInstance.post(`${AUTH_GW_ENDPOINT}/authorize`, null, {
    headers: {
      Authorization: `Bearer ${loggedInState.idToken}`,
      'X-authorization-provider': authProvider,
    },
  });
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
  logIn,
  getKeyFigures,
  getData,
  verifyLogin,
};

export default api;
