import { Meta, StoryObj } from '@storybook/react';
import {
  expect,
  fireEvent,
  fn,
  waitFor,
  within,
} from '@storybook/test';
import { MockProvider } from '../../test-utils/mock-provider.test-util';
import { SignUpForm } from './sign-up-form.component';

type Story = StoryObj<typeof SignUpForm>;

// TODO: Mock mutation and test both successful and failed attempts: storybook-addon-module-mock
export default {
  component: SignUpForm,
  args: {
    closeModalHandler: fn(),
  },
  render(args) {
    return (
      <MockProvider>
        <SignUpForm {...args} />
      </MockProvider>
    );
  },
} satisfies Meta<typeof SignUpForm>;

export const Default: Story = {
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);
    const submit = canvas.getByTestId('sign-up-button');
    await fireEvent.click(submit);
    await waitFor(() =>
      expect(args.closeModalHandler).toHaveBeenCalledTimes(1),
    );
  },
};
