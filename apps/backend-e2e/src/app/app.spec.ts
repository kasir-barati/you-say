import { DefaultApi } from '../api-client';

describe('App', () => {
  const defaultApi: DefaultApi = new DefaultApi();

  it('GET /healthcheck should return a message', async () => {
    const res = await defaultApi.appControllerHealthcheck();

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'healthy' });
  });
});
