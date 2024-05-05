import { Meta, StoryObj } from '@storybook/react';
import { SubHeader } from './sub-header.component';

type Story = StoryObj<typeof SubHeader>;

export default {
  component: SubHeader,
} satisfies Meta<typeof SubHeader>;

export const Default: Story = {};
