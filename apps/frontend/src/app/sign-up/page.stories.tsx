import { Meta, StoryObj } from '@storybook/react';
import { MockProvider } from '../../shared/test-utils/mock-provider.test-util';
import SignUp from './page';

type Story = StoryObj<typeof SignUp>;

export default {
  component: SignUp,
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  render() {
    return (
      <MockProvider>
        <SignUp />
      </MockProvider>
    );
  },
} satisfies Meta<typeof SignUp>;

export const Default: Story = {};
