import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CountDown } from './countdown.component';

type Story = StoryObj<typeof CountDown>;

export default {
  component: CountDown,
  parameters: {
    backgrounds: { default: 'dark' },
  },
} satisfies Meta<typeof CountDown>;

export const Default: Story = {
  args: {
    duration: 40,
    onComplete: fn(),
    countdownCurrentPercentage: 100,
  },
};

export const SeventyPercent: Story = {
  args: {
    duration: 40,
    onComplete: fn(),
    countdownCurrentPercentage: 70,
  },
};
