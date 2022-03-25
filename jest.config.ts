import type { Config } from '@jest/types';

import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

const config: Config.InitialOptions = {
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    moduleDirectories: ['node_modules', '.'],
    modulePaths: [compilerOptions.baseUrl],
    moduleFileExtensions: ['js', 'json', 'ts'],
    verbose: true,
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
};

export default config;
