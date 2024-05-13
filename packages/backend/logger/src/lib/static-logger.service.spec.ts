import { NodeEnv } from '@shared';
import { StaticLoggerService } from './static-logger.service';

describe('StaticLoggerService', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe(`NODE_ENV != ${NodeEnv.test}`, () => {
    beforeAll(() => {
      process.env.NODE_ENV = NodeEnv.development;
    });

    it('should log the message and context when NODE_ENV is not test', () => {
      const message = Date.now().toString();
      const context = Date.now().toString();
      const writeSpy = jest.spyOn(process.stdout, 'write');

      StaticLoggerService.log({ message, context });

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

      StaticLoggerService.fatal({ message, context });

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

      StaticLoggerService.error({ message, context });

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

      StaticLoggerService.warn({ message, context });

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

      StaticLoggerService.debug({ message, context });

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

      StaticLoggerService.verbose({ message, context });

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
      process.env.NODE_ENV = NodeEnv.production;
    });

    it('should not log debug message when NODE_ENV is not development', () => {
      const message = 'message should not be logged';
      const context = 'context should not be logged';
      const writeSpy = jest.spyOn(process.stdout, 'write');

      StaticLoggerService.debug({ message, context });

      expect(writeSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(`[${context}]`),
      );
      expect(writeSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });
  });
});
