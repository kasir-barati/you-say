import { Meta, StoryObj } from '@storybook/react';
import { Application } from './application.component';

type Story = StoryObj<typeof Application>;

export default {
  component: Application,
  parameters: {
    backgrounds: { default: 'dark' },
  },
} satisfies Meta<typeof Application>;

export const Default: Story = {};
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
