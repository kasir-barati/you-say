import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Editor from './editor-component';

type Story = StoryObj<typeof Editor>;

export default {
  component: Editor,
  args: {
    markdown: '# Hello',
  },
} satisfies Meta<typeof Editor>;
export const Default: Story = {};
export const Editable: Story = {
  args: {
    readonly: false,
    onChange: fn(),
  },
};
