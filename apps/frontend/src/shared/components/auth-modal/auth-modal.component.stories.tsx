import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { AuthModal } from './auth-modal.component';

type Story = StoryObj<typeof AuthModal>;

export default {
  component: AuthModal,
} satisfies Meta<typeof AuthModal>;

export const OpenSignIn: Story = {
  args: {
    closeModal: fn(),
    isOpen: true,
    defaultModal: 'signIn',
  },
};

export const OpenSignUp: Story = {
  args: {
    closeModal: fn(),
    isOpen: true,
    defaultModal: 'signUp',
  },
  render(args) {
    return (
      <MockProvider>
        <AuthModal {...args} />
      </MockProvider>
    );
  },
};
