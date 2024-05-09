import { FusionAuthUserSanitizer } from './sanitize-fusionauth-user.helper';

describe('FusionAuthUserSanitizer', () => {
  const fusionAuthUserSanitizer = new FusionAuthUserSanitizer();

  it('should sanitize a fusion auth user', () => {
    const result = fusionAuthUserSanitizer.toUser({
      lastName: 'Huang',
      firstName: 'Wang',
      email: 'wang.li@gmail.com',
      fusionAuthId: 'd881bc4b-9380-4daa-9da7-f90b58557143',
    });

    expect(result).toStrictEqual({
      lastName: 'Huang',
      firstName: 'Wang',
      email: 'wang.li@gmail.com',
      fusionAuthId: 'd881bc4b-9380-4daa-9da7-f90b58557143',
    });
  });

  it.each<undefined | null>([undefined, null])(
    'should throw an error if unsanitized user is %p',
    (data) => {
      expect(() => fusionAuthUserSanitizer.toUser(data)).toThrow(
        '[Error-128d5b9ff79] No data provided',
      );
    },
  );
});
