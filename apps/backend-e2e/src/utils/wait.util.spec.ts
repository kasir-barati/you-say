import { wait } from './wait.util';

describe('wait', () => {
  it.each<number>([100, 200, 300])(
    'should wait for %d milliseconds',
    async (milliseconds) => {
      const start = new Date().getTime();
      await wait(milliseconds);
      const end = new Date().getTime();

      expect(end - start).toBeGreaterThanOrEqual(milliseconds);
    },
  );
});
