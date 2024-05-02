import type { Preview } from '@storybook/react';
import { configure } from '@storybook/test';
import { Roboto } from 'next/font/google';
import '../src/app/global.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

configure({ testIdAttribute: 'data-test' });

export default {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className={roboto.className}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Preview;
