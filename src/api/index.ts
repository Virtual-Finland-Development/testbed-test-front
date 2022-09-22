import axios from 'axios';
import { LOCAL_STORAGE_AUTH_TOKEN } from '../constants';

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

const TMT_DATA_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://127.0.0.1:5286/jobs'
    : 'http://127.0.0.1:5286/jobs';

// Create axios instance for api service
const axiosInstance = axios.create();

// Axios request interceptor. Pass token to request Authorization for selected routes, if found.
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN);

  if (config.url !== undefined && config.headers !== undefined) {
    if ([OPEN_DATA_URL].includes(config.url)) {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
    }
  }

  return config;
});

/**
 * AUTH
 */
async function getAuthToken(authPayload: {
  loginCode: string;
  appContext: string;
}) {
  return axiosInstance.post(
    `${AUTH_GW_ENDPOINT}/auth/openid/auth-token-request`,
    authPayload
  );
}

async function getUserInfo(payload: { token: string; appContext: string }) {
  return axiosInstance.post(
    `${AUTH_GW_ENDPOINT}/auth/openid/user-info-request`,
    payload
  );
}

/**
 * Open data
 */
async function getKeyFigures() {
  return axiosInstance.get(`${FIGURES_URL}`);
}

async function getData(payload: { city: string; year: string }) {
  return axiosInstance.post(`${OPEN_DATA_URL}`, payload);
}

/**
 * TMT data
 */
export interface TmtPostPayload {
  query: string;
  location: {
    regions?: string[];
    municipalities?: string[];
    countries?: string[];
  };
  paging: {
    limit: number;
    offset: number;
  };
}
async function getTmtData(payload: TmtPostPayload) {
  return axiosInstance.post(TMT_DATA_URL, payload);
}

const api = {
  // exported urls
  AUTH_GW_ENDPOINT,
  OPEN_DATA_URL,
  // auth
  getAuthToken,
  getUserInfo,
  // open data
  getKeyFigures,
  getData,
  // tmt
  getTmtData,
};

export default api;
