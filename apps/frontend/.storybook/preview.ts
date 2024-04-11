import type { Preview } from '@storybook/react';
import { configure } from '@storybook/test';
import '../src/app/global.css';

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
} satisfies Preview;
