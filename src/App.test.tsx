// render and screen imported from utils, where custom renderers include routers / AppProvider as a wrapper
import userEvent from '@testing-library/user-event';
import api from '../src/api';
import { appContextUrlEncoded } from '../src/constants';
import App from './App';
import {
  customRender1,
  customRender2,
  screen,
} from './test-utils/testing-library-utils';

describe('Test app authentication based rendering', () => {
  test('Login button should be shown before authentication. Redirect to Sinuna authentication should happen when login button clicked.', async () => {
    customRender1(<App />);

    // login component should be shown, login button should be in the document
    const loginButton = screen.getByRole('button', {
      name: /sinuna-login-button/i,
    });
    expect(loginButton).toBeInTheDocument();

    // mock location.assign
    window.location.assign = jest.fn();

    // user clicks login button
    userEvent.click(loginButton);

    // once login button clicked, user should be directed to sinuna authentication (api gateway route)
    expect(window.location.assign).toBeCalledWith(
      `${api.AUTH_GW_ENDPOINT}/auth/openid/sinuna/authentication-request?appContext=${appContextUrlEncoded}`
    );

    // login button should be disabled when login action is clicked
    expect(loginButton).toBeDisabled();

    // loading spinner should appear when login action occurs
    const loadingSpinner = screen.getByRole('status', {
      name: /login-loading-spinner/i,
    });
    expect(loadingSpinner).toBeInTheDocument();
  });

  test('User should be authenticated when directed to auth route with loginCode. After authentication, user sees data selection input and selects open data.', async () => {
    // user is redirected to auth route with loginCode query param, user should be logged in
    customRender2(<App />, {
      initialEntries: ['/auth?provider=sinuna&loginCode=123'],
    });

    // select inputs can be found with 'combobox' role
    const selectInput = await screen.findByRole('combobox');
    expect(selectInput).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /näytä/i });
    expect(nextButton).toBeDisabled();

    // select OpenData route
    userEvent.selectOptions(selectInput, 'Kuntien väkiluvut alueittain (2021)');
    expect(nextButton).toBeEnabled();

    // click next button to move to selected route
    userEvent.click(nextButton);

    // OpenData screen should mount, header should be shown (not an actual header element, bootstrap card div, can't be found by role)
    const mainHeader = await screen.findByText(
      'Kuntien väkiluvut alueittain (2021)'
    );
    expect(mainHeader).toBeInTheDocument();
  });

  test('User clicks log out button, log out redirect should occur', async () => {
    // user is redirected to auth route with loginCode query param, user should be logged in
    customRender2(<App />, {
      initialEntries: ['/auth?provider=sinuna&loginCode=123'],
    });

    // logout button should be visible once user has authenticated
    const logoutButton = await screen.findByRole('button', {
      name: /kirjaudu ulos/i,
    });
    expect(logoutButton).toBeInTheDocument();

    // mock location.assign
    window.location.assign = jest.fn();

    // user clicks log out button
    userEvent.click(logoutButton);

    // once log pit button clicked, user should be directed to sinuna authentication log out (api gateway route)
    expect(window.location.assign).toBeCalledWith(
      `${api.AUTH_GW_ENDPOINT}/auth/openid/sinuna/logout-request?appContext=${appContextUrlEncoded}&idToken=undefined`
    );

    // log out button text should be changed to 'Kirjaudutaan ulos...' once logout redirect happens
    expect(logoutButton).toHaveTextContent(/kirjaudutaan ulos.../i);
  });

  test('User should be logged out, when logout redirect occured, api gateway (Sinuna session logout)', async () => {
    // user is redirected to auth route with log out query param
    customRender2(<App />, {
      initialEntries: ['/auth?logout=success'],
    });

    // user should be logged out, login button should appear in the document
    const loginButton = await screen.findByRole('button', {
      name: /sinuna-login-button/i,
    });
    expect(loginButton).toBeInTheDocument();
  });
});
