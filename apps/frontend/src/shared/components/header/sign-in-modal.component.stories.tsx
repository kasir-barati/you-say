import { Meta, StoryObj } from '@storybook/react';
import { SignInModal } from './sign-in-modal.component';

type Story = StoryObj<typeof SignInModal>;

export default {
  component: SignInModal,
} satisfies Meta<typeof SignInModal>;

export const Default: Story = {};
