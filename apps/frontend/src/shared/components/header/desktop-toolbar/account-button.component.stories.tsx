import { Meta, StoryObj } from '@storybook/react';
import { MockProvider } from '../../../test-utils/mock-provider.test-util';
import { AccountButton } from './account-button.component';

type Story = StoryObj<typeof AccountButton>;

export default {
  component: AccountButton,
  render() {
    return (
      <MockProvider>
        <AccountButton />
      </MockProvider>
    );
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
} satisfies Meta<typeof AccountButton>;

export const Default: Story = {};
