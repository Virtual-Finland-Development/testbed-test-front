import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
import sinunaImage from '../../sinuna-login-fi.png';

// api
import api from '../../api';

// constants
import { appContextUrlEncoded } from '../../constants';

const StyledLoginButton = styled(Button).attrs({
  variant: 'link',
  className: 'p-0',
})`
  img {
    object-fit: cover;
    width: 200px;
    height: auto;
  }
`;

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
          <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5 position-relative">
            <StyledLoginButton onClick={handleLoginClick} disabled={isLoading}>
              <img src={sinunaImage} alt="sinuna login button" />
            </StyledLoginButton>

            {isLoading && (
              <div style={{ position: 'absolute', bottom: 12 }}>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="mt-4"
                  variant="primary"
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
