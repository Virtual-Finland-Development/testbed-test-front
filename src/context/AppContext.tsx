import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// constants
import { appContextUrlEncoded } from '../constants';

// api
import api from '../api';

// constants
import {
  LOCAL_STORAGE_AUTH_TOKEN,
  LOCAL_STORAGE_USER_EMAIL,
} from '../constants';

interface AppState {
  authenticated: boolean;
}

enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
}

interface LogInAction {
  type: ActionTypes.LOG_IN;
}

interface LogOutAction {
  type: ActionTypes.LOG_OUT;
}

type Action = LogInAction | LogOutAction;

interface AppContextInterface {
  authenticated: boolean;
  logIn: (token: string, userEmail: string) => void;
  logOut: () => void;
}

interface AppProviderProps {
  children: React.ReactElement;
}

/**
 * State reduder
 */
const initialState: AppState = {
  authenticated: false,
};

function reducer(state: AppState, action: Action) {
  switch (action.type) {
    case ActionTypes.LOG_IN:
      return {
        ...state,
        authenticated: true,
      };
    case ActionTypes.LOG_OUT:
      return {
        ...state,
        authenticated: false,
      };
    default:
      return state;
  }
}

/**
 * App Context
 */
const AppContext = createContext<AppContextInterface | undefined>(undefined);
const AppConsumer = AppContext.Consumer;

function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { authenticated } = state;
  const navigate = useNavigate();

  /**
   * Handle login. Set user as authenticated. Store auth token, user email.
   */
  const logIn = useCallback((token: string, userEmail: string) => {
    dispatch({ type: ActionTypes.LOG_IN });
    localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_USER_EMAIL, userEmail);
  }, []);

  /**
   * Handle log out. Clear authenntication state, clear local storage.
   */
  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL);
  }, []);

  /**
   * Check user info status (Sinuna session state).
   * If request throws 401 error, user needs to log in.
   */
  const checkUserInfoStatus = useCallback(
    async (token: string) => {
      try {
        const userInfoResponse = await api.getUserInfo({
          token,
          appContext: appContextUrlEncoded,
        });
        const { email } = userInfoResponse.data;
        localStorage.setItem(LOCAL_STORAGE_USER_EMAIL, email);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            alert('Istuntosi on vanhentunut, ole hyvä ja kirjaudu uudelleen.');
            navigate('/');
            logOut();
          }
        }
      }
    },
    [logOut, navigate]
  );

  /**
   * If auth token is found in local storage, log user in automatically.
   * Check user info status, if userEmail is not found in local storage.
   */
  useEffect(() => {
    const authToken = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN);
    const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);

    if (authToken) {
      dispatch({ type: ActionTypes.LOG_IN });
    }

    if (authToken && !userEmail) {
      checkUserInfoStatus(authToken);
    }
  }, [checkUserInfoStatus]);

  return (
    <AppContext.Provider
      value={{
        authenticated,
        logIn,
        logOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * useAppContext hook
 */
function useAppContext() {
  const context = useContext(AppContext) as AppContextInterface;

  if (context === undefined || context === null) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}

export { AppContext, AppProvider, AppConsumer, useAppContext };
