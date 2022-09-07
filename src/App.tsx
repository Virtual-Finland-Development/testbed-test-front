import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './App.css';

// context
import { AppProvider, AppConsumer } from './context/AppContext';

// components
import Login from './components/Login/Login';
import AppRoutes from './components/AppRoutes/AppRoutes';

function App() {
  return (
    <div className="vh-100 w-100 overflow-hidden">
      <div className="w-100 h-100 d-flex flex-column align-self-center overflow-auto">
        <AppProvider>
          <AppConsumer>
            {provider => {
              if (typeof provider === 'undefined') {
                return null;
              }

              const { authenticated, logOut } = provider;

              return (
                <React.Fragment>
                  <main className="d-flex flex-column flex-fill w-100 justify-content-center align-items-center p-4">
                    {!authenticated ? <Login /> : <AppRoutes />}
                  </main>
                  <footer className="px-4 py-5 text-muted">
                    <Container>
                      <div className="d-flex align-items-center position-relative">
                        <div className="flex-fill d-flex align-items-center justify-content-md-center">
                          Testbed test application
                        </div>
                        {authenticated && (
                          <div className="position-absolute end-0">
                            <Button
                              variant="link"
                              onClick={logOut}
                              style={{ padding: 0 }}
                            >
                              Kirjaudu ulos
                            </Button>
                          </div>
                        )}
                      </div>
                    </Container>
                  </footer>
                </React.Fragment>
              );
            }}
          </AppConsumer>
        </AppProvider>
      </div>
    </div>
  );
}

export default App;
