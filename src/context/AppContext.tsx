import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from 'react';
import { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// constants
import { appContextUrlEncoded } from '../constants';

// api
import api, { AuthProvider } from '../api';

// constants
import {
  LOCAL_STORAGE_AUTH_PROVIDER,
  LOCAL_STORAGE_AUTH_TOKEN,
  LOCAL_STORAGE_USER_EMAIL,
  LOCAL_STORAGE_ROUTE_NAME,
} from '../constants';

interface AppState {
  authenticated: boolean;
  loading: boolean;
}

enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  SET_LOADING = 'SET_LOADING',
}

interface LogInAction {
  type: ActionTypes.LOG_IN;
}

interface LogOutAction {
  type: ActionTypes.LOG_OUT;
}

interface LoadingAction {
  type: ActionTypes.SET_LOADING;
  loading: boolean;
}

type Action = LogInAction | LogOutAction | LoadingAction;

interface AppContextInterface {
  authenticated: boolean;
  loading: boolean;
  logIn: (
    authProvider: AuthProvider,
    autToken: string,
    userEmail: string
  ) => void;
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
  loading: false,
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
    case ActionTypes.SET_LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }
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
  const { authenticated, loading } = state;
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handle login. Set user as authenticated, set dataType. Store logged in state and appType to local storage.
   */
  const logIn = useCallback(
    (authProvider: AuthProvider, token: string, userEmail: string) => {
      dispatch({ type: ActionTypes.LOG_IN });
      localStorage.setItem(LOCAL_STORAGE_AUTH_PROVIDER, authProvider);
      localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, token);
      // localStorage.setItem(LOCAL_STORAGE_USER_EMAIL, userEmail);
    },
    []
  );

  /**
   * Handle log out. Clear authenntication state, clear local storage.
   */
  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    localStorage.removeItem(LOCAL_STORAGE_AUTH_PROVIDER);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL);
    localStorage.removeItem(LOCAL_STORAGE_ROUTE_NAME);
  }, []);

  /**
   * Calls api GW endpoint to check if user Sinuna token is expired or not.
   * If token is still valid, response will hold user email, otherwise it throws 401.
   */
  const checkUserInfoStatus = useCallback(
    async (authProvider: AuthProvider, authToken: string) => {
      try {
        const userInfoResponse = await api.getUserInfo(
          authProvider as AuthProvider,
          {
            token: authToken,
            appContext: appContextUrlEncoded,
          }
        );

        // response differs between sinuna / suomifi
        let email;

        if (authProvider === AuthProvider.SINUNA) {
          ({ email } = userInfoResponse.data);
        } else if (authProvider === AuthProvider.SUOMIFI) {
          ({ email } = userInfoResponse.data.profile);
        }

        logIn(authProvider, authToken, email);
        dispatch({ type: ActionTypes.SET_LOADING, loading: false });
      } catch (error) {
        // if getUserInfo throws 401 error, it means sinuna session expired and user needs to be logged in again
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            // log user out, set previous route name to local storage and direct user to login request
            localStorage.setItem(LOCAL_STORAGE_ROUTE_NAME, location.pathname);
            logOut();

            if (authProvider === 'sinuna') {
              api.directToAuthGwLogin(AuthProvider.SINUNA);
            } else if (authProvider === 'suomifi') {
              api.directToAuthGwLogin(AuthProvider.SUOMIFI);
            }
          } else {
            logOut();
            navigate('/');
          }
        }
      }
    },
    [logIn, location.pathname, logOut, navigate]
  );

  /**
   * If auth token is found in local storage, check if user session is expired (Sinuna).
   */
  useEffect(() => {
    const authProvider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER);
    const authToken = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN);
    // const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);

    if (authProvider && authToken) {
      // dispatch({ type: ActionTypes.LOG_IN });
      dispatch({ type: ActionTypes.SET_LOADING, loading: true });
      checkUserInfoStatus(authProvider as AuthProvider, authToken);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider
      value={{
        authenticated,
        loading,
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
