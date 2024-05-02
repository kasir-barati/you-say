import { act, render } from '@testing-library/react';
import { Application } from './application.component';

describe('Application', () => {
  it('should show application component', async () => {
    const screen = await act(() => render(<Application />));

    expect(screen).toBeDefined();
  });
});
