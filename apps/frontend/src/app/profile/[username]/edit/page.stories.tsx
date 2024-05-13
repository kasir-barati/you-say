import { Meta, StoryObj } from '@storybook/react';
import EditProfile from './page';

type Story = StoryObj<typeof EditProfile>;

export default {
  component: EditProfile,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    params: {
      username: 'Username',
    },
  },
} satisfies Meta<typeof EditProfile>;

export const Default: Story = {};
