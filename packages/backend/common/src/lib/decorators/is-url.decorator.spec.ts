import { generateRandomString } from '@shared';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IsUrl } from './is-url.decorator';

class TestClass {
  @IsUrl()
  test: string;
}

describe('IsUrlDecorator', () => {
  it.each<string>([
    'http://some.com',
    'http://www.home.jp',
    'https://deutschland.de',
    'https://fun.ir/some',
    'http://localhost',
    'http://localhost:3000',
    'http://正妹.香港/',
    'http://www.نبی.com/',
    'http://12.23.12.23:8080/example',
    'https://en.wikipedia.org/wiki/Harry_Potter_(film_series)',
    'http://localhost/file.html',
    'https://foo.com/file.html',
    'http://res.cloudinary.com/hrscywv4p/image/upload/c_fill,g_faces:center,h_128,w_128/yflwk7vffgwyyenftkr7.png',
  ])('should validate a valid URL (%s)', async (url) => {
    const plain = { test: url };
    const testClass = plainToInstance(TestClass, plain);

    const errors = await validate(testClass);

    expect(errors.length).toEqual(0);
  });

  it.each<string>([
    // TODO: these all pass as valid URL as of now :/
    // 'http://.com',
    // 'https://asdas-.com',
    // 'https://-honda.com',
    // 'http://-apple-.com',
    // 'https://we@.com',
    // 'https://we',
    // 'https://www...google...com',
    '',
    generateRandomString(),
    'www.morgan.com',
    'google.com',
    'sdfasdp.ppppppppppp',
    'www.aa',
    '//.com',
    '\\\\\\||||@@@@https://www.google.com',
    'www...google...com',
    'http://www.c:ool.com.au',
  ])('should not let an invalid URL to pass (%s)', async (url) => {
    const plain = { test: url };
    const testClass = plainToInstance(TestClass, plain);

    const errors = await validate(testClass);

    expect(errors.length).toEqual(1);
    expect(errors[0].constraints).toStrictEqual({
      IsUrl: 'test should be a valid URL!',
    });
  });
});
