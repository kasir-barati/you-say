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
  detectOpenHandles: true,
  testMatch: ['**/*.spec-e2e.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-env.ts'],
} satisfies Config;
