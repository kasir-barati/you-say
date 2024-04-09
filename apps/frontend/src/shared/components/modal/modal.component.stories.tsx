import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, within } from '@storybook/test';
import { Modal } from './modal.component';

/**
 * @readme We have not tested a fully functional Modal here to verify that it closes and opens when it should since those will be implemented in the consumer and not this component.
 */

type Story = StoryObj<typeof Modal>;

export default {
  component: Modal,
  args: {
    open: false,
    onClose: fn(),
    children: <h1>Children</h1>,
  },
} satisfies Meta<typeof Modal>;

export const CloseModal: Story = {
  play({ canvasElement, step }) {
    const canvas = within(canvasElement);
    const modal = canvas.getByTestId('modal');

    step('validate it is not visible', () => {
      expect(modal).not.toBeVisible();
    });

    step(
      'validate it calls onClose when clicked on modal',
      async ({ args }) => {
        await fireEvent.click(modal);
        expect(args.onClose).toHaveBeenCalledTimes(1);
      },
    );
  },
};

export const OpenModal: Story = {
  args: {
    open: true,
  },
  play({ canvasElement }) {
    const canvas = within(canvasElement);
    const modal = canvas.getByTestId('modal');

    expect(modal).toBeVisible();
  },
};
