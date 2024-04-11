import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, within } from '@storybook/test';
import { ModalHeader } from './modal-header.component';

type Story = StoryObj<typeof ModalHeader>;

export default {
  component: ModalHeader,
  args: {
    title: 'Modal Header',
  },
} satisfies Meta<typeof ModalHeader>;

export const Default: Story = {};

export const WithCloseButton: Story = {
  args: {
    onClick: fn(),
    closeButton: true,
  },
  async play({ canvasElement, step }) {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByTestId('close-modal');

    await step(
      'validate when close button is clicked onClick is being called',
      async ({ args }) => {
        await fireEvent.click(closeButton);
        expect(args.onClick).toHaveBeenCalledTimes(1);
      },
    );
    await step('validate UI/UX design of close button', () => {
      expect(closeButton).toHaveClass(
        'absolute',
        'right-6',
        'top-6',
        'rounded-lg',
        'text-gray-300',
        'transition-colors',
        'hover:text-gray-600',
      );
    });
  },
};
