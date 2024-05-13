import { Meta, StoryObj } from '@storybook/react';
import { SingOutButton } from './sign-out.component';

type Story = StoryObj<typeof SingOutButton>;

export default {
  component: SingOutButton,
} satisfies Meta<typeof SingOutButton>;

export const Default: Story = {};
