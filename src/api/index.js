import axios from 'axios';

const FIGURES_URL =
  'https://statfin.stat.fi/PXWeb/api/v1/fi/Kuntien_avainluvut/2021/kuntien_avainluvut_2021_aikasarja.px';

/**
 * The endpoint url, not even the final form
 *
 * The production endpoint url would be: https://gateway.testbed.fi/test/lsipii/Figure/Population
 * -- but it does not yet work (for yet unresolved reasons) in browser requests
 *
 * @see: https://gateway.testbed.fi/docs#/Data%20Products/test_lsipii_Figure_Population_test_lsipii_Figure_Population_post
 * @see: https://definitions.testbed.fi/definitions/test/lsipii/Figure/Population
 */
const PRODUCTION_ENDPOINT =
  'https://zbnjt92292.execute-api.eu-north-1.amazonaws.com/dev'; // a backup endpoint url (the actual live data source)
const DATA_ENDPOINT_PATH = 'test/lsipii/Figure/Population'; // The data path
const DATA_QUERY_PARAMS = 'source=virtual_finland'; // The data source pin-pointer queryparam for the testbed

const DATA_BASE_URL =
  process.env.NODE_ENV !== 'production'
    ? PRODUCTION_ENDPOINT
    : 'http://localhost:8000';
const DATA_URL = `${DATA_BASE_URL}/${DATA_ENDPOINT_PATH}?${DATA_QUERY_PARAMS}`;

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
