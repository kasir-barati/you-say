import { Meta, StoryObj } from '@storybook/react';
import Shop from './page';

type Story = StoryObj<typeof Shop>;

export default {
  component: Shop,
} satisfies Meta<typeof Shop>;

export const Default: Story = {};
