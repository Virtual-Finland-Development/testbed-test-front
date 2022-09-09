import Button from 'react-bootstrap/Button';

// context
import { useAppContext } from '../../context/AppContext';

// api
import api from '../../api';

// constants
import { appContextBase64 } from '../../constants';

export default function LogOut() {
  const { logOut } = useAppContext();

  /**
   * Handle log out button click. Redirect user to auth gw logout request route.
   * Pass 'appContextBase64' token as query param.
   */
  const handleLogOutClick = () => {
    logOut();
    // window.location.href = `${api.AUTH_GW_ENDPOINT}/auth/openid/logout-request?appContext=${appContextBase64}`;
  };

  return (
    <Button variant="link" onClick={handleLogOutClick} style={{ padding: 0 }}>
      Kirjaudu ulos
    </Button>
  );
}
