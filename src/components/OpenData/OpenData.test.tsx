import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../../mocks/server';
import { handlers } from '../../mocks/handlers';
import api from '../../api';
import OpenData from './OpenData';

const setup = () => render(<OpenData />);

describe('Authentication component interactions', () => {
  test('should show region and year selection after figures has been loaded', async () => {
    setup();

    // 'Alue 2021' and 'Vuosi' are first options in select inputs, when data has loaded (select has no label)
    // alternative way is to find select inputs by role, like in the next test
    const regionSelect = await screen.findByRole('option', {
      name: /alue 2021/i,
    });
    expect(regionSelect).toBeInTheDocument();

    const yearSelect = screen.getByRole('option', { name: /vuosi/i });
    expect(yearSelect).toBeInTheDocument();
  });

  test('should show response data from productizer, after region and year has been selected', async () => {
    setup();

    // select inputs can be found with 'combobox' role
    const selectInputs = await screen.findAllByRole('combobox');
    expect(selectInputs).toHaveLength(2);

    userEvent.selectOptions(selectInputs[0], 'Akaa');
    userEvent.selectOptions(selectInputs[1], '2010');

    const statsHeader = await screen.findByRole('heading', {
      name: /väkiluku, akaa, 2010: 17012/i,
    });
    expect(statsHeader).toBeInTheDocument();
  });

  test('should show error alert, if productizer returns error response', async () => {
    setup();

    // reset the second handler to throw an error
    server.resetHandlers(
      handlers[0],
      rest.post(api.DATA_URL, (req, res, ctx) => res(ctx.status(500)))
    );

    const selectInputs = await screen.findAllByTestId('selection-input-', {
      exact: false,
    });
    expect(selectInputs).toHaveLength(2);

    userEvent.selectOptions(selectInputs[0], 'Akaa');
    userEvent.selectOptions(selectInputs[1], '2010');

    // error alert should appear when error occures
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toBeInTheDocument();
  });
});
