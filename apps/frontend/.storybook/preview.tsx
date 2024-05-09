import type { Preview } from '@storybook/react';
import { configure } from '@storybook/test';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { Roboto } from 'next/font/google';
import '../src/app/global.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

initialize({
  onUnhandledRequest: ({ url, method }) => {
    console.error(
      `Unhandled ${method} request to ${url}.
      This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.
      If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses`,
    );
  },
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
  loaders: [mswLoader],
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
