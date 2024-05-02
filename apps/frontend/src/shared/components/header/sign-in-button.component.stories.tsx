import { Meta, StoryObj } from '@storybook/react';
import { SignInButton } from './sign-in-button.component';

type Story = StoryObj<typeof SignInButton>;

export default {
  component: SignInButton,
} satisfies Meta<typeof SignInButton>;

export const Default: Story = {};
