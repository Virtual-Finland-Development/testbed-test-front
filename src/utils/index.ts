export function base64Encode(input: any): string {
  const output = btoa(JSON.stringify(input));
  return output;
}
