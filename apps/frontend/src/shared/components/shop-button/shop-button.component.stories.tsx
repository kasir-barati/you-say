import { Meta, StoryObj } from '@storybook/react';
import { ShopButton } from './shop-button.component';

type Story = StoryObj<typeof ShopButton>;

export default {
  component: ShopButton,
} satisfies Meta<typeof ShopButton>;

export const Default: Story = {};
