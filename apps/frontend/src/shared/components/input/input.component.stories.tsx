import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Input } from './input.component';

type Story = StoryObj<typeof Input>;

export default {
  component: Input,
  args: {
    placeholder: 'placeholder',
    onChange: fn(),
    type: 'text',
  },
} satisfies Meta<typeof Input>;

export const Default: Story = {
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId('input');
    await userEvent.type(input, 'typed input', { delay: 1 });
    expect(args.onChange).toHaveBeenCalled();
    expect(input).toHaveValue('typed input');
    expect(input).toHaveClass(
      'rounded-lg',
      'border',
      'border-neutral-200',
      'p-3',
      'transition-all',
      'focus:border-neutral-400',
      'focus:outline-none',
    );
  },
};
