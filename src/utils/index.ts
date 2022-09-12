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
