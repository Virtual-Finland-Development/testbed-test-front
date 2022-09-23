import React from 'react';
import Container from 'react-bootstrap/Container';
import './App.css';

// context
import { AppProvider, AppConsumer } from './context/AppContext';

// components
import Loading from './components/Loading/Loading';
import LoginRoutes from './components/LoginRoutes/LoginRoutes';
import AppRoutes from './components/AppRoutes/AppRoutes';
import LogOut from './components/LogOut/LogOut';

function App() {
  return (
    <div className="w-100 h-100 d-flex flex-column align-self-center overflow-auto">
      <AppProvider>
        <AppConsumer>
          {provider => {
            if (typeof provider === 'undefined') {
              return null;
            }

            const { authenticated, loading } = provider;

            return (
              <React.Fragment>
                <main
                  className="d-flex flex-column flex-fill w-100 justify-content-center align-items-center p-4"
                  id="main"
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    <React.Fragment>
                      {!authenticated ? <LoginRoutes /> : <AppRoutes />}
                    </React.Fragment>
                  )}
                </main>
                <footer className="px-4 py-5 text-muted">
                  <Container>
                    <div className="d-flex align-items-center position-relative">
                      <div className="flex-fill d-flex align-items-center justify-content-md-center">
                        Testbed test application
                      </div>
                      {!loading && authenticated && (
                        <div className="position-absolute end-0">
                          <LogOut />
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
  );
}

export default App;
