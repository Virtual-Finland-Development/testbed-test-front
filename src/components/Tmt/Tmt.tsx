import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FormEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { IoCloseCircle, IoClose } from 'react-icons/io5';

import jobs from '../../jobs.png';

// components
import JobItem from './JobItem';
import Loading from '../Loading/Loading';
import Pagination from '../Pagination/Pagination';

// api
import api, { TmtPostPayload } from '../../api';

// utils
import {
  stringifySearchProps,
  isNumericString,
  scrollToElement,
} from '../../utils';

// selections
import regions from './selections/regions.json';
import municipalities from './selections/municipalities.json';
import countries from './selections/countries.json';

enum PlaceType {
  REGION,
  MUNICIPALITY,
  COUNTRY,
}

interface PlaceSelection {
  type?: PlaceType;
  Alkupaiva: string;
  Koodi: string;
  Laajennukset?: any[];
  Loppupaiva: string;
  Muokkausaika: string;
  Selitteet: {
    Kielikoodi: string;
    Teksti: string;
  }[];
}

export interface JobPostingEntry {
  employer: string;
  location: {
    municipality: string;
    postcode: string;
  };
  basicInfo: {
    title: string;
    description: string;
    workTimeType: '01' | '02';
  };
  publishedAt: string;
  applicationEndDate: string;
  applicationUrl: string;
}

// Utility component to render selection options (region, municipality, country)
const mapSelectOptions = (
  type: PlaceType,
  items: PlaceSelection[],
  placesInState: PlaceSelection[]
) => (
  <React.Fragment>
    {items.map((item: PlaceSelection) => (
      <option
        key={item.Koodi}
        value={JSON.stringify({ ...item, type })}
        disabled={Boolean(placesInState.find(p => p.Koodi === item.Koodi))}
      >
        {item.Selitteet.find(s => s.Kielikoodi === 'fi')?.Teksti || ''}
      </option>
    ))}
  </React.Fragment>
);

