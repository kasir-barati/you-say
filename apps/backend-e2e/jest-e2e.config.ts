import type { Config } from 'jest';

/* eslint-disable */
export default {
  displayName: 'backend-e2e',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/backend-e2e',
  testMatch: ['**/*.e2e-spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-env.ts'],
  detectOpenHandles: true,
} satisfies Config;
