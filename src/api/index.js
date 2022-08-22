import axios from 'axios';

const BASE_URL =
  'https://pxnet2.stat.fi:443/PXWeb/api/v1/fi/Kuntien_avainluvut/2020/kuntien_avainluvut_2020_aikasarja.px';

async function getKeyFigures() {
  return axios.get(`${BASE_URL}`);
}

async function getData(payload) {
  return axios.post(`${BASE_URL}`, payload);
}

const api = {
  getKeyFigures,
  getData,
};

export default api;
