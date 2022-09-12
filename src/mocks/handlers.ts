import { rest } from 'msw';
import api from '../api';

/**
 * msw handlers to override HTTP request for testing
 */
export const handlers = [
  rest.get(
    'https://statfin.stat.fi/PXWeb/api/v1/fi/Kuntien_avainluvut/2021/kuntien_avainluvut_2021_aikasarja.px',
    (req, res, ctx) => {
      return res(
        ctx.json({
          variables: [
            {
              code: 'Alue 2021',
              elimination: true,
              map: 'alue 2021',
              text: 'Alue 2021',
              valueTexts: ['KOKO MAA', 'Akaa', 'Alajärvi'],
            },
            {},
            {
              code: 'Vuosi',
              text: 'Vuosi',
              time: true,
              valueTexts: ['2009', '2010', '2011'],
            },
          ],
        })
      );
    }
  ),
  rest.post(api.OPEN_DATA_URL, (req, res, ctx) => {
    return res(
      ctx.json({
        description: 'Väkiluku, Akaa, 2010',
        source_name: 'Tilastokeskus',
        updated_at: '2022-06-17T11.52.00Z',
        population: 17012,
      })
    );
  }),
];
