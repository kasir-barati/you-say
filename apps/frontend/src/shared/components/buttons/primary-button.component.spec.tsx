import { act, fireEvent, render } from '@testing-library/react';
import { ReactNode } from 'react';
import {
  PrimaryButton,
  PrimaryButtonProps,
} from './primary-button.component';

describe('PrimaryButton', () => {
  it.each<Required<PrimaryButtonProps>>([
    {
      className: 'abc',
      dataTest: 'test1',
      onClick: jest.fn(),
      type: 'button',
    },
    {
      className: 'ghe',
      dataTest: 'test2',
      onClick: jest.fn(),
      type: 'reset',
    },
  ])('should pass args to the PrimaryButton', async (props) => {
    const screen = await act(() =>
      render(<PrimaryButton {...props} />),
    );
    const primaryButtonByDataTest = screen.getByTestId(
      props.dataTest,
    );

    act(() => fireEvent.click(primaryButtonByDataTest));

    expect(props.onClick).toHaveBeenCalledTimes(1);
    expect(primaryButtonByDataTest).toBeInTheDocument();
    expect(primaryButtonByDataTest).toHaveClass(props.className);
  });

  it('should have used the default dataTest', async () => {
    const screen = await act(() => render(<PrimaryButton />));

    const primaryButtonByDataTest =
      screen.getByTestId('primary-button');

    expect(primaryButtonByDataTest).toBeInTheDocument();
  });

  it.each<ReactNode>(['string', 123, <h1>poker</h1>])(
    'should pass down any ReactNode as children',
    async (children) => {
      const screen = await act(() =>
        render(<PrimaryButton>{children}</PrimaryButton>),
      );

      const primaryButton = screen.getByTestId('primary-button');

      expect(primaryButton).toBeInTheDocument();
    },
  );
});
