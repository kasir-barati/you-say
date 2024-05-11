import { Meta, StoryObj } from '@storybook/react';
import { MockProvider } from '../../../test-utils/mock-provider.test-util';
import { MobileToolbar } from './mobile-toolbar.componenrt';

type Story = StoryObj<typeof MobileToolbar>;

export default {
  component: MobileToolbar,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark' },
  },
  args: { id: 'id' },
  render(args) {
    return (
      <MockProvider>
        <MobileToolbar {...args} />
      </MockProvider>
    );
  },
} satisfies Meta<typeof MobileToolbar>;

export const Default: Story = {};
