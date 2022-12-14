import { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// context
import { useAppContext } from '../../context/AppContext';

// components
import Loading from '../Loading/Loading';

// api
import api, { AuthProvider } from '../../api';

// constants
import {
  appContextUrlEncoded,
  LOCAL_STORAGE_ROUTE_NAME,
} from '../../constants';

export default function AuthHandler() {
  const { logIn, logOut } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  // parse query params
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);
  const authProviderParam = queryParams.get('provider');
  const loginCodeParam = queryParams.get('loginCode');
  const logOutParam = queryParams.get('logout');

  /**
   * Handle authentication for Sinuna/Suomi.fi.
   * Fetch token, fetch user email. Navigate to stored route / root.
   */
  const handleAuthentication = useCallback(
    async (authProvider: AuthProvider) => {
      try {
        // get token
        const loggedInState = await api.logIn(
          {
            loginCode: loginCodeParam as string,
            appContext: appContextUrlEncoded,
          },
          authProvider
        );

        logIn(
          authProviderParam as AuthProvider,
          loggedInState,
          loggedInState.profileData?.email
        );
        navigate(localStorage.getItem(LOCAL_STORAGE_ROUTE_NAME) || '/');
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [authProviderParam, logIn, loginCodeParam, navigate]
  );

  /**
   * If loginCode provided in url params, try authenticate the user.
   */
  useEffect(() => {
    if (authProviderParam && loginCodeParam) {
      if (
        Object.values(AuthProvider).includes(authProviderParam as AuthProvider)
      ) {
        handleAuthentication(authProviderParam as AuthProvider);
      }
    }
  }, [authProviderParam, handleAuthentication, loginCodeParam]);

  /**
   * If logout redirect and logout flag in url params, log out user. Navigate to root.
   */
  useEffect(() => {
    if (logOutParam) {
      if (logOutParam === 'success') {
        logOut();
        navigate('/');
      } else {
        setLoading(false);
        setError({ message: 'Logout request failed.' });
      }
    }
  }, [logOut, logOutParam, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <span className="d-block fw-bold">
          {error.message ?? 'Unknown error occured.'}
        </span>
        {error?.response?.data?.message && (
          <span className="d-block">{error.response.data.message}</span>
        )}
        <Link to="/">Palaa alkuun</Link>
      </Alert>
    );
  }

  return null;
}
