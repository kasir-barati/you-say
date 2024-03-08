const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/you-say'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};