import { act, fireEvent, render } from '@testing-library/react';
import { Form } from './form.component';

describe('Form', () => {
  it('should show a form', async () => {
    const submitHandler = jest.fn();
    const screen = await act(() =>
      render(<Form dataTest="form1" onSubmit={submitHandler} />),
    );

    const form = screen.getByTestId('form1');

    expect(form).toBeInTheDocument();
  });

  // TODO: move me to storybook
  it('should call onSubmit when form is being submitted', async () => {
    const submitHandler = jest.fn();
    const screen = await act(() =>
      render(<Form dataTest="form" onSubmit={submitHandler} />),
    );
    const form = screen.getByTestId('form');

    fireEvent.submit(form);

    expect(submitHandler).toHaveBeenCalledTimes(1);
  });
});
