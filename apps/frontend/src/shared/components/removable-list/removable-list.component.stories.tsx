import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RemovableList } from './removable-list.component';

type Story = StoryObj<typeof RemovableList>;

export default {
  component: RemovableList,
  args: {
    onRemove: fn(),
    values: ['item #1', 'item #2', 'item #3'],
  },
} satisfies Meta<typeof RemovableList>;

export const Default: Story = {};
