import { act, render } from '@testing-library/react';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { SignUpForm } from './sign-up-form.component';

describe('SignUpForm', () => {
  it('should show sign up form', async () => {
    const screen = await act(() =>
      render(
        <MockProvider>
          <SignUpForm closeModalHandler={jest.fn()} />
        </MockProvider>,
      ),
    );

    const singUpForm = screen.getByTestId('sign-up-form');

    expect(singUpForm).toBeInTheDocument();
  });
});
