import { useEffect, useState, useCallback } from 'react';
import Alert from 'react-bootstrap/Alert';

// context
import { useAppContext } from '../../context/AppContext';

// components
import Loading from '../Loading/Loading';

// api
import api from '../../api';

// constants
import { appContextBase64 } from '../../constants';

export default function AuthHandler() {
  const { logIn, logOut } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  // parse url params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const loginCodeParam = urlParams.get('code')!;
  const logOutParam = urlParams.get('logout');

  /**
   * Handle authentication.
   */
  const handleAuthentication = useCallback(async () => {
    try {
      const response = await api.getAuthToken({
        loginCode: loginCodeParam,
        appContext: appContextBase64,
      });
      const { token } = response.data;
      logIn(token);
    } catch (error) {
      // const error = err as AxiosError;
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [logIn, loginCodeParam]);

  /**
   * If loginCode provided in url params, try authenticate the user.
   */
  useEffect(() => {
    if (loginCodeParam) {
      handleAuthentication();
    }
  }, [handleAuthentication, loginCodeParam]);

  /**
   * If logout redirect and logout flag in url params, log out user;
   */
  useEffect(() => {
    if (logOutParam) {
      logOut();
    }
  }, [logOut, logOutParam]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <span className="d-block fw-bold">
          {error.message ?? 'Unknown error occured.'}
        </span>
        {error?.response?.data?.message ?? (
          <span>{error.response.data.message}</span>
        )}
      </Alert>
    );
  }

  return null;
}
