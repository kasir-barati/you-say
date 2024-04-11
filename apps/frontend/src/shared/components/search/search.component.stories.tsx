import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Search } from './search.component';

type Story = StoryObj<typeof Search>;

export default {
  component: Search,
} satisfies Meta<typeof Search>;

export const Default: Story = {
  args: {
    placeholder: 'Default story',
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId('search');
    await userEvent.type(search, 'Some gibberish text', {
      delay: 100,
    });
    const searchCleanerButton = canvas.getByTestId(
      'search-cleaner-button',
    );
    await userEvent.click(searchCleanerButton);
    expect(search).not.toHaveValue();
  },
};
