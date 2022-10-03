import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

// api
import api, { AuthProvider } from '../../api';

// constants
import { LOCAL_STORAGE_AUTH_PROVIDER } from '../../constants';

export default function LogOut() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle log out button click. Redirect user to auth gw logout request route.
   * Pass 'appContextUrlEncoded' token as query param.
   */
  const handleLogOutClick = () => {
    setIsLoading(true);

    const provider = localStorage.getItem(LOCAL_STORAGE_AUTH_PROVIDER)!;
    api.directToAuthGwLogout(provider as AuthProvider);
  };

  return (
    <Button variant="link" onClick={handleLogOutClick} style={{ padding: 0 }}>
      {isLoading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-3"
        />
      )}
      <span>{isLoading ? 'Kirjaudutaan ulos...' : 'Kirjaudu ulos'}</span>
    </Button>
  );
}
