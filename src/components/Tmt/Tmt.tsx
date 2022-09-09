import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import mockData from './mockData.json';

import jobs from '../../jobs.png';

// components
import JobItem from './JobItem';
import Loading from '../Loading/Loading';
import Pagination from '../Pagination/Pagination';

const selectInputs = [
  {
    label: 'Sijainti',
    options: [1, 2, 3, 4, 5],
  },
  {
    label: 'Työnimike',
    options: [1, 2, 3, 4, 5],
  },
];

const itemsPerPage = 10;

function scrollToTop() {
  const mainElement = document.getElementById('main');

  if (typeof mainElement?.scrollIntoView === 'function') {
    mainElement.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function Tmt() {
  const [region, setRegion] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const [currentItems, setCurrentItems] = useState<any[] | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(mockData.content.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(mockData.content.length / itemsPerPage));
  }, [itemOffset]);

  // console.log(mockData);

  const fetchData = async () => {
    setDataLoading(true);

    setTimeout(() => {
      setData(mockData);
      setDataLoading(false);
    }, 200);
  };

  useEffect(() => {
    if (region && type) {
      fetchData();
    }
  }, [region, type]);

  const setSelection = (type: string, value: string) => {
    if (type === 'Sijainti') setRegion(value);
    if (type === 'Työnimike') setType(value);
  };

  const handlePageClick = (selected: number) => {
    scrollToTop();
    const newOffset = (selected * itemsPerPage) % mockData.content.length;
    setItemOffset(newOffset);
  };

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
            <div className="d-flex flex-row mt-4">
              {selectInputs.map(item => (
                <Form.Select
                  key={item.label}
                  style={{ maxWidth: 300 }}
                  className="me-4"
                  defaultValue={item.label}
                  onChange={({ target }) =>
                    setSelection(item.label, target.value)
                  }
                >
                  <option disabled>{item.label}</option>

                  {item.options.map(option => (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              ))}
            </div>
          </Card.Header>
        </Card>

        {dataLoading && (
          <div className="p-4 d-flex align-items-center justify-content-center w-100">
            <Loading />
          </div>
        )}

        {!dataLoading && data && currentItems && (
          <React.Fragment>
            <div className="mt-4 d-flex flex-column" style={{ gap: '1rem' }}>
              {currentItems.map((item: any) => (
                <JobItem key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-4">
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
