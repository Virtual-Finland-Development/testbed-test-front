import axios from 'axios';

const AUTH_GW_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:1234'
    : 'http://localhost:1234';

const FIGURES_URL =
  'https://statfin.stat.fi/PXWeb/api/v1/fi/Kuntien_avainluvut/2021/kuntien_avainluvut_2021_aikasarja.px';

/**
 * The endpoint url
 *
 * testbed-test-api endpoint, serverless AWS function that routes api call to testbed environment
 */
const PRODUCTION_ENDPOINT =
  'https://9drrjton12.execute-api.eu-north-1.amazonaws.com';
const DATA_ENDPOINT_PATH = 'getPopulation'; // The data path

const DATA_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? PRODUCTION_ENDPOINT
    : 'http://localhost:3001';
const DATA_URL = `${DATA_BASE_URL}/${DATA_ENDPOINT_PATH}`;

/**
 * AUTH
 */
async function getAuthToken(authPayload: {
  loginCode: string;
  appContext: string;
}) {
  return axios.post(
    `${AUTH_GW_ENDPOINT}/auth/openid/auth-token-request`,
    authPayload
  );
}

/**
 * DATA
 */
async function getKeyFigures() {
  return axios.get(`${FIGURES_URL}`);
}

async function getData(payload: { city: string; year: string }) {
  return axios.post(`${DATA_URL}`, payload);
}

const api = {
  AUTH_GW_ENDPOINT,
  DATA_URL,
  getAuthToken,
  getKeyFigures,
  getData,
};

export default api;
