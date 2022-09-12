import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

// context
import { useAppContext } from '../../context/AppContext';

// components
import Loading from '../Loading/Loading';

// api
import api from '../../api';

// constants
import { appContextUrlEncoded } from '../../constants';

export default function AuthHandler() {
  const { logIn, logOut } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  // parse url params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const loginCodeParam = urlParams.get('loginCode')!;
  const logOutParam = urlParams.get('logout');

  /**
   * Handle authentication. Navigate to root.
   */
  const handleAuthentication = useCallback(async () => {
    try {
      // get token
      const tokenResponse = await api.getAuthToken({
        loginCode: loginCodeParam,
        appContext: appContextUrlEncoded,
      });
      const { token } = tokenResponse.data;

      // get user email after token retrieval
      const userInfoResponse = await api.getUserInfo({
        token,
        appContext: appContextUrlEncoded,
      });
      const { email: userEmail } = userInfoResponse.data;

      logIn(token, userEmail);
      navigate('/');
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [logIn, loginCodeParam, navigate]);

  /**
   * If loginCode provided in url params, try authenticate the user.
   */
  useEffect(() => {
    if (loginCodeParam) {
      handleAuthentication();
    }
  }, [handleAuthentication, loginCodeParam]);

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
