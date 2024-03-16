import { AppService } from './app.service';

describe('AppService', () => {
  const service = new AppService();

  describe('healthcheck', () => {
    it("should return { message: 'healthy' }", () => {
      const result = service.healthcheck();

      expect(result).toEqual({ message: 'healthy' });
    });
  });
});
