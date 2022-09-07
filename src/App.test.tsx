// render and screen imported from utils, where we override render to include AppProvider as a wrapper
import { render, screen } from './test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Test app authentication based rendering', () => {
  test('<Login /> should be shown before authentication, <AppRoutes /> should show after authentication', async () => {
    render(<App />);

    // login component should be shown, login button should be in the document
    const loginButton = screen.getByRole('button', { name: /kirjaudu/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();

    // select inputs can be found with 'combobox' role
    const selectInput = await screen.findByRole('combobox');
    expect(selectInput).toBeInTheDocument();

    // select OpenData route
    userEvent.selectOptions(selectInput, 'Kuntien väkiluvut alueittain (2021)');
    expect(loginButton).toBeEnabled();

    // user clicks login button
    userEvent.click(loginButton);

    // OpenData screen should mount, header should be shown (not an actual header element, bootstrap card div, can't be found by role)
    const mainHeader = await screen.findByText(
      'Kuntien väkiluvut alueittain (2021)'
    );
    expect(mainHeader).toBeInTheDocument();
  });
});
