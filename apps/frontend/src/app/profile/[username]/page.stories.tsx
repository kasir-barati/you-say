import { Meta, StoryObj } from '@storybook/react';
import Profile from './page';

type Story = StoryObj<typeof Profile>;

export default {
  component: Profile,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    params: { username: 'Username' },
  },
} satisfies Meta<typeof Profile>;

export const Default: Story = {};