export default function Tmt() {
  // state search selections
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [search, setSearch] = useState<string | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceSelection[]>([]);

  // state data
  const [data, setData] = useState<null | {
    results: JobPostingEntry[];
    totalCount: number;
  }>(null);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // pagination
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [offset, setOffset] = useState<number | null>(null);

  /**
   * Fetch TMT data, set to state.
   */
  const fetchData = useCallback(
    async (payload: TmtPostPayload) => {
      setDataLoading(true);

      try {
        const response = await api.getTmtData(payload);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setDataLoading(false);

        if (!dataInitialized) {
          setDataInitialized(true);
        }
      }
    },
    [dataInitialized]
  );

  /**
   * 'searchParamsState', tracked to construct URL params based on user actions.
   */
  const searchParamsState = useMemo(
    () => ({
      q: search,
      sp: selectedPlaces.map(place => place.Koodi),
      p: pageNumber,
      l: limit,
    }),
    [limit, pageNumber, search, selectedPlaces]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const searchInParams = searchParams.get('q')!;
  const placesInParams = searchParams.get('sp');
  const pageInParams = searchParams.get('p');
  const limitInParams = searchParams.get('l');

  /**
   * Modify state on mount, if any state parameters can be parsed from URL.
   * This is in the case of user refreshing page, to automatically fetch data with given params.
   */
  useEffect(() => {
    if (searchInParams) {
      setSearch(searchInParams);
    }

    if (placesInParams) {
      setSelectedPlaces(
        [
          ...regions.map(r => ({ ...r, type: PlaceType.REGION })),
          ...municipalities.map(m => ({ ...m, type: PlaceType.MUNICIPALITY })),
          ...countries.map(c => ({ ...c, type: PlaceType.COUNTRY })),
        ].filter(p => placesInParams.split(',').includes(p.Koodi))
      );
    }

    // Set limit, pageNumber and offset to state on mount, only if search or selected places can be parsed from url (required for POST)
    if (searchInParams || placesInParams) {
      if (pageInParams && isNumericString(pageInParams)) {
        const pageToNumber = parseInt(pageInParams) - 1; // page number handled internally starting at 0, only presented starting at 1.
        const limit =
          limitInParams && isNumericString(limitInParams)
            ? parseInt(limitInParams)
            : 25;
        setPageNumber(pageToNumber);
        setLimit(limit);
        setOffset(pageToNumber * limit);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Track searchParamsState, reflect user selections in URL.
   */
  useEffect(() => {
    const stringifiedParams: string = stringifySearchProps(searchParamsState);
    setSearchParams(stringifiedParams, { replace: true });
  }, [searchParamsState, setSearchParams]);

  /**
   * Track search / selectedPlaces / limit / offset state, construct payload and initiate data fetch.
   * Only if search or any selected places are defined.
   */
  useEffect(() => {
    if (typeof search === 'string' || selectedPlaces.length) {
      const payload = {
        query: typeof search === 'string' ? search.split(' ').toString() : '',
        location: {
          regions: selectedPlaces
            .filter(p => p.type === PlaceType.REGION)
            .map(p => p.Koodi),
          municipalities: selectedPlaces
            .filter(p => p.type === PlaceType.MUNICIPALITY)
            .map(p => p.Koodi),
          countries: selectedPlaces
            .filter(p => p.type === PlaceType.COUNTRY)
            .map(p => p.Koodi),
        },
        paging: {
          limit: limit || 25,
          offset: offset || 0,
        },
      };
      fetchData(payload);
    }
  }, [fetchData, limit, offset, search, selectedPlaces]);

  /**
   * Handle form submit. Set search to state from input.
   */
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setSearch(searchInputValue);
    },
    [searchInputValue]
  );

  /**
   * Handle pagination page click. Scroll to top, calculate offset.
   */
  const handlePageClick = (selectedPage: number) => {
    scrollToElement(document.getElementById('main')!);
    setPageNumber(selectedPage + 1); // page number handled internally starting at 0, only presented starting at 1.
    setOffset(selectedPage * (limit || 25));
  };

  if (error) {
    return <Alert variant="danger">Something went wrong</Alert>;
  }

  return (
    <div className="w-100 h-100 d-flex">
      <Container id="tmt">
        <Card className="shadow">
          <Card.Img
            variant="top"
            src={jobs}
            style={{
              objectFit: 'contain',
              width: 'auto',
              height: 150,
            }}
          />
          <Card.Header>
            <Card.Title>Työmarkkinatorin työnhaku</Card.Title>
            <Card.Subtitle>Käytä hakua ja valitse sijainti</Card.Subtitle>
            <Form
              className="d-flex flex-row flex-wrap mt-4"
              style={{ rowGap: '0.5rem' }}
              onSubmit={handleSubmit}
            >
              <Form.Control
                placeholder="Kirjoita hakusana..."
                style={{ maxWidth: 400 }}
                className="me-4"
                defaultValue={search || ''}
                onChange={({ target }) => setSearchInputValue(target.value)}
              />
              <Form.Select
                style={{ maxWidth: 300 }}
                value="placeholder"
                className="me-4"
                onChange={({ target }) =>
                  setSelectedPlaces(places => [
                    ...places,
                    JSON.parse(target.value),
                  ])
                }
              >
                <option disabled value="placeholder">
                  Valitse sijainti...
                </option>
                <optgroup label="Maakunta">
                  {mapSelectOptions(PlaceType.REGION, regions, selectedPlaces)}
                </optgroup>
                <optgroup label="Kunta">
                  {mapSelectOptions(
                    PlaceType.MUNICIPALITY,
                    municipalities,
                    selectedPlaces
                  )}
                </optgroup>
                <optgroup label="Maa">
                  {mapSelectOptions(
                    PlaceType.COUNTRY,
                    countries,
                    selectedPlaces
                  )}
                </optgroup>
              </Form.Select>
              <Button type="submit">Näytä työpaikat</Button>
            </Form>
          </Card.Header>
        </Card>

        {selectedPlaces.length > 0 && (
          <div
            className="w-100 d-flex flex-row flex-wrap mt-4"
            style={{ gap: '0.7rem' }}
          >
            {selectedPlaces.map(place => (
              <div key={place.Koodi} className="p-2 border rounded bg-light">
                <span className="fw-semibold" style={{ fontSize: '14px' }}>
                  {place.Selitteet[0]?.Teksti || place.Koodi}
                </span>
                <IoCloseCircle
                  className="text-danger ms-2"
                  role="button"
                  onClick={() =>
                    setSelectedPlaces(places =>
                      places.filter(p => p.Koodi !== place.Koodi)
                    )
                  }
                />
              </div>
            ))}
            <div className="p-2 d-flex align-items-center justify-content-center">
              <div role="button" onClick={() => setSelectedPlaces([])}>
                <span className="fw-semibold text-primary">
                  Tyhjennä rajaukset
                </span>
                <IoClose
                  size="20"
                  className="text-primary ms-2"
                  role="button"
                />
              </div>
            </div>
          </div>
        )}

        {!dataInitialized && dataLoading && (
          <div className="p-4 d-flex align-items-center justify-content-center w-100">
            <Loading />
          </div>
        )}

        {data && (
          <React.Fragment>
            <div
              className="mt-4 d-flex flex-column"
              style={{
                gap: '1rem',
                opacity: dataLoading ? '0.5' : '1',
                pointerEvents: dataLoading ? 'none' : 'initial',
              }}
            >
              {data.results.map((item: JobPostingEntry, index: number) => (
                <JobItem key={index} item={item} />
              ))}
            </div>

            <div className="d-flex flex-column mt-4">
              <div className="d-flex flex-row align-items-center">
                <Form.Label className="mt-2 fw-semibold">
                  Tuloksia sivulla
                </Form.Label>
                <Form.Select
                  className="ms-4"
                  style={{ maxWidth: 150 }}
                  onChange={({ target }) =>
                    setLimit(parseInt(target.value, 10))
                  }
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                </Form.Select>
              </div>
              <Pagination
                pageCount={Math.ceil(data.totalCount / (limit || 25))}
                initialPage={pageNumber || 0}
                onPageChange={handlePageClick}
              />
            </div>
          </React.Fragment>
        )}
      </Container>
    </div>
  );
}
