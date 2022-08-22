import {
  createContext,
  useEffect,
  useCallback,
  useReducer,
  useContext,
} from 'react';

const LOCAL_STORAGE_KEY = 'testbed-authenticated';

/**
 * State reduder
 */
const LOG_IN = 'LOG_IN';
const LOG_OUT = 'LOG_OUT';
const initialState = { authenticated: false };

function reducer(state, action) {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        authenticated: true,
      };
    case LOG_OUT:
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
const AppContext = createContext(null);
const AppConsumer = AppContext.Consumer;

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { authenticated } = state;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (isLoggedIn) {
      dispatch({ type: LOG_IN });
    }
  }, []);

  const logIn = useCallback(() => {
    dispatch({ type: LOG_IN });
    localStorage.setItem(LOCAL_STORAGE_KEY, true);
  }, []);

  const logOut = useCallback(() => {
    dispatch({ type: LOG_OUT });
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
  const context = useContext(AppContext);

  if (context === undefined || context === null) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}

export { AppContext, AppProvider, AppConsumer, useAppContext };
