import type { Config } from 'jest';
// I was not able to use @shared even though VSCode suggests it. So I had to use relative path
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NodeEnv } from '../../libs/shared/src';

process.env.NODE_ENV = NodeEnv.test;

/* eslint-disable */
export default {
  displayName: 'backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/backend',
} satisfies Config;
