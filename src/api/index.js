import axios from 'axios';

const FIGURES_URL =
  'https://statfin.stat.fi/PXWeb/api/v1/fi/Kuntien_avainluvut/2021/kuntien_avainluvut_2021_aikasarja.px';
const DATA_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://zbnjt92292.execute-api.eu-north-1.amazonaws.com/dev' // ???
    : 'http://localhost:8000';

const DATA_ENDPOINT_PATH = 'test/lsipii/Figure/Population';
const DATA_URL = `${DATA_BASE_URL}/${DATA_ENDPOINT_PATH}`;

async function getKeyFigures() {
  return axios.get(`${FIGURES_URL}`);
}

async function getData(payload) {
  return axios.post(`${DATA_URL}`, payload);
}

const api = {
  DATA_URL,
  getKeyFigures,
  getData,
};

export default api;
