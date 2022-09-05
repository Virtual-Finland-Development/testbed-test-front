import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from 'react';

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
  logIn: () => void;
  logOut: () => void;
}

interface AppProviderProps {
  children: React.ReactElement;
}

const LOCAL_STORAGE_KEY = 'testbed-authenticated';

/**
 * State reduder
 */
const initialState: AppState = { authenticated: false };

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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (isLoggedIn) {
      dispatch({ type: ActionTypes.LOG_IN });
    }
  }, []);

  const logIn = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_IN });
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  }, []);

  const logOut = useCallback(() => {
    dispatch({ type: ActionTypes.LOG_OUT });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

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
