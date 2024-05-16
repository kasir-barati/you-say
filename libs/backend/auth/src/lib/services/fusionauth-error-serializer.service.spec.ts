import { FusionAuthOAuthError } from '../types/fusionauth.type';
import { FusionAuthErrorSerializer } from './fusionauth-error-serializer.service';

describe('FusionAuthErrorSerializer', () => {
  let fusionAuthErrorSerializer: FusionAuthErrorSerializer;

  beforeEach(() => {
    fusionAuthErrorSerializer = new FusionAuthErrorSerializer();
  });

  it.each<string>(['example@exam.com', 'temporary@temp.jp'])(
    'should throw duplicate email error',
    (email) => {
      const error: Parameters<
        typeof fusionAuthErrorSerializer.duplicateEmail
      >['0'] = {
        exception: {
          fieldErrors: {
            'user.email': [{ code: '[duplicate]user.email' }],
          },
        },
      };

      expect(() =>
        fusionAuthErrorSerializer.duplicateEmail(error, email),
      ).toThrow(`Email already exists: ${email}`);
    },
  );

  it.each<
    Parameters<typeof fusionAuthErrorSerializer.duplicateEmail>['0']
  >([
    {},
    { exception: { fieldErrors: {} } },
    { exception: { fieldErrors: { something: [] } } },
  ])('should not throw email duplicate error', (error) => {
    expect(() =>
      fusionAuthErrorSerializer.duplicateEmail(error, ''),
    ).not.toThrow();
  });

  it.each<FusionAuthOAuthError>([
    {
      exception: {
        error_description: 'The user credentials are invalid.',
      },
      statusCode: 400,
    },
    {
      exception: {
        error_description: 'some other error.',
      },
      statusCode: 500,
    },
  ])('should throw FusionAuthOAuthError', (error) => {
    expect(() => {
      fusionAuthErrorSerializer.oauthError(error);
    }).toThrow();
  });

  it('should not throw FusionAuthOAuthError when statusCode or error_description are not provided', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fusionAuthErrorSerializer.oauthError(new Error() as any);
    }).not.toThrow();
  });

  it.each<unknown>([
    { message: 'something went wrong', name: 'something' },
    { fieldErrors: { 'some.thing': [] } },
    new Error(),
  ])('should throw unknown error: %o', (error) => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fusionAuthErrorSerializer.oauthError(error as any);
      fusionAuthErrorSerializer.unknownError({
        exception: error,
      });
    }).toThrow(JSON.stringify(error));
  });
});
