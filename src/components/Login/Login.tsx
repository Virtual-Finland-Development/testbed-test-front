import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// context
import { useAppContext, DataType } from '../../context/AppContext';

function Login() {
  const { logIn } = useAppContext();
  const [type, setType] = useState<DataType | null>(null);

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: 400 }}>
          <Card.Header className="d-flex justify-content-center">
            <Card.Title>Valitse tietotyyppi ja kirjaudu</Card.Title>
          </Card.Header>
          <Card.Body className="d-flex flex-column justify-content-center py-5">
            <Form.Select
              defaultValue=""
              onChange={({ target }) => setType(target.value as DataType)}
            >
              <option disabled></option>
              <option value={DataType.OPEN_DATA}>
                Kuntien väkiluvut alueittain (2021)
              </option>
              <option value={DataType.TMT}>Työmarkkinatori</option>
            </Form.Select>
            <Button
              className="mt-4"
              onClick={() => logIn(type as DataType)}
              disabled={!type}
            >
              Kirjaudu
            </Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
