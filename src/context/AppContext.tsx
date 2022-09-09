import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';

// constants
import { LOCAL_STORAGE_AUTH_TOKEN } from '../constants';

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
  logIn: (token: string) => void;
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
  // const rootMatch = useMatch('/');

  /**
   * If auth token is found in local storage, log user in automatically.
   */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN);

    if (isLoggedIn) {
      dispatch({ type: ActionTypes.LOG_IN });
    }
  }, []);

  /**
   * Handle login. Set user as authenticated, set dataType. Store logged in state and appType to local storage. Navigate to correct route based on selection.
   */
  const logIn = useCallback((token: string) => {
    dispatch({ type: ActionTypes.LOG_IN });
    localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, token);
  }, []);

  /**
   * Handle log out. Clear authenntication state, clear local storage. Navigate to root.
   */
  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
    navigate('/');
  }, [navigate]);

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
