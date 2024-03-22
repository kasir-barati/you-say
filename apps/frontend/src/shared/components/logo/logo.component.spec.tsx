import { act, render } from '@testing-library/react';
import { Logo } from './logo.component';

describe('Logo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show logo', async () => {
    const screen = await act(() => render(<Logo />));

    const logo = screen.getByTestId('logo-text');

    expect(logo).toBeInTheDocument();
  });
});
