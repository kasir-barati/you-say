import { Meta, StoryObj } from '@storybook/react';
import { WhiteTextField } from './white-textfield.component';

type Story = StoryObj<typeof WhiteTextField>;

export default {
  component: WhiteTextField,
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    name: 'TextField',
    label: 'Text Field',
    placeholder: 'Text field',
  },
} satisfies Meta<typeof WhiteTextField>;

export const Default: Story = {};
