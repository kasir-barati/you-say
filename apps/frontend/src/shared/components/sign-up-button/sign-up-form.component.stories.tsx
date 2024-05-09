import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { SignUpForm } from './sign-up-form.component';

type Story = StoryObj<typeof SignUpForm>;

export default {
  component: SignUpForm,
  args: {
    closeModal: fn(),
  },
  render(args) {
    return (
      <MockProvider>
        <SignUpForm {...args} />
      </MockProvider>
    );
  },
} satisfies Meta<typeof SignUpForm>;

export const Default: Story = {};
