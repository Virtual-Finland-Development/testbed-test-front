import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

// api
import api from '../../api';

// constants
import { appContextUrlEncoded } from '../../constants';

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle login button click. Redirect user to auth gw login request route.
   * Pass 'appContextUrlEncoded' token as query param.
   */
  const handleLoginClick = () => {
    setIsLoading(true);
    window.location.assign(
      `${api.AUTH_GW_ENDPOINT}/auth/openid/login-request?appContext=${appContextUrlEncoded}`
    );
  };

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: 400, minWidth: 330 }}>
          <Card.Header className="d-flex justify-content-center">
            <Card.Title>Testbed test application</Card.Title>
          </Card.Header>
          <Card.Body className="d-flex justify-content-center py-5">
            <Button onClick={handleLoginClick} disabled={isLoading}>
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
              <span>{isLoading ? 'Ladataan...' : 'Kirjaudu'}</span>
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
