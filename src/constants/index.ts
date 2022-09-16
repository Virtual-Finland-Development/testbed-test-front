import { generateAppContext } from '../utils';

export const LOCAL_STORAGE_AUTH_TOKEN = 'testbed-authToken';
export const LOCAL_STORAGE_USER_EMAIL = 'testbed-userEmail';
export const LOCAL_STORAGE_ROUTE_NAME = 'testbed-routeName';

export enum RouteNames {
  OPEN_DATA = 'opendata',
  TMT = 'tmt',
}

export const applicationUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://d2kwnr7ws0sqwl.cloudfront.net'
    : 'http://localhost:3000';

export const applicationContextObj = {
  appName: 'testbed-test-front',
  redirectUrl: `${applicationUrl}/auth`,
};

export const appContextUrlEncoded = generateAppContext(applicationContextObj);
