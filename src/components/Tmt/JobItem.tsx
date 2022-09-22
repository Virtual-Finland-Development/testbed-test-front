import styled from 'styled-components';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { format, parseISO } from 'date-fns';
import { IoLocationOutline, IoCalendarOutline } from 'react-icons/io5';

import { JobPostingEntry } from './Tmt';

const StyledBadge = styled(Badge).attrs({
  bg: 'light',
  text: 'dark',
  className: 'border',
})`
  background-color: #fff !important;
`;

const CardBodyRight = styled.div.attrs({ className: 'flex-fill' })``;

const CardBodyLeft = styled.div.attrs({
  className:
    'd-flex flex-column justify-content-center align-items-md-end mb-2 w-auto',
})`
  min-width: 33.3333%;

  .additional-info {
    font-size: 15px;
    cursor: pointer;
  }
`;

export default function JobItem({ item }: { item: any /* JobPostingEntry */ }) {
  // item host
  const domain = item.applicationUrl?.value
    ? new URL(item.applicationUrl.value)
    : null;
  const host =
    item.applicationUrl?.value && domain?.host
      ? domain.host.replace('www.', '')
      : null;
  /*  const domain = item.applicationUrl ? new URL(item.applicationUrl) : null;
  const host =
    item.applicationUrl && domain?.host ? domain.host.replace('www', '') : null; */

  // if (item) return null;

  return (
    <Card>
      <Card.Header className="d-flex flex-row align-items-center">
        <span className="fw-bold flex-fill">{item.title.fi}</span>
        <StyledBadge>
          {item.workTime === 'FULLTIME' ? 'Kokoaikatyö' : 'Osa-aikatyö'}
        </StyledBadge>
      </Card.Header>
      <Card.Body className="d-flex flex-wrap-reverse flex-md-nowrap">
        <CardBodyRight>
          <span className="d-block">{item.lead.fi}</span>
          {host && (
            <span className="d-block mt-2">
              <a
                href={item.applicationUrl.value}
                target="_blank"
                rel="noreferrer"
              >
                {host}
              </a>
            </span>
          )}
        </CardBodyRight>
        <CardBodyLeft>
          <span className="d-block fw-bold">
            {item.employer.name || 'Anonyymi työnantaja'}
          </span>
          <span className="d-block text-capitalize additional-info">
            <IoLocationOutline />{' '}
            {item.location?.address?.postOffice
              ? item.location.address.postOffice.toLowerCase()
              : ''}
          </span>
          {item.applicationPeriodEndDate && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${item.title.fi}`}>
                  Hakuaika päättyy
                </Tooltip>
              }
            >
              <span className="d-block additional-info">
                <IoCalendarOutline />{' '}
                {format(
                  parseISO(item.applicationPeriodEndDate),
                  'dd.MM.yyyy HH:mm'
                )}
              </span>
            </OverlayTrigger>
          )}
        </CardBodyLeft>
      </Card.Body>
    </Card>
  );

  /* return (
    <Card>
      <Card.Header className="d-flex flex-row align-items-center">
        <span className="fw-bold flex-fill">{item.basicInfo.title}</span>
        {
          <StyledBadge>
            {item.basicInfo.workTimeType === '01'
              ? 'Kokoaikatyö'
              : 'Osa-aikatyö'}
          </StyledBadge>
        }
      </Card.Header>
      <Card.Body className="d-flex flex-wrap-reverse flex-md-nowrap">
        <CardBodyRight>
          <span className="d-block">{item.basicInfo.description}</span>
          {host && (
            <span className="d-block mt-2">
              <a href={item.applicationUrl} target="_blank" rel="noreferrer">
                {host}
              </a>
            </span>
          )}
        </CardBodyRight>
        <CardBodyLeft>
          <span className="d-block fw-bold">
            {item.employer || 'Anonyymi työnantaja'}
          </span>
          <span className="d-block text-capitalize additional-info">
            <IoLocationOutline />{' '}
            {item.location.municipality
              ? item.location.municipality.toLowerCase()
              : ''}
          </span>
          {item.applicationEndDate && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${item.title.fi}`}>
                  Hakuaika päättyy
                </Tooltip>
              }
            >
              <span className="d-block additional-info" style>
                <IoCalendarOutline />{' '}
                {format(parseISO(item.applicationEndDate), 'dd.MM.yyyy HH:mm')}
              </span>
            </OverlayTrigger>
          )}
        </CardBodyLeft>
      </Card.Body>
    </Card>
  ); */
}
