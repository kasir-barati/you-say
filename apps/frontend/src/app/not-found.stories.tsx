import { Meta, StoryObj } from '@storybook/react';
import NotFound from './not-found';

type Story = StoryObj<typeof NotFound>;

export default {
  component: NotFound,
} satisfies Meta<typeof NotFound>;

export const Default: Story = {};
