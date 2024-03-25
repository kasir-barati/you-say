import { Store } from '@reduxjs/toolkit';
import { SinonMock } from '@shared';
import { act, render } from '@testing-library/react';
import { RootState } from '../../store';
import { Application } from './application.component';

jest.mock('../../store', () => {
  return {
    useAppSelector: jest.fn().mockReturnValue([]),
    useAppDispatch: jest.fn().mockReturnValue(jest.fn()),
  };
});

describe('Application', () => {
  it('should show application component', async () => {
    const store = SinonMock.with<Store<RootState>>({});

    const screen = await act(() =>
      render(<Application store={store} />),
    );

    expect(screen).toBeDefined();
  });
});
