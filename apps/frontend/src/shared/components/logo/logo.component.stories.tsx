import { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo.component';

type Story = StoryObj<typeof Logo>;

export default {
  component: Logo,
} satisfies Meta<typeof Logo>;

// TODO: when theme is added, configure the font family
export const Default: Story = {
  args: {
    variant: 'h1',
    color: 'black',
  },
};
