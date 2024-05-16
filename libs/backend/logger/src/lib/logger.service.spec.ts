import { NodeEnv, SinonMock, SinonMockType } from '@shared';
import { LoggerService } from './logger.service';
import { LoggerModuleOptions } from './logger.type';

describe('LoggerService', () => {
  let loggerService: LoggerService;
  let loggerModuleOptions: SinonMockType<LoggerModuleOptions>;

  describe(`NODE_ENV != ${NodeEnv.test}`, () => {
    beforeAll(() => {
      loggerModuleOptions = SinonMock.with<LoggerModuleOptions>({
        nodeEnv: NodeEnv.development,
      });
      loggerService = new LoggerService(loggerModuleOptions);
    });

    it('should log the message and context when NODE_ENV is not test', () => {
      const message = Date.now().toString();
      const context = Date.now().toString();
      const writeSpy = jest.spyOn(process.stdout, 'write');

      loggerService.log(message, context);

      // I could not find a better way to assert since if we use expect.stringContaining(`LOG [${context}] ${message}`) it fails!
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('LOG'),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${message}`),
      );
    });

    it('should log fatal message when NODE_ENV is not test', () => {
      const message = Date.now().toString();
      const context = Date.now().toString();
      const writeSpy = jest.spyOn(process.stdout, 'write');

      loggerService.fatal(message, context);

      // I could not find a better way to assert since if we use expect.stringContaining(`LOG [${context}] ${message}`) it fails!
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('FATAL'),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${message}`),
      );
    });

    it('should log error message when NODE_ENV is not test', () => {
      const message = Date.now().toString();
      const context = Date.now().toString();
      const writeSpy = jest.spyOn(process.stderr, 'write');

      loggerService.error(message, context);

      // I could not find a better way to assert since if we use expect.stringContaining(`LOG [${context}] ${message}`) it fails!
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR'),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${message}`),
      );
    });

    it('should log warning message when NODE_ENV is not test', () => {
      const message = Date.now().toString();
      const context = Date.now().toString();
      const writeSpy = jest.spyOn(process.stdout, 'write');

      loggerService.warn(message, context);

      // I could not find a better way to assert since if we use expect.stringContaining(`LOG [${context}] ${message}`) it fails!
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('WARN'),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${message}`),
      );
    });

    it('should log debug message when NODE_ENV is not test', () => {
      const message = Date.now().toString();
      const context = Date.now().toString();
      const writeSpy = jest.spyOn(process.stdout, 'write');

      loggerService.debug(message, context);

      // I could not find a better way to assert since if we use expect.stringContaining(`LOG [${context}] ${message}`) it fails!
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG'),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${message}`),
      );
    });

    it('should log verbose message when NODE_ENV is not test', () => {
      const message = Date.now().toString();
      const context = Date.now().toString();
      const writeSpy = jest.spyOn(process.stdout, 'write');

      loggerService.verbose(message, context);

      // I could not find a better way to assert since if we use expect.stringContaining(`LOG [${context}] ${message}`) it fails!
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('VERBOSE'),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${message}`),
      );
    });
  });

  describe(`NODE_ENV != ${NodeEnv.development}`, () => {
    beforeAll(() => {
      loggerModuleOptions = SinonMock.with<LoggerModuleOptions>({
        nodeEnv: NodeEnv.production,
      });
      loggerService = new LoggerService(loggerModuleOptions);
    });

    it('should not log debug message when NODE_ENV is not development', () => {
      const message = 'message should not be logged';
      const context = 'context should not be logged';
      const writeSpy = jest.spyOn(process.stdout, 'write');

      loggerService.debug(message, context);

      expect(writeSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });
  });
});
