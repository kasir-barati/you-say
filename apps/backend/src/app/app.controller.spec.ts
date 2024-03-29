import { SinonMock, SinonMockType } from '@shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: SinonMockType<AppService>;

  beforeEach(() => {
    appService = SinonMock.of<AppService>(AppService);
    controller = new AppController(appService);
  });

  describe('GET /healthcheck', () => {
    it("should return { message: 'healthy' }", () => {
      appService.healthcheck.returns({
        message: 'healthy',
      });

      const result = controller.healthcheck();

      expect(result).toEqual({
        message: 'healthy',
      });
    });
  });
});
