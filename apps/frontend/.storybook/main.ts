import type { StorybookConfig } from '@storybook/nextjs';
import { join, resolve } from 'path';

export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-module-mock',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: resolve(
        process.cwd(),
        'apps',
        'frontend',
        'next.config.js',
      ),
    },
  },
  staticDirs: [join(__dirname, '..', 'public')],
  core: {
    disableProjectJson: true,
    enableCrashReports: true,
  },
} satisfies StorybookConfig;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
