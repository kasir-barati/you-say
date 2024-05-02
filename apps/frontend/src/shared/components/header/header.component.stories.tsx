import { Meta, StoryObj } from '@storybook/react';
import { Header } from './header.component';

type Story = StoryObj<typeof Header>;

export default {
  component: Header,
} satisfies Meta<typeof Header>;

export const Default: Story = {};
