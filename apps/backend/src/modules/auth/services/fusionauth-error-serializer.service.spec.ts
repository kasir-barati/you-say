import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
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

  it.each([
    { message: 'something went wrong', name: 'something' },
    { fieldErrors: { 'some.thing': [] } },
  ])('should throw fusion auth error', (error) => {
    expect(() =>
      fusionAuthErrorSerializer.fusionAuthError({
        exception: error,
      } as ClientResponse<unknown>),
    ).toThrow(JSON.stringify(error));
  });
});
