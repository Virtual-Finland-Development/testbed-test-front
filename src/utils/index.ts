import queryString from 'query-string';

interface AppContextObject {
  appName: string;
  redirectUrl: string;
}

export function base64Encode(input: any): string {
  const output = btoa(JSON.stringify(input));
  return output;
}

export function generateAppContext(appContextObject: AppContextObject): string {
  const appContextBase64 = base64Encode(appContextObject);
  return encodeURIComponent(appContextBase64);
}

export function stringifySearchProps(props: any): string {
  const stringifiedOutput = queryString.stringify(
    { ...props },
    {
      arrayFormat: 'comma',
      skipNull: true,
      skipEmptyString: true,
    }
  );
  return stringifiedOutput;
}

export function scrollToElement(element: HTMLElement) {
  if (typeof element?.scrollIntoView === 'function') {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export function isNumericString(str: string | null | undefined) {
  if (typeof str !== 'string') return false;
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}
