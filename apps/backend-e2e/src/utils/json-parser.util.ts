export function jsonParser(json: string): object | string {
  let parsed = json;

  try {
    parsed = JSON.parse(json);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return parsed;
}
