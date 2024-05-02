import { getDecodedIdToken } from './get-decoded-id-token.util';

describe('getDecodedIdToken', () => {
  it('should return decoded token when valid token is passed', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlcyI6WyJzb21lLXJ1bGUiXX0.v-Qn1fk49n9_-HPNrsnCk_X_ByPi5MYx_AvH4GbxBac';
    const decodedToken = getDecodedIdToken(token);

    expect(decodedToken).toStrictEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
      roles: ['some-rule'],
    });
  });

  it('should set roles to null when roles is not an array of strings', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const decodedToken = getDecodedIdToken(token);

    expect(decodedToken).toStrictEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
      roles: null,
    });
  });

  it('should return undefined for invalid token', () => {
    const token = 'invalid';

    const decodedToken = getDecodedIdToken(token);

    expect(decodedToken).toBeUndefined();
  });
});
