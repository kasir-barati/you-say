import { Meta, StoryObj } from '@storybook/react';
import { DefaultCoverImage } from './default-cover-image.component';

type Story = StoryObj<typeof DefaultCoverImage>;

export default {
  component: DefaultCoverImage,
} satisfies Meta<typeof DefaultCoverImage>;

export const Default: Story = {};
