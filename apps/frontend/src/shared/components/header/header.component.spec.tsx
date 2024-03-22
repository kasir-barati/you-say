import { act, render } from '@testing-library/react';
import { Header } from './header.component';

describe('Header', () => {
  it('should be able to show the Header component', async () => {
    const screen = await act(() => render(<Header />));

    const header = screen.getByTestId('header');

    expect(header).toBeInTheDocument();
  });
});
