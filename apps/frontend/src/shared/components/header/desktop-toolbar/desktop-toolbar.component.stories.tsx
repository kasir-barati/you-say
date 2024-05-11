import { Meta, StoryObj } from '@storybook/react';
import { DesktopToolbar } from './desktop-toolbar.component';

type Story = StoryObj<typeof DesktopToolbar>;

export default {
  component: DesktopToolbar,
  args: {
    id: 'id',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
} satisfies Meta<typeof DesktopToolbar>;

export const Default: Story = {};
