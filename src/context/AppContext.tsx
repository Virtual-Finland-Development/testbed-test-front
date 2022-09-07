import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from 'react';
import { useNavigate, useMatch } from 'react-router-dom';

// constants
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_DATA_TYPE,
  RouteNames,
} from '../constants';

enum DataType {
  OPEN_DATA = 'OPEN_DATA',
  TMT = 'TMT',
}

interface AppState {
  authenticated: boolean;
  dataType: DataType;
}

enum ActionTypes {
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
}

interface LogInAction {
  type: ActionTypes.LOG_IN;
  dataType: DataType;
}

interface LogOutAction {
  type: ActionTypes.LOG_OUT;
}

type Action = LogInAction | LogOutAction;

interface AppContextInterface {
  authenticated: boolean;
  dataType: string;
  logIn: (dataType: DataType) => void;
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
  dataType: DataType.OPEN_DATA,
};

function reducer(state: AppState, action: Action) {
  switch (action.type) {
    case ActionTypes.LOG_IN:
      return {
        ...state,
        authenticated: true,
        dataType: action.dataType,
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
  const { authenticated, dataType } = state;
  const navigate = useNavigate();
  const rootMatch = useMatch('/');

  /**
   * If loggedIn & dataType flag is found in local storage, log user in automatically.
   */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    const dataType = localStorage.getItem(LOCAL_STORAGE_DATA_TYPE) as DataType;

    if (isLoggedIn && dataType) {
      dispatch({ type: ActionTypes.LOG_IN, dataType });
    }
  }, []);

  /**
   * If authenticated and dataType set and user navigates to root, redirect to correct route.
   */
  useEffect(() => {
    if (authenticated && dataType) {
      if (rootMatch) {
        if (dataType === DataType.OPEN_DATA) {
          navigate(RouteNames.OPEN_DATA);
        }

        if (dataType === DataType.TMT) {
          navigate(RouteNames.TMT);
        }
      }
    }
  }, [dataType, authenticated, navigate, rootMatch]);

  /**
   * Handle login. Set user as authenticated, set dataType. Store logged in state and appType to local storage. Navigate to correct route based on selection.
   */
  const logIn = useCallback(
    (dataType: DataType) => {
      dispatch({ type: ActionTypes.LOG_IN, dataType });
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'true');
      localStorage.setItem(LOCAL_STORAGE_DATA_TYPE, dataType);
      const route =
        dataType === DataType.OPEN_DATA ? RouteNames.OPEN_DATA : RouteNames.TMT;
      navigate(route);
    },
    [navigate]
  );

  /**
   * Handle log out. Clear authenntication state, clear local storage. Navigate to root.
   */
  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    localStorage.removeItem(LOCAL_STORAGE_DATA_TYPE);
    navigate('/');
  }, [navigate]);

  return (
    <AppContext.Provider
      value={{
        authenticated,
        dataType,
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

export { AppContext, AppProvider, AppConsumer, useAppContext, DataType };
