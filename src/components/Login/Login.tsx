import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// context
import { useAppContext } from '../../context/AppContext';

// api
import api from '../../api';

// constants
import { appContextBase64 } from '../../constants';

function Login() {
  const { logIn } = useAppContext();

  /**
   * Handle login button click. Redirect user to auth gw login request route.
   * Pass 'appContextBase64' token as query param.
   */
  const handleLoginClick = () => {
    window.location.href = `${api.AUTH_GW_ENDPOINT}/auth/openid/login-request?appContext=${appContextBase64}`;
  };

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: 400, minWidth: 330 }}>
          <Card.Header className="d-flex justify-content-center">
            <Card.Title>Testbed test application</Card.Title>
          </Card.Header>
          <Card.Body className="d-flex justify-content-center py-5">
            <Button onClick={() => logIn('dummyToken')}>Kirjaudu</Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
