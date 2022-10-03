import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';

// assets
import sinunaLogo from '../../sinunalogo.png';
import suomiFiLogo from '../../suomifi.png';

// api
import api, { AuthProvider } from '../../api';

enum LoginType {
  SINUNA,
  SUOMIFI,
}

const StyledLoginButton = styled(Button).attrs({
  className: 'd-flex align-items-center',
  size: 'lg',
})`
  width: 200px;
  max-width: 200px;
  height: 48px;
  max-height: 48px;
  padding-top: 0.5rem !important;

  .text {
    font-size: 16px;
    font-weight: 600;
  }

  &.sinuna {
    background: #203ccc !important;
    border-color: #203ccc !important;

    .text {
      margin-left: 0.5rem;
    }

    img {
      object-fit: cover;
      width: 22px;
      height: auto;
    }
  }

  &.suomifi {
    background: #003479 !important;
    border-color: #003479 !important;

    .text {
      margin-left: 2px;
    }

    img {
      object-fit: cover;
      width: 38px;
      height: auto;
      margin-left: -10px;
    }
  }
`;

const StyledLoadingSpinner = styled(Spinner).attrs({
  animation: 'border',
  size: 'sm',
  role: 'status',
  className: 'position-absolute mt-4',
  variant: 'primary',
  'aria-label': 'login-loading-spinner',
})`
  bottom: 16px;
`;

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle login button click. Redirect user to auth gw login request route.
   * Pass 'appContextUrlEncoded' token as query param.
   */
  const handleLoginClick = (loginType: LoginType) => {
    setIsLoading(true);

    if (loginType === LoginType.SINUNA) {
      api.directToAuthGwLogin(AuthProvider.SINUNA);
    } else if (loginType === LoginType.SUOMIFI) {
      api.directToAuthGwLogin(AuthProvider.SUOMIFI);
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: 400, minWidth: 330 }}>
          <Card.Header className="d-flex justify-content-center">
            <Card.Title>Testbed test application</Card.Title>
          </Card.Header>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center py-5 position-relative gap-3">
            <StyledLoginButton
              onClick={() => handleLoginClick(LoginType.SINUNA)}
              disabled={isLoading}
              aria-label="sinuna-login-button"
              className="sinuna"
            >
              <img id="sinuna-img" src={sinunaLogo} alt="sinuna login button" />
              <span className="text">Kirjaudu Sinunalla</span>
            </StyledLoginButton>

            <StyledLoginButton
              onClick={() => handleLoginClick(LoginType.SUOMIFI)}
              disabled={isLoading}
              aria-label="suomifi-login-button"
              className="suomifi"
            >
              <img
                id="suomifi-img"
                src={suomiFiLogo}
                alt="sinuna login button"
              />
              <span className="text">Kirjaudu Suomi.fi</span>
            </StyledLoginButton>

            {isLoading && <StyledLoadingSpinner />}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
