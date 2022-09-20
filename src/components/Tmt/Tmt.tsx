import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FormEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { IoCloseCircle, IoClose } from 'react-icons/io5';

import mockData from './mockData.json';

import jobs from '../../jobs.png';

// components
import JobItem from './JobItem';
import Loading from '../Loading/Loading';
import Pagination from '../Pagination/Pagination';

// api
import api from '../../api';

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

interface JobAd {
  hakeminen: {
    hakemisenUrl: string;
    hakuaikaPaattyy: string;
    ilmoittajanYhteystiedot: {
      puhelinNro: string;
      sposti: string;
    };
  };
}

function stringifySearchProps(search: string | null, props: any): string {
  const s = typeof search === 'string' ? search : window.location.search;
  // Parse 'search' parameter to an object.
  const params = queryString.parse(s, {
    arrayFormat: 'index',
    parseNumbers: true,
    parseBooleans: true,
  });

  // Create output object with url params & props
  let output = { ...params, ...props };

  // Empty filters
  output.sp = [];

  // Pass filters to output as an array
  // Item format { name:operator:value:related }
  if (props?.sp && props.sp.length) {
    for (const place of props.sp) {
      output.sp.push(place.Koodi);
    }
  }

  // Stringify output object
  const stringified = queryString.stringify(output, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
  });

  return stringified;
}

const itemsPerPage = 10;

function scrollToTop() {
  const mainElement = document.getElementById('main');

  if (typeof mainElement?.scrollIntoView === 'function') {
    mainElement.scrollIntoView({ behavior: 'smooth' });
  }
}

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
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [search, setSearch] = useState<string | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceSelection[]>([]);
  const [data, setData] = useState<any>(null);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const [currentItems, setCurrentItems] = useState<any[] | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);

  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setDataLoading(true);

    setTimeout(() => {
      setData(mockData);
      setDataLoading(false);

      if (!dataInitialized) {
        setDataInitialized(true);
      }
    }, 200);
  }, [dataInitialized]);

  const searchParamsState = useMemo(
    () => ({
      q: search,
      sp: selectedPlaces,
      p: pageNumber,
      ps: pageSize,
    }),
    [pageNumber, pageSize, search, selectedPlaces]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const searchInParams = searchParams.get('q')!;
  const placesInParams = searchParams.get('sp');

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(mockData.content.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(mockData.content.length / itemsPerPage));
  }, [itemOffset]);

  useEffect(() => {
    const stringified: string = stringifySearchProps(null, searchParamsState);
    setSearchParams(stringified, { replace: true });
  }, [searchParamsState, setSearchParams]);

  useEffect(() => {
    if (typeof search === 'string' || selectedPlaces.length) {
      const payload = {
        query: typeof search === 'string' ? search.split(' ').toString() : '',
        locations: {
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
          pageNumber: pageNumber || 0,
          pageSize: pageSize || 25,
        },
      };
      console.log(payload);
      fetchData();
    }
  }, [fetchData, pageNumber, pageSize, search, selectedPlaces]);

  const handlePageClick = (selected: number) => {
    scrollToTop();
    const newOffset = (selected * itemsPerPage) % mockData.content.length;
    setItemOffset(newOffset);
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setSearch(searchInputValue);
      try {
        // const response = await api.getTmtData({ keywords: search, region });
        // console.log(response);
        // fetchData();
      } catch (error) {
        setError(error);
      }
    },
    [searchInputValue]
  );

  // console.log(search);
  // console.log(regions);

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
            <Card.Subtitle>Valitse sijainti ja työnimike</Card.Subtitle>
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
                  Valitse alue...
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

        {data && currentItems && (
          <React.Fragment>
            <div
              className="mt-4 d-flex flex-column"
              style={{
                gap: '1rem',
                opacity: dataLoading ? '0.5' : '1',
                pointerEvents: dataLoading ? 'none' : 'initial',
              }}
            >
              {currentItems.map((item: any) => (
                <JobItem key={item.id} item={item} />
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
                    setPageSize(parseInt(target.value, 10))
                  }
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                </Form.Select>
              </div>
              <Pagination
                pageCount={pageCount}
                onPageChange={handlePageClick}
              />
            </div>
          </React.Fragment>
        )}
      </Container>
    </div>
  );
}
