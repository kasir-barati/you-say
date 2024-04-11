import { Meta, StoryObj } from '@storybook/react';
import {
  expect,
  fireEvent,
  fn,
  waitFor,
  within,
} from '@storybook/test';
import { createMock } from 'storybook-addon-module-mock';
import * as authApi from '../../api/auth.api';
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
  parameters: {
    moduleMock: {
      mock() {
        const mock = createMock(authApi, 'useSignUpMutation');
        mock.mockReturnValue({ unwrap: Promise.resolve() });
        return [mock];
      },
    },
  },
  async play({ canvasElement, args }) {
    const canvas = within(canvasElement);
    const submit = canvas.getByTestId('sign-up-button');
    await fireEvent.click(submit);
    await waitFor(() =>
      expect(args.closeModalHandler).toHaveBeenCalledTimes(1),
    );
    await waitFor(() =>
      expect(
        canvas.getByText("You're now one of our users!"),
      ).toBeInTheDocument(),
    );
  },
};
