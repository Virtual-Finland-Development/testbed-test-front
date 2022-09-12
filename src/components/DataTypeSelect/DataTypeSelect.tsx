import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// constants
import { RouteNames } from '../../constants';

function Login() {
  const [type, setType] = useState<RouteNames | null>(null);
  const navigate = useNavigate();

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: 400, minWidth: 330 }}>
          <Card.Header className="d-flex justify-content-center">
            <Card.Title>Valitse tietotyyppi</Card.Title>
          </Card.Header>
          <Card.Body className="d-flex flex-column justify-content-center py-5">
            <Form.Select
              defaultValue="Valitse..."
              onChange={({ target }) => setType(target.value as RouteNames)}
            >
              <option disabled>Valitse...</option>
              <option value={RouteNames.OPEN_DATA}>
                Kuntien väkiluvut alueittain (2021)
              </option>
              <option value={RouteNames.TMT} disabled>
                Työmarkkinatori (TBD)
              </option>
            </Form.Select>
            <Button
              className="mt-4 align-self-center"
              onClick={() => navigate(type as RouteNames)}
              disabled={!type}
            >
              Näytä
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
