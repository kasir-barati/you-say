import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, within } from '@storybook/test';
import { PrimaryButton } from './primary-button.component';

type Story = StoryObj<typeof PrimaryButton>;

export default {
  component: PrimaryButton,
  args: {
    onClick: fn(),
    type: 'button',
    children: 'Button',
  },
} satisfies Meta<typeof PrimaryButton>;

export const Default: Story = {
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);
    const primaryButton = canvas.getByTestId('primary-button');

    await fireEvent.click(primaryButton);

    expect(primaryButton).toHaveClass(
      'rounded-lg',
      'bg-rose-600',
      'px-8',
      'py-2',
      'text-white',
    );
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
