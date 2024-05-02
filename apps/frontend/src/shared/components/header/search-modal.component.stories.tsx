import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { SearchModal } from './search-modal.component';

type Story = StoryObj<typeof SearchModal>;

export default {
  component: SearchModal,
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
} satisfies Meta<typeof SearchModal>;

export const Default: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const searchIconButton = canvas.getByTestId('search-icon-button');
    await userEvent.click(searchIconButton);
  },
};
