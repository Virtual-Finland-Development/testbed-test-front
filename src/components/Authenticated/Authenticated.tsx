import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import suomilandscape from '../../suomilandscape.jpeg';

// api
import api from '../../api';

interface KeyFiguresOption {
  code: string;
  text: string;
  valueTexts: string[];
  values: string[];
}

interface KeyFigures {
  title: string;
  variables: KeyFiguresOption[];
}

interface Stats {
  description: string;
  population: number;
  sourceName: string;
  updatedAt: string;
}

/**
 * Loading spinner component
 */
const Loading = () => (
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Ladataan...</span>
  </Spinner>
);

function Authenticated() {
  const [keyFigures, setKeyFigures] = useState<KeyFigures | null>(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState<Boolean>(false);
  const [statsError, setStatsError] = useState<any>(null);
  const [region, setRegion] = useState<{ code: string; value: string } | null>(
    null
  );
  const [year, setYear] = useState<{ code: string; value: string } | null>(
    null
  );

  async function fetchKeyFigures() {
    setLoading(true);

    try {
      const response = await api.getKeyFigures();
      setKeyFigures(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData(payload: { city: string; year: string }) {
    setStatsLoading(true);
    setStatsError(null);
    setStats(null);

    try {
      const response = await api.getData(payload);
      setStats(response.data);
    } catch (error) {
      setStatsError(error);
    } finally {
      setTimeout(() => {
        setStatsLoading(false);
      }, 200);
    }
  }

  const setSelection = (type: string, value: string) => {
    if (type === 'Alue 2021') setRegion({ code: type, value });
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
        city: region.value,
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
                Object.entries(keyFigures.variables)
                  .filter(([key, value], i) => i !== 1)
                  .map(([key, value], i) => {
                    const item: KeyFiguresOption = value;

                    return (
                      <Form.Select
                        data-testid={`selection-input-${i}`}
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

        <div className="mt-4">
          <React.Fragment>
            {statsLoading ? (
              <Spinner animation="grow" variant="" />
            ) : (
              <React.Fragment>
                {stats && (
                  <React.Fragment>
                    <h3 className="mb-0">
                      <span>{stats?.description || 'Väkiluku'}:</span>{' '}
                      <span className="fw-bold">{stats?.population || ''}</span>
                    </h3>
                    {stats?.sourceName && (
                      <span className="d-block text-muted">
                        Lähde: {stats.sourceName}
                      </span>
                    )}
                  </React.Fragment>
                )}
                {statsError && (
                  <Alert variant="danger">
                    {typeof statsError === 'object' &&
                    statsError?.response?.data?.detail
                      ? statsError.response.data.detail
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
