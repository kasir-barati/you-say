import { wait } from './wait.util';

describe('wait', () => {
  it.each<number>([100, 200, 300])(
    'should wait for %d milliseconds',
    async (milliseconds) => {
      const start = Date.now();
      await wait(milliseconds);
      // +1 since sometimes the test where flaky and did not pass
      const end = Date.now() + 1;

      expect(end - start).toBeGreaterThanOrEqual(milliseconds);
    },
  );
});
