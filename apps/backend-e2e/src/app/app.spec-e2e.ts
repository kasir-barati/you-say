import { AppApi } from '../api-client';

describe('App', () => {
  const appApi: AppApi = new AppApi();

  it('should return a message -- GET /healthcheck', async () => {
    const res = await appApi.appControllerHealthcheck();

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'healthy' });
  });
});
