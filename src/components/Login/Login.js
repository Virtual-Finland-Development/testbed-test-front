import { Container, Button, Card } from 'react-bootstrap';

// context
import { useAppContext } from '../../context/AppContext';

function Login() {
  const { logIn } = useAppContext();

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="shadow" style={{ maxWidth: 400 }}>
          <Card.Header className="d-flex justify-content-center">
            <Card.Title>Kuntien väkiluvut alueittain (2020)</Card.Title>
          </Card.Header>
          <Card.Body className="d-flex justify-content-center py-5">
            <Button onClick={logIn}>Kirjaudu</Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
