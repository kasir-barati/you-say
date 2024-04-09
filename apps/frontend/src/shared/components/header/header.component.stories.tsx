import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, within } from '@storybook/test';
import { Header } from './header.component';

type Story = StoryObj<typeof Header>;

export default {
  component: Header,
} satisfies Meta<typeof Header>;

export const Default: Story = {
  play({ canvasElement, step }) {
    const canvas = within(canvasElement);

    // TODO: write UI/UX tests for sign-up modal

    step('Validate sign-in modal', async () => {
      const signInButtonInHeader = canvas.getByTestId(
        'sign-in-button-in-header',
      );
      const continueSignInLink: HTMLLinkElement =
        canvas.getByTestId('sign-in-button');
      const signInModal = canvas.getByTestId('sign-in-modal');
      const signInCloseButtonInModalHeader = canvas.getByTestId(
        'sign-in-close-button-in-modal-header',
      );

      expect(signInModal).not.toBeVisible();
      await fireEvent.click(signInButtonInHeader);
      expect(signInModal).toBeVisible();
      expect(continueSignInLink).toHaveAttribute(
        'href',
        'http://localhost:3001/auth/login',
      );
      await fireEvent.click(signInCloseButtonInModalHeader);
      expect(signInModal).not.toBeVisible();
    });
  },
};
