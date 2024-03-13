import { jsonParser } from './json-parser.util';

describe('jsonParser', () => {
  it.each<string>([
    '{"email":"e1710363209234@mail.js","firstName":"name","lastName":"family"}',
    '{"message":"hi","type":"system","errno":"ECONNREFUSED","code":"ECONNREFUSED"}',
  ])('should parse %s safely', (stringifiedObject) => {
    const parsedObject = jsonParser(stringifiedObject);

    expect(parsedObject).toEqual(expect.any(Object));
  });

  it.each<string>(['asdas', '{}{}', '{{}}'])(
    'should return the string passed to it when it is not a valid json',
    (invalidInput) => {
      const parsedObject = jsonParser(invalidInput);

      expect(parsedObject).toEqual(invalidInput);
    },
  );
});
