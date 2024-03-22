import { act, render } from '@testing-library/react';
import { Search } from './search.component';

describe('Search', () => {
  it('should pass down props', async () => {
    const dataTest = `search-${Date.now()}`;
    const placeholder = `anything-${Date.now()}`;
    const screen = await act(() =>
      render(
        <Search dataTest={dataTest} placeholder={placeholder} />,
      ),
    );

    const search = screen.getByTestId(dataTest);

    expect(search).toBeInTheDocument();
  });
});
