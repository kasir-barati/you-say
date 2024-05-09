import { Meta, StoryObj } from '@storybook/react';
import { SignUpButton } from './sign-up-modal.component';

type Story = StoryObj<typeof SignUpButton>;

export default {
  component: SignUpButton,
} satisfies Meta<typeof SignUpButton>;

export const Default: Story = {};
