import { act, render } from '@testing-library/react';
import { SignInForm } from './sign-in-form.component';

describe('SignInForm', () => {
  it('should be defined', async () => {
    const screen = await act(() => render(<SignInForm />));

    expect(screen).toBeDefined();
  });
});
