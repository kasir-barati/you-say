import { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import NotFound from './not-found';

type Story = StoryObj<typeof NotFound>;

export default {
  component: NotFound,
} satisfies Meta<typeof NotFound>;

export const Default: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    const title = canvas.getByTestId('404-title');
    const message = canvas.getByTestId('404-message');
    const link = canvas.getByTestId('404-link');

    expect(title).toHaveClass(
      'text-9xl',
      'font-bold',
      'text-slate-400',
    );
    expect(message).toHaveClass(
      'text-xl',
      'tracking-wider',
      'text-slate-600',
    );
    expect(link).toHaveClass('text-sm', 'text-blue-400');
  },
};
