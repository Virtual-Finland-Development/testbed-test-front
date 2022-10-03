import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

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
   * Handle Sinuna authentication. Navigate to stored route / root.
   */
  const handleSinunaAuthentication = useCallback(async () => {
    try {
      // get token
      const tokenResponse = await api.getAuthToken({
        loginCode: loginCodeParam as string,
        appContext: appContextUrlEncoded,
      });
      const { token } = tokenResponse.data;

      // get user email after token retrieval
      const userInfoResponse = await api.getUserInfo(
        authProviderParam as AuthProvider,
        {
          token,
          appContext: appContextUrlEncoded,
        }
      );
      const { email: userEmail } = userInfoResponse.data;

      logIn(authProviderParam as AuthProvider, token, userEmail);
      navigate(localStorage.getItem(LOCAL_STORAGE_ROUTE_NAME) || '/');
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [logIn, loginCodeParam, navigate, authProviderParam]);

  /**
   * Handle Suomi.fi authentication. No separate token needs to be fetched.
   * Use loginCode (suomi.fi nameID) to fetch userInfo. Navigate to stored route / root.
   */
  const handleSuomiFiAuthentication = useCallback(async () => {
    try {
      // get user info for SuomiFI auth
      const userInfoResponse = await api.getUserInfo(
        authProviderParam as AuthProvider,
        {
          token: loginCodeParam!,
          appContext: appContextUrlEncoded,
        }
      );
      const {
        profile: { email },
      } = userInfoResponse.data;

      logIn(authProviderParam as AuthProvider, loginCodeParam!, email);
      navigate(localStorage.getItem(LOCAL_STORAGE_ROUTE_NAME) || '/');
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [authProviderParam, logIn, loginCodeParam, navigate]);

  /**
   * If loginCode provided in url params, try authenticate the user.
   */
  useEffect(() => {
    if (authProviderParam && loginCodeParam) {
      if (authProviderParam === AuthProvider.SINUNA) {
        handleSinunaAuthentication();
      } else if (authProviderParam === AuthProvider.SUOMIFI) {
        handleSuomiFiAuthentication();
      }
    }
  }, [
    handleSinunaAuthentication,
    loginCodeParam,
    authProviderParam,
    handleSuomiFiAuthentication,
  ]);

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
