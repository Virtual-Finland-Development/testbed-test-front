import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Spinner, Alert } from 'react-bootstrap';
import suomilandscape from '../../suomilandscape.jpeg';

// api
import api from '../../api';

/**
 * Loading spinner component
 */
const Loading = () => (
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Ladataan...</span>
  </Spinner>
);

function Authenticated() {
  const [keyFigures, setKeyFigures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [region, setRegion] = useState(null);
  const [year, setYear] = useState(null);

  async function fetchKeyFigures() {
    setLoading(true);

    try {
      const response = await api.getKeyFigures();
      setKeyFigures(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData(payload) {
    setStatsLoading(true);

    try {
      const response = await api.getData(payload);
      setStats(response.data);
    } catch (error) {
      console.log(error);
      setStatsError(error);
    } finally {
      setTimeout(() => {
        setStatsLoading(false);
      }, 200);
    }
  }

  const setSelection = (type, value) => {
    if (type === 'Alue 2021') setRegion({ code: type, value: value });
    if (type === 'Vuosi') setYear({ code: type, value });
  };

  /**
   * Fetch key figures data on mount to present selection options
   */
  useEffect(() => {
    fetchKeyFigures();
  }, []);

  /**
   * Fetch population number, when params are selected
   */
  useEffect(() => {
    if (region && year) {
      fetchData({
        city_query: region.value,
        year: year.value,
      });
    }
  }, [region, year]);

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Loading />
      </Container>
    );
  }

  if (!keyFigures) {
    return null;
  }

  if (error) {
    return <Alert variant="danger">Something went wrong</Alert>;
  }

  return (
    <div className="w-100 h-100 d-flex">
      <Container className="">
        <Card className="shadow">
          <Card.Img
            variant="top"
            src={suomilandscape}
            style={{
              objectFit: 'cover',
              width: 'auto',
              height: 150,
            }}
          />
          <Card.Header>
            <Card.Title>Kuntien väkiluvut alueittain (2021)</Card.Title>
            <Card.Subtitle>Valitse alue ja vuosi</Card.Subtitle>
            <div className="d-flex flex-row mt-4">
              {keyFigures?.variables &&
                Object.keys(keyFigures.variables)
                  .filter((key, i) => i !== 1)
                  .map((key, i) => {
                    const item = keyFigures.variables[key];

                    return (
                      <Form.Select
                        key={item.code}
                        style={{ maxWidth: 300 }}
                        className="me-4"
                        defaultValue={item.text}
                        onChange={({ target }) =>
                          setSelection(item.text, target.value)
                        }
                      >
                        <option disabled>{item.text}</option>

                        {item.valueTexts.map((text, i) => (
                          <option value={item.valueTexts[i]} key={text}>
                            {text}
                          </option>
                        ))}
                      </Form.Select>
                    );
                  })}
            </div>
          </Card.Header>
        </Card>

        <div className="mt-5">
          <React.Fragment>
            {statsLoading ? (
              <Spinner animation="grow" variant="" />
            ) : (
              <React.Fragment>
                {stats && (
                  <h3>
                    Väkiluku: <b>{stats.value}</b>
                  </h3>
                )}
                {statsError && (
                  <Alert variant="danger">
                    {typeof statsError === 'object' && statsError?.detail?.msg
                      ? statsError.detail.msg
                      : 'Something went wrong.'}
                  </Alert>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        </div>
      </Container>
    </div>
  );
}

export default Authenticated;
