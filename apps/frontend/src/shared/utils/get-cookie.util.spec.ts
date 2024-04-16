import { getCookie } from './get-cookie.util';

describe('getCookie', () => {
  /**
   * tl:dr How document.cookie is working in the browser and jest is not that easy to understand.
   *
   * document.cookie returns something like this: "key1=value1; key2=value2"
   *
   * If you assign a new value to document.cookie it will:
   * 1. Overrides cookies that are in the new string
   * 2. And add the new cookies if any.
   *
   * e.g. If "key1=value1; key2=value2" is what returns document.cookie when we call it.
   * And then assign empty string to it: document.cookie = ""
   * document.cookie will not change and will return "key1=value1; key2=value2"
   * But if you assign "key1=" to document.cookie your key2 will be present in your document.cookie.
   *
   * So now that jest doesn’t seem to reset document.cookie between tests, we’ll have to do it manually.
   * In other word we need to explicitly mention every cookie in order to clear them, so let’s just use these keys.
   */
  beforeEach(() => {
    document.cookie = 'key1=';
    document.cookie = 'key2=';
  });

  it.each<{ key: string; value: string }>([
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
  ])(
    'getCookie should return $value when we are getting $key',
    ({ key, value }) => {
      document.cookie = `${key}=${value}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cookie = getCookie(key as any);

      expect(cookie).toBe(value);
    },
  );

  it('getCookie should return undefined when the key is not present', () => {
    const cookies = getCookie('id_token');

    expect(cookies).toBeUndefined();
  });
});
