import { act, render } from '@testing-library/react';
import { SubscriptionForm } from './subscription-form.component';

describe('SubscriptionForm', () => {
  it('should show a subscription form', async () => {
    const screen = await act(() => render(<SubscriptionForm />));

    const subscriptionForm = screen.getByTestId('subscription-form');

    expect(subscriptionForm).toBeInTheDocument();
  });
});
