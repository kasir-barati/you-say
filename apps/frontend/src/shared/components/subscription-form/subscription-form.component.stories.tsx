import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, within } from '@storybook/test';
import { SubscriptionForm } from './subscription-form.component';

type Story = StoryObj<typeof SubscriptionForm>;

export default {
  component: SubscriptionForm,
  args: {
    closeModalHandler: fn(),
  },
} satisfies Meta<typeof SubscriptionForm>;

export const Default: Story = {
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);
    const submit = canvas.getByTestId('subscribe-button');
    await fireEvent.click(submit);
    expect(args.closeModalHandler).toHaveBeenCalledTimes(1);
  },
};
